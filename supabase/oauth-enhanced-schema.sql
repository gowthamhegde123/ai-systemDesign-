-- Enhanced OAuth Schema for Social Account Integration
-- Run this SQL in your Supabase SQL Editor after the main schema

-- ============================================
-- OAuth Accounts Table (for multiple OAuth providers per user)
-- ============================================
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- OAuth Provider Info
  provider VARCHAR(50) NOT NULL, -- 'google', 'github', 'linkedin', 'twitter'
  provider_account_id VARCHAR(255) NOT NULL, -- ID from the OAuth provider
  
  -- OAuth Data
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  scope TEXT,
  
  -- Profile Data from Provider
  provider_name VARCHAR(255), -- Name from provider
  provider_username VARCHAR(100), -- Username from provider
  provider_email VARCHAR(255), -- Email from provider
  provider_avatar_url TEXT, -- Profile picture from provider
  provider_profile_url TEXT, -- Link to provider profile
  
  -- Account Status
  is_primary BOOLEAN DEFAULT false, -- Primary OAuth account used for login
  is_linked BOOLEAN DEFAULT true, -- Whether account is currently linked
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(provider, provider_account_id),
  UNIQUE(user_id, provider) -- One account per provider per user
);

-- ============================================
-- Social Media Accounts Table (for profile display)
-- ============================================
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Social Platform
  platform VARCHAR(50) NOT NULL, -- 'github', 'linkedin', 'twitter', 'instagram', 'website', 'portfolio'
  
  -- Account Details
  username VARCHAR(255), -- Username on the platform
  display_name VARCHAR(255), -- Display name for the account
  profile_url TEXT NOT NULL, -- Full URL to the profile
  
  -- Verification
  is_verified BOOLEAN DEFAULT false, -- Whether we've verified ownership
  verification_method VARCHAR(50), -- 'oauth', 'manual', 'email'
  
  -- Display Settings
  is_public BOOLEAN DEFAULT true, -- Show on public profile
  display_order INTEGER DEFAULT 0, -- Order to display on profile
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, platform)
);

-- ============================================
-- User Profile Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_profile_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Profile Visibility
  profile_visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'friends'
  show_email BOOLEAN DEFAULT false,
  show_location BOOLEAN DEFAULT true,
  show_social_links BOOLEAN DEFAULT true,
  show_achievements BOOLEAN DEFAULT true,
  show_activity BOOLEAN DEFAULT true,
  show_stats BOOLEAN DEFAULT true,
  
  -- Contact Preferences
  allow_contact BOOLEAN DEFAULT true,
  allow_collaboration BOOLEAN DEFAULT true,
  
  -- Profile Customization
  profile_theme VARCHAR(50) DEFAULT 'default',
  custom_css TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id)
);

-- ============================================
-- Indexes for OAuth and Social Tables
-- ============================================
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider ON oauth_accounts(provider);
CREATE INDEX IF NOT EXISTS idx_oauth_accounts_provider_id ON oauth_accounts(provider_account_id);

CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_public ON social_accounts(is_public);

CREATE INDEX IF NOT EXISTS idx_profile_settings_user_id ON user_profile_settings(user_id);

-- ============================================
-- RLS Policies for New Tables
-- ============================================

-- OAuth Accounts (private to user)
ALTER TABLE oauth_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own OAuth accounts" ON oauth_accounts
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

-- Social Accounts (public read, user write)
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public social accounts" ON social_accounts
  FOR SELECT USING (is_public = true OR auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can manage their own social accounts" ON social_accounts
  FOR INSERT, UPDATE, DELETE USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

-- Profile Settings (private to user)
ALTER TABLE user_profile_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile settings" ON user_profile_settings
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

-- ============================================
-- Functions for OAuth Integration
-- ============================================

-- Function to create user from OAuth data
CREATE OR REPLACE FUNCTION create_user_from_oauth(
  p_email VARCHAR(255),
  p_provider VARCHAR(50),
  p_provider_id VARCHAR(255),
  p_name VARCHAR(255),
  p_username VARCHAR(100),
  p_avatar_url TEXT
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_final_username VARCHAR(100);
BEGIN
  -- Generate unique username if needed
  v_final_username := p_username;
  IF v_final_username IS NULL OR v_final_username = '' THEN
    v_final_username := LOWER(REPLACE(p_name, ' ', '_'));
  END IF;
  
  -- Ensure username is unique
  WHILE EXISTS (SELECT 1 FROM users WHERE username = v_final_username) LOOP
    v_final_username := v_final_username || '_' || floor(random() * 1000)::text;
  END LOOP;
  
  -- Create user
  INSERT INTO users (
    email, 
    username, 
    full_name, 
    display_name,
    profile_picture_url,
    oauth_provider,
    oauth_avatar_url,
    oauth_name,
    oauth_username,
    is_verified
  ) VALUES (
    p_email,
    v_final_username,
    p_name,
    p_name,
    p_avatar_url,
    p_provider,
    p_avatar_url,
    p_name,
    p_username,
    true -- OAuth users are pre-verified
  ) RETURNING id INTO v_user_id;
  
  -- Create OAuth account record
  INSERT INTO oauth_accounts (
    user_id,
    provider,
    provider_account_id,
    provider_name,
    provider_username,
    provider_email,
    provider_avatar_url,
    is_primary
  ) VALUES (
    v_user_id,
    p_provider,
    p_provider_id,
    p_name,
    p_username,
    p_email,
    p_avatar_url,
    true
  );
  
  -- Create default profile settings
  INSERT INTO user_profile_settings (user_id) VALUES (v_user_id);
  
  -- Auto-link social account if it's GitHub or LinkedIn
  IF p_provider IN ('github', 'linkedin') THEN
    INSERT INTO social_accounts (
      user_id,
      platform,
      username,
      display_name,
      profile_url,
      is_verified,
      verification_method
    ) VALUES (
      v_user_id,
      p_provider,
      p_username,
      p_name,
      CASE 
        WHEN p_provider = 'github' THEN 'https://github.com/' || p_username
        WHEN p_provider = 'linkedin' THEN 'https://linkedin.com/in/' || p_username
      END,
      true,
      'oauth'
    );
  END IF;
  
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to link social account
CREATE OR REPLACE FUNCTION link_social_account(
  p_user_id UUID,
  p_platform VARCHAR(50),
  p_username VARCHAR(255),
  p_profile_url TEXT,
  p_display_name VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_account_id UUID;
BEGIN
  INSERT INTO social_accounts (
    user_id,
    platform,
    username,
    display_name,
    profile_url,
    is_verified,
    verification_method
  ) VALUES (
    p_user_id,
    p_platform,
    p_username,
    COALESCE(p_display_name, p_username),
    p_profile_url,
    false, -- Manual links need verification
    'manual'
  ) 
  ON CONFLICT (user_id, platform) 
  DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    profile_url = EXCLUDED.profile_url,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id INTO v_account_id;
  
  RETURN v_account_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Triggers for New Tables
-- ============================================

-- Updated at triggers
CREATE TRIGGER update_oauth_accounts_updated_at
  BEFORE UPDATE ON oauth_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_settings_updated_at
  BEFORE UPDATE ON user_profile_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();