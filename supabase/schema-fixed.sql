-- Supabase Database Schema for AI System Design Platform
-- Run this SQL in your Supabase SQL Editor to set up the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Enhanced Users Table with Profile Features
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255), -- For credential auth, nullable for OAuth users
  full_name VARCHAR(255),
  
  -- Profile Information
  display_name VARCHAR(255), -- Name shown publicly (defaults to full_name)
  bio TEXT, -- User description/about section
  profile_picture_url TEXT, -- Profile image URL
  cover_image_url TEXT, -- Cover/banner image URL
  location VARCHAR(255),
  company VARCHAR(255),
  job_title VARCHAR(255),
  experience_level VARCHAR(50) DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced, Expert
  
  -- OAuth Provider IDs
  github_id VARCHAR(100),
  google_id VARCHAR(100),
  linkedin_id VARCHAR(100),
  
  -- Social Links
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  website_url TEXT,
  portfolio_url TEXT,
  
  -- OAuth Profile Data
  oauth_provider VARCHAR(50), -- 'google', 'github', 'linkedin'
  oauth_avatar_url TEXT, -- Profile picture from OAuth provider
  oauth_name VARCHAR(255), -- Name from OAuth provider
  oauth_username VARCHAR(100), -- Username from OAuth provider
  
  -- User Stats (automatically calculated)
  problems_solved INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  -- User Preferences
  theme VARCHAR(20) DEFAULT 'system', -- light, dark, system
  email_notifications BOOLEAN DEFAULT true,
  public_profile BOOLEAN DEFAULT true,
  show_stats BOOLEAN DEFAULT true,
  
  -- Account Status
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  role VARCHAR(100) DEFAULT 'System Design Engineer',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- Problems Table (System Design Problems)
-- ============================================
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly version of title
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category VARCHAR(100), -- e.g., 'Distributed Systems', 'Database Design', 'Scalability'
  tags TEXT[], -- Array of tags like ['caching', 'load-balancing', 'microservices']
  
  -- Problem Details
  estimated_time INTEGER, -- Estimated time in minutes
  points INTEGER DEFAULT 100, -- Points awarded for solving
  acceptance_rate DECIMAL(5,2) DEFAULT 0.00, -- Percentage of successful submissions
  
  -- Problem Content
  problem_statement TEXT NOT NULL,
  constraints TEXT,
  examples JSONB, -- Example inputs/outputs or scenarios
  hints TEXT[],
  solution_approach TEXT, -- High-level solution approach
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Enhanced User Progress Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  
  -- Progress Status
  status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'solved', 'reviewed')),
  attempts INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0 CHECK (best_score >= 0 AND best_score <= 100),
  time_spent INTEGER DEFAULT 0, -- Time spent in minutes
  
  -- Timestamps
  first_attempt_at TIMESTAMP WITH TIME ZONE,
  solved_at TIMESTAMP WITH TIME ZONE,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, problem_id)
);

-- ============================================
-- Diagrams Table
-- ============================================
CREATE TABLE IF NOT EXISTS diagrams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) DEFAULT 'Untitled Diagram',
  problem_id UUID REFERENCES problems(id),
  diagram_data JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Enhanced Submissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  
  -- Submission Content
  solution_text TEXT, -- Written solution/explanation
  diagram_data JSONB, -- System design diagram
  code_snippets JSONB, -- Any code examples
  
  -- Evaluation
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  ai_feedback TEXT, -- AI-generated feedback
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'evaluating', 'completed', 'failed')),
  
  -- Performance Metrics
  time_taken INTEGER, -- Time taken in minutes
  components_used TEXT[], -- System components used in design
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  evaluated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- User Achievements Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL, -- 'first_solve', 'streak_7', 'perfect_score', etc.
  achievement_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  points_awarded INTEGER DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, achievement_type)
);

-- ============================================
-- User Activity Log Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'login', 'problem_solved', 'submission', 'profile_updated'
  activity_data JSONB, -- Additional data about the activity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Enhanced Indexes for Better Performance
-- ============================================
-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_problems_solved ON users(problems_solved DESC);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Problems table indexes
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_problems_tags ON problems USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_problems_slug ON problems(slug);
CREATE INDEX IF NOT EXISTS idx_problems_is_active ON problems(is_active);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_problem_id ON user_progress(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_solved_at ON user_progress(solved_at);

-- Diagrams indexes
CREATE INDEX IF NOT EXISTS idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_problem_id ON diagrams(problem_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_created_at ON diagrams(created_at);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_score ON submissions(score DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON user_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON user_achievements(earned_at);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON user_activity(created_at);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Allow public profile viewing" ON users
  FOR SELECT USING (public_profile = true OR auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "Allow anonymous user registration" ON users
  FOR INSERT WITH CHECK (true);

-- Problems table policies (public read access)
CREATE POLICY "Anyone can view active problems" ON problems
  FOR SELECT USING (is_active = true OR auth.role() = 'service_role');

CREATE POLICY "Only admins can manage problems" ON problems
  FOR ALL USING (auth.role() = 'service_role');

-- User progress policies
CREATE POLICY "Users can manage their own progress" ON user_progress
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

-- Diagrams policies
CREATE POLICY "Users can manage their own diagrams" ON diagrams
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

-- Submissions policies
CREATE POLICY "Users can manage their own submissions" ON submissions
  FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR SELECT USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "System can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Activity policies
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');

CREATE POLICY "System can log activity" ON user_activity
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid()::text = user_id::text);

-- ============================================
-- Triggers and Functions
-- ============================================

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update user stats when problems are solved
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update problems solved count and points
  IF NEW.status = 'solved' AND (OLD.status IS NULL OR OLD.status != 'solved') THEN
    UPDATE users 
    SET 
      problems_solved = problems_solved + 1,
      points = points + COALESCE((SELECT points FROM problems WHERE id = NEW.problem_id), 100),
      last_activity_date = CURRENT_DATE
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_problems_updated_at ON problems;
CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diagrams_updated_at ON diagrams;
CREATE TRIGGER update_diagrams_updated_at
  BEFORE UPDATE ON diagrams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update user stats when progress changes
DROP TRIGGER IF EXISTS trigger_update_user_stats ON user_progress;
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Insert sample problems
INSERT INTO problems (title, slug, description, difficulty, category, tags, problem_statement, points) VALUES
('Design a URL Shortener', 'url-shortener', 'Design a URL shortening service like bit.ly or tinyurl.com', 'Medium', 'System Design', ARRAY['caching', 'database', 'scalability'], 'Design a system that can shorten long URLs and redirect users to the original URL when they visit the shortened version.', 150),
('Design WhatsApp', 'whatsapp-design', 'Design a messaging application like WhatsApp', 'Hard', 'Distributed Systems', ARRAY['messaging', 'real-time', 'scalability'], 'Design a real-time messaging system that can handle billions of users and messages.', 200),
('Design a Cache System', 'cache-system', 'Design a distributed caching system', 'Easy', 'Caching', ARRAY['caching', 'performance'], 'Design a caching system that can store and retrieve data efficiently.', 100)
ON CONFLICT (slug) DO NOTHING;