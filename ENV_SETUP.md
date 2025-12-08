# 环境变量配置指南

## 必需的环境变量

### Supabase 配置

从 [Supabase Dashboard](https://app.supabase.com) → 你的项目 → **Settings → API** 获取：

```bash
# 项目 URL（例如：https://kivacrfjssfloqkfnnqs.supabase.co）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# anon public key（公开密钥，可在前端使用）
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ⚠️ 重要：service_role key（管理员密钥，仅服务端使用）
# 必须从 Supabase Dashboard 获取，是 JWT token 格式（200+ 字符）
# 不能是自定义值！
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 应用配置

```bash
# 本地开发
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 生产环境（部署到 Vercel 等）
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# 可选：使用模拟支付（开发环境）
NEXT_PUBLIC_USE_MOCK_PAYMENT=true
```

## ⚠️ 常见错误

### 错误：`SUPABASE_SERVICE_ROLE_KEY` 设置为自定义值

**错误示例：**
```bash
SUPABASE_SERVICE_ROLE_KEY=goldmineai  # ❌ 错误！
```

**正确做法：**
1. 访问 Supabase Dashboard → Settings → API
2. 找到 **service_role** key（在页面底部，有警告标识）
3. 复制完整的 JWT token（通常 200+ 字符，包含多个 `.` 分隔符）
4. 粘贴到环境变量中

**正确的格式示例：**
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpdj...  # ✅ 正确
```

## 验证环境变量

### 方法 1：使用健康检查 API

访问 `/api/health` 端点查看环境变量配置状态：

```bash
# 开发环境（显示详细信息）
curl http://localhost:3000/api/health

# 生产环境（仅显示状态）
curl https://yourdomain.com/api/health
```

### 方法 2：检查代码

代码会在启动时自动验证环境变量。如果缺少必需变量，会抛出明确的错误信息。

## Vercel 部署配置

在 Vercel 项目设置中添加环境变量：

1. 进入 Vercel Dashboard → 你的项目 → **Settings → Environment Variables**
2. 添加所有必需的环境变量
3. 确保为 **Production**、**Preview**、**Development** 环境都配置
4. 重新部署应用

## 安全提示

- ✅ `NEXT_PUBLIC_*` 变量会暴露到浏览器，只能用于公开信息
- ✅ `SUPABASE_SERVICE_ROLE_KEY` 是敏感密钥，**永远不要**添加到 `NEXT_PUBLIC_*` 前缀
- ✅ 使用 `.env.local` 存储本地开发密钥，并确保已添加到 `.gitignore`
- ✅ 生产环境使用平台的环境变量管理（Vercel、Netlify 等）

