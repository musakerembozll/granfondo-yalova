-- Run this in Supabase SQL Editor after running 012_events_complete.sql

-- Create test swimming event with blue theme
INSERT INTO events (
    name,
    description,
    date,
    is_registration_open,
    is_active,
    bank_name,
    account_holder,
    iban,
    contact_email,
    contact_phone,
    hero_video_url,
    theme_preset
) VALUES (
    'Yalova Açık Su Yüzme Yarışı 2026',
    'Yalova''nın masmavi sularında unutulmaz bir yüzme deneyimi için hazır olun!',
    '2026-07-15',
    false,
    false,
    'Ziraat Bankası',
    'Sporla Yalova Spor Kulübü',
    'TR00 0000 0000 0000 0000 0000 00',
    'yuzme@sporlayalova.com',
    '+90 (552) 196 16 77',
    '',
    'blue'
);

-- To set this as active event and see the blue theme:
-- UPDATE events SET is_active = false WHERE is_active = true;
-- UPDATE events SET is_active = true WHERE name LIKE '%Yüzme%';
