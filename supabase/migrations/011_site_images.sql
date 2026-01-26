-- Site Images tablosu (medya yönetimi için)
CREATE TABLE IF NOT EXISTS site_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    url TEXT DEFAULT '',
    alt_text VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_site_images_key ON site_images(key);

-- Varsayılan medya kayıtları
INSERT INTO site_images (key, url, alt_text) VALUES
    ('hero_video', '', 'Hero Video'),
    ('hero_image', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=1000&fit=crop&q=80', 'Hero Image'),
    ('logo', '/logo.svg', 'Site Logo'),
    ('favicon', '/favicon.ico', 'Favicon'),
    ('og_image', '/og-image.jpg', 'OG Image'),
    ('about_bg', '', 'About Background'),
    ('parkur_bg', '', 'Parkur Background'),
    ('contact_bg', '', 'Contact Background')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Allow public read site_images"
    ON site_images FOR SELECT
    USING (true);

-- Sadece service role yazabilir (admin API üzerinden)
CREATE POLICY "Service role can manage site_images"
    ON site_images FOR ALL
    USING (true)
    WITH CHECK (true);
