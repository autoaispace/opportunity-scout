-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_views ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: profiles
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- System can insert profile on signup
CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- POLICIES: demands (CRITICAL - Access Control)
-- ============================================

-- Free users: Can only see id, title, summary, pain_score, source_url, created_at
-- Pro users: Can see all fields
-- Implementation: We don't filter columns in RLS (not possible), 
-- instead we rely on the Data Access Layer to strip fields

-- All authenticated users can read demands (but frontend limits display)
CREATE POLICY "Authenticated users can read demands"
  ON demands FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only service role can insert/update demands (from AI pipeline)
CREATE POLICY "Service role can manage demands"
  ON demands FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- POLICIES: user_views
-- ============================================

-- Users can read their own views
CREATE POLICY "Users can read own views"
  ON user_views FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own views
CREATE POLICY "Users can insert own views"
  ON user_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

