-- Add hero image URL to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '/images/hero-image.jpg';

-- Update existing record if exists
UPDATE site_settings 
SET hero_image_url = '/images/hero-image.jpg' 
WHERE hero_image_url IS NULL;