-- Auto-set published_at when is_published is set to true
CREATE OR REPLACE FUNCTION auto_publish_news()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_published = true AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_publish_news_trigger ON news;
CREATE TRIGGER auto_publish_news_trigger
    BEFORE INSERT OR UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION auto_publish_news();
