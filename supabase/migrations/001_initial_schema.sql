-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles (User data extension)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  
  -- Subscription fields
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'lifetime')),
  subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly', 'lifetime')),
  subscription_expires_at TIMESTAMPTZ,
  
  -- OAuth provider info
  provider TEXT NOT NULL CHECK (provider IN ('google', 'apple')),
  
  -- Preferences
  locale TEXT DEFAULT 'zh-CN',
  notification_enabled BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: demands (Opportunity data)
-- ============================================
CREATE TABLE demands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Core content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT, -- Full content (Pro only)
  
  -- Metadata
  pain_score INTEGER NOT NULL CHECK (pain_score >= 0 AND pain_score <= 100),
  market_size TEXT, -- e.g., "10M+ users"
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  -- Pro-only fields
  competitors JSONB, -- Array of {name, url, description}
  trend_data JSONB, -- Time series data for charts
  roi_estimate JSONB, -- {min, max, confidence}
  
  -- Source
  source_url TEXT NOT NULL,
  source_platform TEXT, -- e.g., "reddit", "twitter"
  
  -- AI metadata
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  tags TEXT[], -- Array of tags
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX idx_demands_created_at ON demands(created_at DESC);
CREATE INDEX idx_demands_pain_score ON demands(pain_score DESC);
CREATE INDEX idx_demands_tags ON demands USING GIN(tags);

-- ============================================
-- TABLE: user_views (Track what users viewed)
-- ============================================
CREATE TABLE user_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  demand_id UUID NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, demand_id) -- Prevent duplicate views
);

CREATE INDEX idx_user_views_user_id ON user_views(user_id);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_demands_updated_at BEFORE UPDATE ON demands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

