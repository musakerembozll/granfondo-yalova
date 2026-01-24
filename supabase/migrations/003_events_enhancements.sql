-- Migration: Events System Enhancements
-- Description: Add active event, photos, theme colors, and dynamic theming support
-- Date: 2026-01-25

-- Step 1: Add new columns to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS active_event BOOLEAN DEFAULT false;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS background_image_url TEXT;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS theme_color TEXT; -- OKLCH color format

ALTER TABLE events
ADD COLUMN IF NOT EXISTS applications_open BOOLEAN DEFAULT true;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS short_price DECIMAL(10, 2);

ALTER TABLE events
ADD COLUMN IF NOT EXISTS long_price DECIMAL(10, 2);

-- Step 2: Create index for active event lookups
CREATE INDEX IF NOT EXISTS idx_events_active_event ON events(active_event) WHERE active_event = true;

-- Step 3: Ensure only one active event at a time (enforced by application logic)
-- We'll use a unique partial index to enforce this at database level
CREATE UNIQUE INDEX IF NOT EXISTS idx_events_single_active 
ON events(active_event) 
WHERE active_event = true;

-- Step 4: Add comments for documentation
COMMENT ON COLUMN events.active_event IS 'Whether this event is the currently active/main event displayed on homepage';
COMMENT ON COLUMN events.photo_url IS 'Event photo URL for display and color extraction';
COMMENT ON COLUMN events.description IS 'Event description text';
COMMENT ON COLUMN events.background_image_url IS 'Background image URL for homepage hero section';
COMMENT ON COLUMN events.theme_color IS 'Theme color in OKLCH format, extracted from photo';
COMMENT ON COLUMN events.applications_open IS 'Whether applications are currently open for this event';
COMMENT ON COLUMN events.short_price IS 'Price for short route category';
COMMENT ON COLUMN events.long_price IS 'Price for long route category';

-- Step 5: Create site_content table for dynamic content if it doesn't exist
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    section VARCHAR(50),
    content_type VARCHAR(20) DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);

-- Step 6: Create about_page_content table for hakkinda page dynamic content
CREATE TABLE IF NOT EXISTS about_page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL, -- 'stats', 'values', 'team', 'story'
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_page_content_type ON about_page_content(content_type);

-- Step 7: Add trigger for updated_at on new tables
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_page_content_updated_at
    BEFORE UPDATE ON about_page_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Insert default about page content structure
INSERT INTO about_page_content (content_type, data) VALUES
('story', '{
    "title": "Hikayemiz",
    "paragraphs": [
        "GranFondo Yalova, bisiklet severlerin doğayla buluştuğu, sınırlarını zorladığı ve unutulmaz anılar biriktirdiği bir platform olarak 2023 yılında hayata geçti. İlk yılımızda 800 katılımcıyla başlayan serüvenimiz, her yıl büyüyerek Türkiye''nin en çok tercih edilen Gran Fondo etkinliklerinden biri haline geldi.",
        "Yalova''nın eşsiz coğrafyası - deniz seviyesinden başlayıp 800 metreye tırmanan zorlu rotaları, Marmara Denizi''nin muhteşem manzarası ve yemyeşil ormanlarla çevrili parkurları - her pedal darbesiyle ayrı bir deneyim sunuyor.",
        "Amacımız sadece bir yarış düzenlemek değil; bisiklet kültürünü yaymak, sporculara güvenli ve profesyonel bir ortam sunmak ve Yalova''yı bisiklet turizminin merkezi haline getirmektir."
    ]
}'::jsonb),
('stats', '[
    {"icon": "Calendar", "value": "4", "label": "Yıldır Düzenleniyor"},
    {"icon": "Users", "value": "5000+", "label": "Toplam Katılımcı"},
    {"icon": "Trophy", "value": "50+", "label": "Ödül Dağıtıldı"},
    {"icon": "Heart", "value": "100+", "label": "Gönüllü"}
]'::jsonb),
('values', '[
    {"icon": "Target", "title": "Misyonumuz", "description": "Bisiklet sporunu Türkiye''de yaygınlaştırmak, her yaştan ve seviyeden sporcuya erişilebilir etkinlikler sunmak."},
    {"icon": "Mountain", "title": "Deneyim", "description": "Yalova''nın eşsiz doğası, Marmara manzarası ve zorlu tırmanışlarla dolu parkurlar sizleri bekliyor."},
    {"icon": "Award", "title": "Kalite", "description": "Uluslararası standartlarda organizasyon, profesyonel zamanlama sistemi ve güvenli parkur tasarımı."},
    {"icon": "MapPin", "title": "Konum", "description": "İstanbul''a 1 saat mesafede, kolay ulaşım, zengin konaklama seçenekleri ve muhteşem doğa."}
]'::jsonb),
('team', '[
    {"name": "Organizasyon Komitesi", "role": "Yalova Belediyesi işbirliğiyle"},
    {"name": "Teknik Ekip", "role": "Türkiye Bisiklet Federasyonu onaylı"},
    {"name": "Sağlık Ekibi", "role": "Her istasyonda ambulans ve ilk yardım"},
    {"name": "Güvenlik", "role": "Tüm parkur boyunca trafik kontrolü"}
]'::jsonb)
ON CONFLICT DO NOTHING;
