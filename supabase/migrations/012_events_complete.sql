-- Migration: Events System Complete
-- Description: Add payment, contact, video and theme settings to events
-- Date: 2026-01-26

-- Step 1: Add payment fields to events
ALTER TABLE events
ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT '';

ALTER TABLE events
ADD COLUMN IF NOT EXISTS account_holder TEXT DEFAULT '';

ALTER TABLE events
ADD COLUMN IF NOT EXISTS iban TEXT DEFAULT '';

-- Step 2: Add contact fields to events
ALTER TABLE events
ADD COLUMN IF NOT EXISTS contact_email TEXT DEFAULT '';

ALTER TABLE events
ADD COLUMN IF NOT EXISTS contact_phone TEXT DEFAULT '';

-- Step 3: Add video URL for hero section
ALTER TABLE events
ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT '';

-- Step 4: Add theme preset (predefined color schemes)
-- Options: emerald (default), blue, orange, red, purple, cyan, rose, amber
ALTER TABLE events
ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'emerald';

-- Step 5: Add comments
COMMENT ON COLUMN events.bank_name IS 'Bank name for payment';
COMMENT ON COLUMN events.account_holder IS 'Account holder name for payment';
COMMENT ON COLUMN events.iban IS 'IBAN for payment';
COMMENT ON COLUMN events.contact_email IS 'Contact email for this event';
COMMENT ON COLUMN events.contact_phone IS 'Contact phone for this event';
COMMENT ON COLUMN events.hero_video_url IS 'Video URL for homepage hero section';
COMMENT ON COLUMN events.theme_preset IS 'Theme color preset: emerald, blue, orange, red, purple, cyan, rose, amber';

-- Step 6: Update existing events with default values from site_settings
UPDATE events
SET 
    bank_name = COALESCE((SELECT bank_name FROM site_settings LIMIT 1), 'Ziraat Bankası'),
    account_holder = COALESCE((SELECT account_holder FROM site_settings LIMIT 1), 'GranFondo Yalova Spor Kulübü'),
    iban = COALESCE((SELECT iban FROM site_settings LIMIT 1), ''),
    contact_email = COALESCE((SELECT contact_email FROM site_settings LIMIT 1), 'info@granfondoyalova.com'),
    contact_phone = COALESCE((SELECT contact_phone FROM site_settings LIMIT 1), '+90 (552) 196 16 77'),
    theme_preset = 'emerald'
WHERE active_event = true;
