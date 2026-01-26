-- Add missing columns to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON user_profiles;

-- Create RLS policies for user_profiles

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert their own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Service role can do anything (for admin operations)
CREATE POLICY "Service role can do anything" 
ON user_profiles FOR ALL 
USING (auth.role() = 'service_role');

-- Also allow authenticated users to insert (for OAuth signup)
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON user_profiles;
CREATE POLICY "Authenticated users can insert profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
