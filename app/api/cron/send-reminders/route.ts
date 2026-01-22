import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

// Vercel Cron Job - runs daily at 9:00 AM
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Get the date 7 days from now
        const sevenDaysFromNow = new Date()
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
        const targetDate = sevenDaysFromNow.toISOString().split('T')[0]

        // Get main event date
        const { data: mainEvent } = await supabase
            .from('events')
            .select('date, title')
            .eq('title', 'GranFondo Yalova 2026')
            .single()

        if (!mainEvent) {
            return NextResponse.json({ message: 'No main event found' })
        }

        const eventDate = new Date(mainEvent.date).toISOString().split('T')[0]

        // Check if the event is exactly 7 days away
        if (eventDate !== targetDate) {
            return NextResponse.json({
                message: 'Event is not 7 days away',
                eventDate,
                targetDate
            })
        }

        // Get all approved applications with emails
        const { data: applications } = await supabase
            .from('applications')
            .select('email, full_name, category')
            .eq('status', 'approved')

        if (!applications || applications.length === 0) {
            return NextResponse.json({ message: 'No approved applications' })
        }

        // Send reminder emails
        let sentCount = 0
        let errorCount = 0

        for (const app of applications) {
            try {
                await sendEmail({
                    to: app.email,
                    subject: '🚴 GranFondo Yalova - 1 Hafta Kaldı!',
                    html: getEventReminderHtml(app.full_name, mainEvent.date, app.category)
                })
                sentCount++
            } catch (error) {
                console.error(`Failed to send to ${app.email}:`, error)
                errorCount++
            }
        }

        // Log the reminder job
        await supabase.from('email_logs').insert({
            type: 'event_reminder',
            subject: '1 Hafta Hatırlatma',
            recipients_count: sentCount,
            error_count: errorCount,
            sent_at: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            message: `Sent ${sentCount} reminder emails, ${errorCount} failed`,
            sentCount,
            errorCount
        })

    } catch (error) {
        console.error('Reminder cron error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

function getEventReminderHtml(name: string, eventDate: string, category: string): string {
    const formattedDate = new Date(eventDate).toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const categoryText = category === 'long' ? 'Uzun Parkur (98 km)' : 'Kısa Parkur (55 km)'

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
                <p style="color: #64748b; margin-top: 10px;">1 Hafta Kaldı!</p>
            </div>

            <!-- Main Card -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 1px solid #334155; border-radius: 16px; padding: 32px; margin-bottom: 20px;">
                
                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">
                    Merhaba ${name}! 👋
                </h2>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                    Büyük gün yaklaşıyor! <strong style="color: #10b981;">GranFondo Yalova 2026</strong> etkinliğine sadece 
                    <strong style="color: #ffffff;">1 hafta</strong> kaldı.
                </p>

                <!-- Event Details Box -->
                <div style="background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <div style="margin-bottom: 15px;">
                        <div style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📅 Tarih</div>
                        <div style="color: #ffffff; font-size: 18px; font-weight: 600; margin-top: 4px;">${formattedDate}</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <div style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📍 Konum</div>
                        <div style="color: #ffffff; font-size: 18px; font-weight: 600; margin-top: 4px;">Yalova Sahil</div>
                    </div>
                    <div>
                        <div style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">🏆 Kategoriniz</div>
                        <div style="color: #10b981; font-size: 18px; font-weight: 600; margin-top: 4px;">${categoryText}</div>
                    </div>
                </div>

                <!-- Checklist -->
                <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">Hazırlık Listesi ✅</h3>
                <ul style="color: #94a3b8; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0 0 24px 0;">
                    <li>Bisikletinizi kontrol ettirin</li>
                    <li>Kask ve eldiveninizi hazırlayın</li>
                    <li>Numara kitinizi almak için kayıt noktasına uğrayın</li>
                    <li>Hava durumunu takip edin</li>
                    <li>İyi dinlenin ve bol su için!</li>
                </ul>

                <!-- CTA Button -->
                <div style="text-align: center;">
                    <a href="https://www.sporlayalova.com/profil" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px;">
                        Başvurumu Görüntüle
                    </a>
                </div>
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
