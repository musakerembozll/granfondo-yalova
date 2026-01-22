import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get all registered users with emails
        const { data: users, error } = await supabase
            .from('user_profiles')
            .select('id, full_name')

        if (error) {
            throw new Error('Failed to fetch users')
        }

        // Get emails from auth.users (via user_profiles join)
        const { data: authUsers } = await supabase
            .from('auth.users')
            .select('id, email')

        // Since we can't directly query auth.users, we'll use a different approach
        // Get user emails from applications table (users who have applied before)
        // OR we need to store email in user_profiles

        // For now, let's get unique emails from both sources
        const { data: applicationsEmails } = await supabase
            .from('applications')
            .select('email, full_name')

        // Get unique emails
        const emailSet = new Map<string, string>()

        if (users) {
            // Note: We'd need to store email in user_profiles for this to work
            // For now, we'll rely on applications
        }

        if (applicationsEmails) {
            applicationsEmails.forEach(app => {
                if (app.email && !emailSet.has(app.email)) {
                    emailSet.set(app.email, app.full_name || 'Değerli Katılımcı')
                }
            })
        }

        let sentCount = 0
        let errorCount = 0

        // Send notification emails
        for (const [email, name] of emailSet) {
            try {
                await sendEmail({
                    to: email,
                    subject: '🚴 GranFondo Yalova - Başvurular Açıldı!',
                    html: getApplicationsOpenHtml(name)
                })
                sentCount++
            } catch (err) {
                console.error(`Failed to send to ${email}:`, err)
                errorCount++
            }
        }

        // Log the notification
        await supabase.from('email_logs').insert({
            type: 'applications_open',
            subject: 'Başvurular Açıldı Duyurusu',
            recipients_count: sentCount,
            error_count: errorCount,
            sent_at: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            message: `${sentCount} kullanıcıya bildirim gönderildi`,
            sentCount,
            errorCount
        })

    } catch (error) {
        console.error('Send notification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

function getApplicationsOpenHtml(name: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; font-size: 32px; margin: 0;">🚴 GranFondo Yalova</h1>
            </div>

            <!-- Main Card -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 16px; padding: 32px; margin-bottom: 20px;">
                
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 12px 24px; border-radius: 50px;">
                        <span style="color: white; font-size: 18px; font-weight: 600;">🎉 Başvurular Açıldı!</span>
                    </div>
                </div>

                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
                    Merhaba ${name}! 👋
                </h2>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px; text-align: center;">
                    Heyecan verici bir haberimiz var! <strong style="color: #10b981;">GranFondo Yalova 2026</strong> 
                    etkinliği için başvurular <strong style="color: #ffffff;">artık açık!</strong>
                </p>

                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 32px; text-align: center;">
                    Yerinizi garantilemek için hemen başvurunuzu yapın. Kontenjan sınırlıdır!
                </p>

                <!-- CTA Button -->
                <div style="text-align: center;">
                    <a href="https://www.sporlayalova.com/basvuru" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 18px;">
                        Hemen Başvur
                    </a>
                </div>
            </div>

            <!-- Features -->
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Etkinlik Özellikleri:</h3>
                <ul style="color: #94a3b8; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0;">
                    <li>🏆 Uzun Parkur: 98 km</li>
                    <li>🚴 Kısa Parkur: 55 km</li>
                    <li>📍 Yalova'nın eşsiz doğası</li>
                    <li>🎖️ Tüm katılımcılara madalya</li>
                </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #334155;">
                <p style="color: #64748b; font-size: 14px; margin: 0 0 10px 0;">
                    Sorularınız için: <a href="mailto:info@sporlayalova.com" style="color: #10b981;">info@sporlayalova.com</a>
                </p>
                <p style="color: #475569; font-size: 12px; margin: 0;">
                    © 2026 GranFondo Yalova. Tüm hakları saklıdır.
                </p>
            </div>
        </div>
    </body>
    </html>
    `
}
