-- Visual Page Builder için gerekli tablo güncellemeleri
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- Hero Content tablosu (yoksa oluştur)
CREATE TABLE IF NOT EXISTS hero_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    button_text TEXT,
    background_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Section settings tablosuna order kolonu ekle
ALTER TABLE section_settings 
ADD COLUMN IF NOT EXISTS section_order TEXT[] DEFAULT '{}';

-- Site settings tablosuna yeni kolonlar ekle (iletişim sayfası için)
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Yalova Merkez, Türkiye',
ADD COLUMN IF NOT EXISTS working_hours TEXT DEFAULT 'Pazartesi - Cuma: 09:00 - 18:00',
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT;

-- Varsayılan hero içeriği ekle
INSERT INTO hero_content (title, subtitle, button_text, background_url)
SELECT 
    'GRAN FONDO YALOVA 2026',
    'Marmara''nın incisinde, eşsiz doğa ve zorlu parkurlarda pedallamaya hazır mısın?',
    'Hemen Kayıt Ol',
    ''
WHERE NOT EXISTS (SELECT 1 FROM hero_content LIMIT 1);

-- Güncelleme trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS hero_content_updated_at ON hero_content;
CREATE TRIGGER hero_content_updated_at
    BEFORE UPDATE ON hero_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
