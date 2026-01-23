-- Migration: Secure Password Storage
-- Description: Add password_hash column and security features to admin_users table
-- Date: 2026-01-23

-- Step 1: Create backup table (for rollback purposes)
CREATE TABLE IF NOT EXISTS admin_users_backup AS
SELECT * FROM admin_users;

-- Step 2: Add new password_hash column
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Step 3: Add is_active column if not exists
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Step 4: Add last_login_at column if not exists
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Step 5: Add email column if not exists (for notifications)
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Step 6: Add created_at and updated_at if not exists
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_last_login ON admin_users(last_login_at);

-- Step 8: Add constraint to ensure role is valid
ALTER TABLE admin_users
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE admin_users
ADD CONSTRAINT admin_users_role_check
CHECK (role IN ('admin', 'moderator'));

-- Step 9: Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Step 10: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 12: Comments for documentation
COMMENT ON COLUMN admin_users.password_hash IS 'Bcrypt hashed password (10 rounds)';
COMMENT ON COLUMN admin_users.is_active IS 'Whether the admin account is active';
COMMENT ON COLUMN admin_users.last_login_at IS 'Timestamp of last successful login';
COMMENT ON TABLE audit_logs IS 'Security audit log for admin actions';

-- Note: The actual password migration (hashing existing passwords)
-- must be done via the Node.js migration script (scripts/migrate-passwords.ts)
-- After running that script, manually execute:
--
-- ALTER TABLE admin_users DROP COLUMN IF EXISTS password;
-- ALTER TABLE admin_users ALTER COLUMN password_hash SET NOT NULL;
--
-- This ensures zero-downtime migration and data safety.
