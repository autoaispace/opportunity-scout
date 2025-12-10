# GoldMine AI - 产品

**AI 驱动的海外商机情报站** - 为出海开发者每日挖掘高价值需求

## 项目概述


Opportunity Scout 是一个面向出海开发者的 SaaS 平台，通过 AI 自动挖掘并分析全球市场中的高价值需求，帮助独立开发者和创业者发现商业机会。

### 核心特性

- 🤖 **AI 自动挖掘** - 从 Reddit、Twitter 等平台自动提取需求
- 🔒 **Freemium 模式** - 免费用户查看 3 条，Pro 用户无限访问
- 📊 **深度分析** - 竞品分析、热度趋势、ROI 预估（Pro 专属）
- 🌍 **多语言支持** - 中文/英文切换
- 📱 **PWA 支持** - 完美适配移动端，可安装为应用
- ⚡ **实时更新** - Supabase Realtime 支持

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **Framework** | Next.js | 14.x (App Router) |
| **Language** | TypeScript | 5.3+ |
| **Styling** | Tailwind CSS | 4.x |
| **UI Components** | Shadcn UI | Latest |
| **Animation** | Framer Motion | 11+ |
| **Backend** | Supabase | Latest |
| **State** | Zustand | 4.5+ |
| **i18n** | next-intl | 3.x |

## 项目结构

```
opportunity-scout/
├── app/                      # Next.js App Router
│   ├── [locale]/            # 多语言路由
│   │   ├── feed/           # 主 Feed 页
│   │   ├── demands/[id]/   # 需求详情
│   │   ├── login/          # OAuth 登录
│   │   └── mock-checkout/  # 模拟支付
│   └── api/                # API Routes
├── components/              # React 组件
│   ├── auth/               # 认证组件
│   ├── demand/             # 需求相关
│   ├── feed/               # Feed 列表
│   ├── layout/             # 布局组件
│   └── subscription/       # 订阅/支付
├── lib/                     # 核心逻辑
│   ├── supabase/           # Supabase 客户端
│   ├── db/                 # 数据访问层
│   ├── payment/            # 支付抽象层
│   ├── analytics/          # 埋点系统
│   └── animations/         # 动画配置
└── supabase/               # 数据库迁移
    └── migrations/
```

## 快速开始

### 1. 环境变量配置

复制 `.env.example` 为 `.env.local`，填入以下信息：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Mock Payment (开发环境)
NEXT_PUBLIC_USE_MOCK_PAYMENT=true
```

**重要提示：获取 Supabase 密钥**

1. 访问 [Supabase Dashboard](https://app.supabase.com) → 选择你的项目
2. 进入 **Settings → API**
3. 复制以下值：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **必须是 JWT token（200+ 字符），不是自定义值**

⚠️ **警告**：`SUPABASE_SERVICE_ROLE_KEY` 必须是从 Supabase Dashboard 获取的真实 service_role key（JWT 格式），不能是自定义值。它用于绕过 RLS 进行管理员操作。

### 2. 安装依赖

```bash
npm install
```

### 3. 运行数据库迁移

```bash
# 初始化 Supabase CLI
npx supabase init

# 应用迁移
npx supabase db push

# 生成 TypeScript 类型
npx supabase gen types typescript --local > types/database.ts
```

### 4. 配置 OAuth

在 Supabase Dashboard 中配置：

1. **Authentication → Providers**
2. 启用 Google OAuth
3. 启用 Apple OAuth
4. 设置回调 URL: `http://localhost:3000/auth/callback`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 核心功能实现

### 权限控制（RLS）

使用 Supabase Row Level Security 在数据库层面控制访问：

- **Free 用户**: 仅可读取部分字段（title, summary, pain_score）
- **Pro 用户**: 可访问全部字段（competitors, trend_data, roi_estimate）

### 支付系统架构

采用 **适配器模式**，方便切换支付提供商：

```typescript
// 当前使用 Mock Provider
const provider = new MockPaymentProvider()

// 上线时替换为 Stripe
const provider = new StripeProvider(STRIPE_KEY)
```

### 埋点系统

开发环境输出 Emoji 日志，生产环境发送到分析服务：

```typescript
analytics.track('demand_card_click', {
  demand_id: 'xxx',
  subscription_status: 'free'
})
```

## 部署清单

- [ ] 配置生产环境变量
- [ ] 应用数据库迁移到生产
- [ ] 更新 OAuth 回调 URL
- [ ] 替换 MockPaymentProvider 为 StripeProvider
- [ ] 配置 Stripe Webhook
- [ ] 集成真实分析服务（PostHog/Mixpanel）
- [ ] 生成 PWA 图标（192x192, 512x512）
- [ ] 运行 Lighthouse 审计

## 开发规范

项目遵循 `.cursorrules` 中定义的编码标准：

- ✅ TypeScript 严格模式
- ✅ 仅使用函数式组件
- ✅ 默认 Server Components
- ✅ Mobile-First 设计
- ✅ 类型安全优先
- ✅ 所有数据库调用通过 `lib/db/api.ts`

## 架构亮点

1. **模块化设计** - 支付、数据库、分析系统高度解耦
2. **类型安全** - 端到端 TypeScript，自动生成数据库类型
3. **安全优先** - RLS 策略确保数据安全，无法前端绕过
4. **性能优化** - Server Components + 增量静态生成
5. **可扩展** - 清晰的接口定义，方便未来功能扩展

## 许可证

MIT License

## 联系方式

- 项目文档: `/PROJECT_BLUEPRINT.md`
- 设计规范: `/README(1).md`

---

**Built with ❤️ for Indie Hackers**
