-- Email Templates Table Migration
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  html_body TEXT NOT NULL,
  variables JSONB,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO email_templates (template_key, name, subject, html_body, variables, category) VALUES
(
  'approval',
  'Başvuru Onay',
  'GranFondo Yalova 2026 - Başvurunuz Onaylandı! 🎉',
  '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">GranFondo Yalova 2026</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9);">Başvurunuz Onaylandı!</p>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{fullName}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            GranFondo Yalova 2026''ya kayıt başvurunuz başarıyla onaylandı!
            Artık resmi olarak etkinliğimizin bir parçasısınız.
        </p>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #10b981; margin: 0 0 12px;">Kayıt Bilgileriniz</h3>
            <p style="margin: 4px 0;"><strong>Parkur:</strong> {{category}}</p>
            <p style="margin: 4px 0;"><strong>Tarih:</strong> 12 Eylül 2026</p>
            <p style="margin: 4px 0;"><strong>Lokasyon:</strong> Yalova</p>
        </div>
        <p style="line-height: 1.6; color: #94a3b8;">
            Sorularınız için <a href="mailto:info@sporlayalova.com" style="color: #10b981;">info@sporlayalova.com</a> adresine yazabilirsiniz.
        </p>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 24px; text-align: center; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">© 2026 GranFondo Yalova. Tüm hakları saklıdır.</p>
    </div>
</div>',
  '["fullName", "category", "email"]'::jsonb,
  'application'
),
(
  'rejection',
  'Başvuru Red',
  'GranFondo Yalova 2026 - Başvurunuz Hakkında',
  '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #ef4444, #dc2626); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">GranFondo Yalova 2026</h1>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{fullName}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            Maalesef başvurunuz bu aşamada onaylanamamıştır.
        </p>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #ef4444; margin: 0 0 12px;">Red Sebebi</h3>
            <p style="margin: 0;">{{reason}}</p>
        </div>
        <p style="line-height: 1.6; color: #94a3b8;">
            Sorularınız için <a href="mailto:info@sporlayalova.com" style="color: #10b981;">info@sporlayalova.com</a> adresine yazabilirsiniz.
        </p>
    </div>
</div>',
  '["fullName", "reason", "email"]'::jsonb,
  'application'
),
(
  'message_reply',
  'Mesaj Cevabı',
  'GranFondo Yalova - Mesajınız Hakkında',
  '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #10b981, #06b6d4); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">GranFondo Yalova</h1>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{name}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            Mesajınıza yanıt veriyoruz.
        </p>
        <div style="background: rgba(100, 116, 139, 0.2); border-left: 3px solid #64748b; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; color: #cbd5e1; font-style: italic;">{{originalMessage}}</p>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #10b981; margin: 0 0 12px;">Yanıtımız</h3>
            <p style="margin: 0; line-height: 1.6;">{{reply}}</p>
        </div>
        <p style="line-height: 1.6; color: #94a3b8; margin-top: 24px;">
            Başka sorularınız için bizimle iletişime geçebilirsiniz.
        </p>
        <p style="margin: 8px 0 0; color: #64748b; font-size: 14px;">
            — {{adminName}}
        </p>
    </div>
</div>',
  '["name", "originalMessage", "reply", "adminName"]'::jsonb,
  'message'
),
(
  'reminder_7day',
  '7 Gün Hatırlatma',
  'GranFondo Yalova - Etkinlik 1 Hafta Sonra!',
  '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #f59e0b, #f97316); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px;">⏰ Hatırlatma</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">Etkinlik Yaklaşıyor!</p>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{fullName}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            GranFondo Yalova 2026''ya sadece <strong>1 hafta</strong> kaldı!
        </p>
        <div style="background: linear-gradient(135deg, #f59e0b, #f97316); padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <div style="font-size: 48px; font-weight: bold; color: white; margin-bottom: 8px;">{{eventDate}}</div>
            <div style="font-size: 16px; color: rgba(255,255,255,0.9);">{{category}}</div>
        </div>
        <h3 style="color: #10b981; margin: 24px 0 12px;">Son Hazırlıklar</h3>
        <ul style="color: #cbd5e1; line-height: 1.8;">
            <li>Bisikletinizi kontrol edin</li>
            <li>Ekipmanlarınızı hazırlayın</li>
            <li>Yeterli dinlenmeye dikkat edin</li>
            <li>Parkur haritasını inceleyin</li>
        </ul>
        <p style="line-height: 1.6; color: #94a3b8; margin-top: 24px;">
            Yarışta görüşmek üzere! İyi şanslar! 🚴‍♂️
        </p>
    </div>
</div>',
  '["fullName", "eventDate", "category"]'::jsonb,
  'notification'
),
(
  'welcome',
  'Hoşgeldin',
  'GranFondo Yalova''ya Hoşgeldiniz!',
  '<div style="font-family: ''Segoe UI'', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 28px;">🎉 Hoşgeldiniz!</h1>
    </div>
    <div style="padding: 32px; color: #e2e8f0;">
        <p style="font-size: 18px; margin-bottom: 24px;">Merhaba <strong>{{fullName}}</strong>,</p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            GranFondo Yalova ailesine katıldığınız için teşekkür ederiz!
        </p>
        <p style="line-height: 1.6; margin-bottom: 16px;">
            Türkiye''nin en prestijli bisiklet etkinliklerinden biri olan GranFondo Yalova''da sizi görmekten mutluluk duyacağız.
        </p>
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #10b981; margin: 0 0 12px;">Neler Yapabilirsiniz?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #cbd5e1;">
                <li>Profilinizi tamamlayın</li>
                <li>Parkur bilgilerini inceleyin</li>
                <li>Galeriyi keşfedin</li>
                <li>SSS bölümünü okuyun</li>
            </ul>
        </div>
        <div style="text-align: center; margin-top: 32px;">
            <a href="https://sporlayalova.com" style="display: inline-block; background: linear-gradient(90deg, #10b981, #14b8a6); color: white; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold;">
                Siteyi Keşfedin
            </a>
        </div>
    </div>
</div>',
  '["fullName"]'::jsonb,
  'notification'
);

-- Create index on template_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_key ON email_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
