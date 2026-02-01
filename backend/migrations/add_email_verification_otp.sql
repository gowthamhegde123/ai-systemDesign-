-- Add email verification and OTP columns to users table

-- Add email verification columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- Add password reset OTP columns
ALTER TABLE users
ADD COLUMN IF NOT EXISTS reset_otp VARCHAR(6),
ADD COLUMN IF NOT EXISTS reset_otp_expires TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_otp ON users(reset_otp);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Add comments
COMMENT ON COLUMN users.email_verified IS 'Whether the user has verified their email';
COMMENT ON COLUMN users.verification_token IS 'Token for email verification';
COMMENT ON COLUMN users.verification_token_expires IS 'Expiration time for verification token';
COMMENT ON COLUMN users.reset_otp IS '6-digit OTP for password reset';
COMMENT ON COLUMN users.reset_otp_expires IS 'Expiration time for reset OTP';
