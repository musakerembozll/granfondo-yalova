-- Migration: Events Branding
-- Description: Add site branding fields to events (logo, favicon, site title, hero content)
-- Date: 2026-01-26

-- Step 1: Add branding fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS site_title TEXT DEFAULT 'GranFondo Yalova';
ALTER TABLE events ADD COLUMN IF NOT EXISTS site_subtitle TEXT DEFAULT 'Yalova''nın Kalbinde';
ALTER TABLE events ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT '';

-- Step 2: Add hero section content
ALTER TABLE events ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS hero_cta_text TEXT DEFAULT 'Hemen Başvur';

-- Step 3: Add info section content
ALTER TABLE events ADD COLUMN IF NOT EXISTS info_title TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS info_subtitle TEXT DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS info_description TEXT DEFAULT '';

-- Step 4: Add comments
COMMENT ON COLUMN events.site_title IS 'Site title shown in browser tab and navbar';
COMMENT ON COLUMN events.site_subtitle IS 'Site subtitle/tagline';
COMMENT ON COLUMN events.logo_url IS 'Logo image URL for navbar';
COMMENT ON COLUMN events.favicon_url IS 'Favicon URL for browser tab';
COMMENT ON COLUMN events.hero_title IS 'Hero section main title';
COMMENT ON COLUMN events.hero_subtitle IS 'Hero section subtitle/description';
COMMENT ON COLUMN events.hero_cta_text IS 'Hero section call-to-action button text';
COMMENT ON COLUMN events.info_title IS 'Info section title';
COMMENT ON COLUMN events.info_subtitle IS 'Info section subtitle';
COMMENT ON COLUMN events.info_description IS 'Info section description text';

-- Step 5: Update GranFondo event with default values
UPDATE events
SET 
    site_title = 'GranFondo Yalova',
    site_subtitle = 'Yalova''nın Kalbinde',
    hero_title = 'GRAN FONDO YALOVA 2026',
    hero_subtitle = 'Marmara''nın incisinde, eşsiz doğa ve zorlu parkurlarda pedallamaya hazır mısın? Sınırlarını zorla, efsaneye ortak ol.',
    hero_cta_text = 'Hemen Başvur',
    info_title = 'Pedalların Gücü Doğayla Buluşuyor',
    info_subtitle = 'GranFondo Yalova, sadece bir yarış değil, aynı zamanda bir bisiklet festivalidir.',
    info_description = '2026 yılında dördüncü kez düzenlenecek olan bu organizasyon, amatör ruhla profesyonel bir deneyim yaşatmayı hedefliyor.'
WHERE title = 'GranFondo Yalova 2026';

-- Step 6: Update Swimming event with blue theme values
UPDATE events
SET 
    site_title = 'Yalova Açık Su Yüzme',
    site_subtitle = 'Marmara''nın Maviliğinde',
    hero_title = 'YALOVA AÇIK SU YÜZME 2026',
    hero_subtitle = 'Yalova''nın masmavi sularında unutulmaz bir yüzme deneyimi için hazır olun! Sınırlarınızı zorlayın.',
    hero_cta_text = 'Kayıt Ol',
    info_title = 'Dalgalarla Dans Et',
    info_subtitle = 'Yalova Açık Su Yüzme, sadece bir yarış değil, denizle bütünleşme festivalidir.',
    info_description = 'Profesyonel ve amatör yüzücüleri bir araya getiren bu etkinlik, eşsiz bir deneyim sunuyor.'
WHERE title LIKE '%Yüzme%';
