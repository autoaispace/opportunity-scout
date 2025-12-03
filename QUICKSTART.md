# 🚀 Opportunity Scout - 快速启动指南

> 从零到运行只需 5 分钟！

## ✅ 已完成的功能

### 核心功能（100%）
- ✅ Next.js 14 项目结构 + Tailwind 设计系统
- ✅ Supabase 数据库架构 + RLS 安全策略
- ✅ OAuth 认证（Google/Apple）
- ✅ Mock 支付系统（可无缝切换 Stripe）
- ✅ Feed 页面 + 需求列表
- ✅ 需求详情页 + Pro 内容锁定
- ✅ 埋点系统 + PWA 配置

### 功能清单
| 功能 | 状态 | 说明 |
|------|------|------|
| 用户认证 | ✅ | Google/Apple OAuth |
| 数据库 | ✅ | Supabase + RLS 策略 |
| Feed 列表 | ✅ | 无限滚动 + 权限控制 |
| 详情页 | ✅ | 竞品分析 + 趋势图表 + ROI |
| 订阅系统 | ✅ | 3 档套餐 + Mock 支付 |
| 埋点 | ✅ | 开发环境 Emoji 日志 |
| PWA | ✅ | manifest.json 已配置 |
| 多语言 | ✅ | 中文/英文切换 |
| 响应式 | ✅ | Mobile-First 设计 |

## 📋 启动前准备

### 1. 创建 Supabase 项目

访问 [supabase.com](https://supabase.com)

1. 创建新项目
2. 记录以下信息：
   - Project URL: `https://xxx.supabase.co`
   - Anon Key: `eyJhbG...`
   - Service Role Key: `eyJhbG...`

### 2. 配置环境变量

在项目根目录创建 `.env.local`：

```bash
# 复制以下内容并替换为你的实际值
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCK_PAYMENT=true
```

### 3. 应用数据库迁移

```bash
# 方法 1: 使用 Supabase CLI（推荐）
npx supabase db push

# 方法 2: 手动在 Supabase Dashboard SQL 编辑器中执行
# 依次运行 supabase/migrations/ 下的 SQL 文件
```

### 4. 配置 OAuth

在 Supabase Dashboard:

**Google OAuth:**
1. Authentication → Providers → Google
2. 启用并填入 Client ID/Secret
3. 回调 URL: `http://localhost:3000/auth/callback`

**Apple OAuth:**
1. Authentication → Providers → Apple
2. 启用并填入 Service ID/Key
3. 回调 URL: `http://localhost:3000/auth/callback`

> 💡 暂时跳过？使用 Mock 数据测试（见下方）

## 🏃 启动项目

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问应用
open http://localhost:3000
```

## 🧪 测试数据

### 插入测试需求数据

在 Supabase SQL 编辑器运行：

```sql
INSERT INTO demands (title, summary, pain_score, source_url, tags, description, competitors, trend_data, roi_estimate, market_size, difficulty, ai_confidence, source_platform)
VALUES 
(
  '寻找 AI 驱动的邮件管理工具',
  '目前市面上的邮件工具太复杂，需要一个简单的 AI 自动分类和回复建议工具。',
  85,
  'https://reddit.com/r/saas/xxx',
  ARRAY['AI', 'Email', 'Productivity'],
  '详细需求：用户希望有一个轻量级的邮件客户端，能够自动识别重要邮件、生成回复建议，并支持一键回复。特别强调界面简洁，不需要复杂的配置。',
  '[
    {"name": "Superhuman", "url": "https://superhuman.com", "description": "高端邮件客户端，价格昂贵（$30/月）"},
    {"name": "Spark", "url": "https://sparkmailapp.com", "description": "功能全面但略显复杂"}
  ]'::jsonb,
  '[
    {"date": "2025-01-01", "value": 45},
    {"date": "2025-01-15", "value": 62},
    {"date": "2025-02-01", "value": 85}
  ]'::jsonb,
  '{"min": 5000, "max": 50000, "confidence": 0.75}'::jsonb,
  '10M+ professionals',
  'medium',
  0.82,
  'reddit'
),
(
  '独立开发者需要简单的用户反馈工具',
  '现有工具如 Intercom 太贵太复杂，希望有一个专为独立开发者设计的轻量级反馈收集工具。',
  78,
  'https://twitter.com/indie_hacker/status/xxx',
  ARRAY['Feedback', 'SaaS', 'Indie'],
  '核心需求：简单的小部件嵌入、自动分类反馈、集成 Notion/Slack。价格要亲民，最好有免费版。',
  '[
    {"name": "Canny", "url": "https://canny.io", "description": "功能强大但价格较高"},
    {"name": "UserVoice", "url": "https://uservoice.com", "description": "适合大公司，对小团队不友好"}
  ]'::jsonb,
  '[
    {"date": "2025-01-01", "value": 35},
    {"date": "2025-01-15", "value": 58},
    {"date": "2025-02-01", "value": 78}
  ]'::jsonb,
  '{"min": 2000, "max": 20000, "confidence": 0.68}'::jsonb,
  '100K+ indie developers',
  'easy',
  0.75,
  'twitter'
);
```

### 创建测试用户

登录后，手动更新订阅状态为 Pro：

```sql
-- 获取你的 user_id（登录后在 profiles 表查看）
UPDATE profiles 
SET 
  subscription_status = 'pro',
  subscription_plan = 'monthly'
