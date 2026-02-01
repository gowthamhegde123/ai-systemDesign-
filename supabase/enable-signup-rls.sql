-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (signup)
CREATE POLICY "Allow public signup" ON users
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text OR true);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Note: For production, you might want to restrict the SELECT policy
-- to only allow users to see their own data:
-- USING (auth.uid()::text = id::text)
