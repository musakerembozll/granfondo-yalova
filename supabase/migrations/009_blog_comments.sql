-- Blog Comments System
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_comments_news_id ON blog_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(is_approved);

-- Update trigger
CREATE OR REPLACE FUNCTION update_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_comments_updated_at ON blog_comments;
CREATE TRIGGER blog_comments_updated_at
    BEFORE UPDATE ON blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_updated_at();

-- RLS Policies
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "Allow reading approved comments"
    ON blog_comments FOR SELECT
    USING (is_approved = true);

-- Authenticated users can read their own comments (even if not approved)
CREATE POLICY "Allow reading own comments"
    ON blog_comments FOR SELECT
    USING (auth.uid() = user_id);

-- Authenticated users can insert comments
CREATE POLICY "Allow authenticated users to create comments"
    ON blog_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Service role can read all comments (for moderation)
CREATE POLICY "Service role can read all comments"
    ON blog_comments FOR SELECT
    USING (true);
