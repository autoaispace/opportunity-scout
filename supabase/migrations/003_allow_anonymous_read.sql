-- 允许匿名用户读取 demands（演示模式）
-- 注意：生产环境中应该改回 authenticated

DROP POLICY IF EXISTS "Authenticated users can read demands" ON demands;

-- 临时策略：允许所有人读取（包括匿名用户）
CREATE POLICY "Anyone can read demands (demo mode)"
  ON demands FOR SELECT
  USING (true);

