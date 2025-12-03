-- =============================================
-- Opportunity Scout - 完整数据库设置脚本
-- 在 Supabase Dashboard → SQL Editor 中运行此脚本
-- =============================================

-- Step 1: Enable UUID extension
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create Tables
-- =============================================

-- Table: profiles (用户配置表)
CREATE TABLE IF NOT EXISTS profiles (
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

-- Table: demands (需求数据表)
CREATE TABLE IF NOT EXISTS demands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Core content
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT,
  
  -- Metadata
  pain_score INTEGER NOT NULL CHECK (pain_score >= 0 AND pain_score <= 100),
  market_size TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  -- Pro-only fields
  competitors JSONB,
  trend_data JSONB,
  roi_estimate JSONB,
  
  -- Source
  source_url TEXT NOT NULL,
  source_platform TEXT,
  
  -- AI metadata
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  tags TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: user_views (用户浏览记录)
CREATE TABLE IF NOT EXISTS user_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  demand_id UUID NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, demand_id)
);

-- Step 3: Create Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_demands_created_at ON demands(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demands_pain_score ON demands(pain_score DESC);
CREATE INDEX IF NOT EXISTS idx_demands_tags ON demands USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_views_user_id ON user_views(user_id);

-- Step 4: Create Triggers
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_demands_updated_at ON demands;
CREATE TRIGGER update_demands_updated_at 
  BEFORE UPDATE ON demands
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Enable Row Level Security
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_views ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies - profiles
-- =============================================
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 7: Create RLS Policies - demands
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can read demands" ON demands;
CREATE POLICY "Authenticated users can read demands"
  ON demands FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service role can manage demands" ON demands;
CREATE POLICY "Service role can manage demands"
  ON demands FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Step 8: Create RLS Policies - user_views
-- =============================================
DROP POLICY IF EXISTS "Users can read own views" ON user_views;
CREATE POLICY "Users can read own views"
  ON user_views FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own views" ON user_views;
CREATE POLICY "Users can insert own views"
  ON user_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 9: Insert Test Data
-- =============================================
INSERT INTO demands (title, summary, pain_score, source_url, tags, description, competitors, trend_data, roi_estimate, market_size, difficulty, ai_confidence, source_platform)
VALUES 
(
  '寻找 AI 驱动的邮件管理工具',
  '目前市面上的邮件工具太复杂，需要一个简单的 AI 自动分类和回复建议工具。',
  85,
  'https://reddit.com/r/saas/example1',
  ARRAY['AI', 'Email', 'Productivity'],
  '详细需求：用户希望有一个轻量级的邮件客户端，能够自动识别重要邮件、生成回复建议，并支持一键回复。特别强调界面简洁，不需要复杂的配置。目标用户是每天处理大量邮件的专业人士，希望节省时间并提高响应效率。',
  '[
    {"name": "Superhuman", "url": "https://superhuman.com", "description": "高端邮件客户端，功能强大但价格昂贵（$30/月），主要面向企业用户"},
    {"name": "Spark", "url": "https://sparkmailapp.com", "description": "功能全面但界面略显复杂，学习曲线较陡"},
    {"name": "Hey", "url": "https://hey.com", "description": "创新的邮件理念，但需要更换邮箱地址"}
  ]'::jsonb,
  '[
    {"date": "2024-12-01", "value": 45},
    {"date": "2024-12-15", "value": 62},
    {"date": "2025-01-01", "value": 78},
    {"date": "2025-01-15", "value": 85}
  ]'::jsonb,
  '{"min": 5000, "max": 50000, "confidence": 0.75}'::jsonb,
  '10M+ professionals worldwide',
  'medium',
  0.82,
  'reddit'
),
(
  '独立开发者需要简单的用户反馈工具',
  '现有工具如 Intercom 太贵太复杂，希望有一个专为独立开发者设计的轻量级反馈收集工具。',
  78,
  'https://twitter.com/indie_hacker/status/example2',
  ARRAY['Feedback', 'SaaS', 'Indie', 'UserExperience'],
  '核心需求：简单的小部件嵌入、自动分类反馈、与 Notion/Slack 集成。价格要亲民，最好有免费版本支持小团队。用户希望能够快速收集用户反馈，自动打标签分类，并能够在团队协作工具中接收通知。',
  '[
    {"name": "Canny", "url": "https://canny.io", "description": "功能强大的反馈管理平台，但价格对小团队不友好（$50/月起）"},
    {"name": "UserVoice", "url": "https://uservoice.com", "description": "适合大型企业，功能过于复杂"},
    {"name": "Feedbear", "url": "https://feedbear.com", "description": "价格合理但功能相对基础"}
  ]'::jsonb,
  '[
    {"date": "2024-12-01", "value": 35},
    {"date": "2024-12-15", "value": 48},
    {"date": "2025-01-01", "value": 65},
    {"date": "2025-01-15", "value": 78}
  ]'::jsonb,
  '{"min": 2000, "max": 20000, "confidence": 0.68}'::jsonb,
  '100K+ indie developers',
  'easy',
  0.75,
  'twitter'
),
(
  'SaaS 产品需要更好的用户引导工具',
  'Intercom 和 Pendo 太贵，独立开发者需要一个简单的产品导览和用户引导解决方案。',
  72,
  'https://reddit.com/r/startups/example3',
  ARRAY['Onboarding', 'SaaS', 'UX', 'Product'],
  '用户痛点：新用户不知道如何使用产品功能，导致激活率低。需要一个工具能够创建交互式产品导览、功能提示和使用教程，帮助用户快速上手。希望支持条件触发、用户分群，并能追踪引导效果。',
  '[
    {"name": "Intercom Product Tours", "url": "https://intercom.com", "description": "功能完善但价格昂贵（$79/月起），适合大公司"},
    {"name": "Pendo", "url": "https://pendo.io", "description": "企业级解决方案，价格不透明"},
    {"name": "Appcues", "url": "https://appcues.com", "description": "中等价位但仍然较贵（$249/月）"}
  ]'::jsonb,
  '[
    {"date": "2024-12-01", "value": 42},
    {"date": "2024-12-15", "value": 55},
    {"date": "2025-01-01", "value": 66},
    {"date": "2025-01-15", "value": 72}
  ]'::jsonb,
  '{"min": 3000, "max": 30000, "confidence": 0.70}'::jsonb,
  '50K+ SaaS products',
  'medium',
  0.77,
  'reddit'
),
(
  '远程团队需要轻量级的每日站会工具',
  'Slack 太吵，Zoom 太重，需要一个专门用于异步每日站会的简单工具。',
  68,
  'https://twitter.com/remote_work/status/example4',
  ARRAY['Remote', 'Team', 'Async', 'Standup'],
  '需求背景：远程团队分布在不同时区，同步会议困难。希望有一个工具能让团队成员异步提交每日更新（昨天完成、今天计划、遇到的问题），并能够自动汇总和提醒。界面要简单，集成 Slack 通知。',
  '[
    {"name": "Geekbot", "url": "https://geekbot.com", "description": "基于 Slack 的站会机器人，但功能有限"},
    {"name": "Standuply", "url": "https://standuply.com", "description": "功能较全但界面复杂"},
    {"name": "Daily.bot", "url": "https://daily.bot", "description": "新兴产品，用户基数小"}
  ]'::jsonb,
  '[
    {"date": "2024-12-01", "value": 38},
    {"date": "2024-12-15", "value": 52},
    {"date": "2025-01-01", "value": 61},
    {"date": "2025-01-15", "value": 68}
  ]'::jsonb,
  '{"min": 1500, "max": 15000, "confidence": 0.65}'::jsonb,
  '200K+ remote teams',
  'easy',
  0.71,
  'twitter'
),
(
  'No-Code 创业者需要简单的 API 集成工具',
  'Zapier 太贵，Make 太复杂，需要一个专门为 No-Code 用户设计的 API 连接工具。',
  80,
  'https://reddit.com/r/nocode/example5',
  ARRAY['NoCode', 'API', 'Integration', 'Automation'],
  '目标用户：使用 Bubble、Webflow 等 No-Code 工具的创业者，需要连接各种 API 但不懂编程。希望有可视化的 API 请求构建器、认证管理、错误处理，并能直接嵌入到 No-Code 项目中。价格要比 Zapier 便宜很多。',
  '[
    {"name": "Zapier", "url": "https://zapier.com", "description": "市场领导者但价格高昂（$20-$50/月），对 API 支持有限"},
    {"name": "Make", "url": "https://make.com", "description": "功能强大但学习曲线陡峭"},
    {"name": "Pipedream", "url": "https://pipedream.com", "description": "偏向开发者，对 No-Code 用户不友好"}
  ]'::jsonb,
  '[
    {"date": "2024-12-01", "value": 50},
    {"date": "2024-12-15", "value": 65},
    {"date": "2025-01-01", "value": 75},
    {"date": "2025-01-15", "value": 80}
  ]'::jsonb,
  '{"min": 4000, "max": 40000, "confidence": 0.73}'::jsonb,
  '500K+ no-code builders',
  'medium',
  0.79,
  'reddit'
)
ON CONFLICT DO NOTHING;

-- =============================================
-- 完成！数据库设置成功
-- =============================================

-- 验证安装
SELECT 'profiles' as table_name, count(*) as row_count FROM profiles
UNION ALL
SELECT 'demands', count(*) FROM demands
UNION ALL
SELECT 'user_views', count(*) FROM user_views;