WHERE email = 'your-email@example.com';
```

## 🎨 功能演示

### 1. 免费用户体验
- 访问 `/feed` 查看需求列表
- 只能看到前 3 条
- 点击详情页，Pro 内容显示模糊锁定

### 2. 升级流程
- 点击 "立即升级" 按钮
- 选择套餐（yearly 有 "最超值" 标签）
- 点击 "完成支付（演示）"
- 自动升级为 Pro 用户

### 3. Pro 用户体验
- 查看完整需求列表
- 详情页显示：
  - 完整描述
  - 竞品分析
  - 热度趋势图
  - ROI 预估
  - 市场规模

## 🐛 常见问题

### Q: OAuth 登录失败？

**A:** 检查以下几点：
1. `.env.local` 中的 URL 和 Key 是否正确
2. Supabase Dashboard 中 OAuth 是否已启用
3. 回调 URL 是否配置正确
4. 暂时可以跳过认证测试其他功能

### Q: 数据库查询失败？

**A:** 确保：
1. RLS 策略已应用（运行 `002_rls_policies.sql`）
2. 用户已登录（有 session）
3. 在 Supabase Dashboard → Authentication 中查看用户列表

### Q: 如何查看埋点日志？

**A:** 打开浏览器控制台，所有埋点事件会以 Emoji 前缀显示：
```
🔐 [Analytics] auth_login_success { provider: 'google' }
👆 [Analytics] demand_card_click { demand_id: 'xxx' }
💳 [Analytics] checkout_started { plan: 'yearly' }
```

### Q: Mock 支付如何切换到真实 Stripe？

**A:** 
1. 安装 Stripe: `npm install stripe @stripe/stripe-js`
2. 创建 `lib/payment/stripe-provider.ts` 实现 `PaymentProvider` 接口
3. 更新 `lib/payment/index.ts` 切换 provider
4. 配置 Stripe Webhook endpoint

## 📱 移动端测试

在手机上访问本地开发环境：

```bash
# 1. 查看本机 IP
ifconfig | grep "inet "

# 2. 更新 .env.local
NEXT_PUBLIC_SITE_URL=http://192.168.x.x:3000

# 3. 重启服务器
npm run dev

# 4. 手机访问
http://192.168.x.x:3000
```

## 🚀 部署到生产

### Vercel 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 部署
vercel

# 3. 配置环境变量（在 Vercel Dashboard）
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_SITE_URL
# - NEXT_PUBLIC_USE_MOCK_PAYMENT=false

# 4. 更新 OAuth 回调 URL
# Supabase Dashboard → Authentication → URL Configuration
# 添加：https://your-domain.vercel.app/auth/callback
```

## 📚 下一步

- [ ] 集成真实支付（Stripe/LemonSqueezy）
- [ ] 添加用户收藏功能
- [ ] 实现推送通知（Pro 用户）
- [ ] 添加搜索和筛选
- [ ] 接入真实 AI 数据源

## 💬 需要帮助？

参考以下文档：
- 📖 完整技术规格：`PROJECT_BLUEPRINT.md`
- 🎨 设计规范：`README(1).md`
- 📝 项目说明：`README.md`

---

**祝开发顺利！🎉**

