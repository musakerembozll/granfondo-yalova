-- Migration: Add News Comments
-- Description: Add table for news/blog comments with moderation support
-- Date: 2025-01-26

-- Step 1: Create news_comments table
CREATE TABLE IF NOT EXISTS news_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_news_comments_news_id ON news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_approved ON news_comments(is_approved);

-- Step 3: Add trigger for updated_at
CREATE TRIGGER update_news_comments_updated_at
    BEFORE UPDATE ON news_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Add comments for documentation
COMMENT ON COLUMN news_comments.news_id IS 'Reference to the news/blog post';
COMMENT ON COLUMN news_comments.is_approved IS 'Whether the comment has been approved by a moderator';
