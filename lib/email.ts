import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Logo URL - hosted on the website
const LOGO_URL = 'https://www.sporlayalova.com/logo.png'

interface EmailParams {
    to: string
    subject: string
    html: string
}

export async function sendEmail({ to, subject, html }: EmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'GranFondo Yalova <bildirim@sporlayalova.com>',
            to: [to],
            subject,
            html
        })

        if (error) {
            console.error('Email error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Email error:', error)
        return { success: false, error: 'Email gönderilemedi' }
    }
}

export function getApprovalEmailHtml(fullName: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo-img { height: 60px; width: auto; margin-bottom: 10px; }
            .logo-text { font-size: 24px; font-weight: bold; color: #10b981; }
            h1 { color: #10b981; font-size: 28px; margin-bottom: 20px; }
            p { line-height: 1.8; color: #cbd5e1; }
            .highlight { background: #10b981; color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 14px; }
            a { color: #10b981; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${LOGO_URL}" alt="GranFondo Yalova" class="logo-img" />
                <div class="logo-text">GranFondo Yalova 2026</div>
            </div>
            
            <h1>Tebrikler, ${fullName}!</h1>
            
            <p>Başvurunuz <strong>onaylanmıştır</strong>. GranFondo Yalova 2026'ya hoş geldiniz!</p>
            
            <div class="highlight">
                <strong>12 Eylül 2026</strong><br>
                Yarışta görüşmek üzere!
            </div>
            
            <p>Etkinlik detayları ve güncellemeler için web sitemizi takip etmeyi unutmayın.</p>
            
            <p>Sorularınız için: <a href="mailto:info@sporlayalova.com">info@sporlayalova.com</a></p>
            
            <div class="footer">
                © 2026 GranFondo Yalova | sporlayalova.com
            </div>
        </div>
    </body>
    </html>
    `
}

export function getRejectionEmailHtml(fullName: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo-img { height: 60px; width: auto; margin-bottom: 10px; }
            .logo-text { font-size: 24px; font-weight: bold; color: #10b981; }
            h1 { color: #f59e0b; font-size: 28px; margin-bottom: 20px; }
            p { line-height: 1.8; color: #cbd5e1; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 14px; }
            a { color: #10b981; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${LOGO_URL}" alt="GranFondo Yalova" class="logo-img" />
                <div class="logo-text">GranFondo Yalova 2026</div>
            </div>
            
            <h1>Sayın ${fullName},</h1>
            
            <p>Başvurunuz incelendi; ancak maalesef bu dönem için <strong>onaylanamamıştır</strong>.</p>
            
            <p>Bu durum çeşitli sebeplerden kaynaklanabilir:</p>
            <ul style="color: #94a3b8;">
                <li>Eksik veya hatalı bilgiler</li>
                <li>Ödeme dekontunun alınamaması</li>
                <li>Kontenjan dolulğu</li>
            </ul>
            
            <p>Detaylı bilgi için bizimle iletişime geçebilirsiniz: <a href="mailto:info@sporlayalova.com">info@sporlayalova.com</a></p>
            
            <div class="footer">
                © 2026 GranFondo Yalova | sporlayalova.com
            </div>
        </div>
    </body>
    </html>
    `
}
