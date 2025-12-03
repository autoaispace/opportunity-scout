# 🚀 下一步操作指南

> **当前状态**: ✅ 环境变量已配置

---

## 📋 完成清单

### ✅ 已完成
- [x] 创建 Supabase 项目
- [x] 配置 `.env.local` 文件
- [x] 安装项目依赖

### 🔄 待完成（只需 5 分钟）

---

## 步骤 1️⃣：获取 Service Role Key（1 分钟）

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`spvgtncxsmqvgwabcmyu`
3. 点击 **Settings** → **API**
4. 找到 **Service Role Key**（⚠️ 注意：这个 Key 很长，以 `eyJ` 开头）
5. 复制整个 Key

6. **更新 `.env.local` 文件**：
   ```bash
   # 打开文件
   open .env.local
   
   # 替换这一行：
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   
   # 改为：
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...（你复制的完整 Key）
   ```

---

## 步骤 2️⃣：运行数据库迁移（2 分钟）

### 方法 A：在 Supabase Dashboard 运行（推荐）

1. 打开 [Supabase SQL Editor](https://supabase.com/dashboard/project/spvgtncxsmqvgwabcmyu/sql)
2. 点击 **New Query**
3. 复制 `supabase/SETUP_DATABASE.sql` 文件的**全部内容**
4. 粘贴到 SQL 编辑器
5. 点击 **Run** 按钮
6. 等待执行完成（应该看到 ✅ Success）

**验证**：执行后应该看到：
```
table_name | row_count
-----------|-----------
profiles   | 0
demands    | 5
user_views | 0
```

### 方法 B：使用 Supabase CLI（可选）

```bash
# 进入项目目录
cd opportunity-scout

# 初始化 Supabase
npx supabase init

# 链接项目
npx supabase link --project-ref spvgtncxsmqvgwabcmyu

# 推送迁移
npx supabase db push
```

---

## 步骤 3️⃣：配置 OAuth（2 分钟）

### Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建 OAuth 2.0 客户端
3. 设置回调 URL：
   ```
   https://spvgtncxsmqvgwabcmyu.supabase.co/auth/v1/callback
   ```
4. 复制 **Client ID** 和 **Client Secret**

5. 在 Supabase Dashboard:
   - **Authentication** → **Providers** → **Google**
   - 启用 Google
   - 粘贴 Client ID 和 Client Secret
   - 保存

### Apple OAuth（可选，暂时可跳过）

Apple OAuth 配置较复杂，可以暂时跳过，先用 Google 测试。

---

## 步骤 4️⃣：启动项目！（30 秒）

```bash
# 确保在项目目录
cd opportunity-scout

# 启动开发服务器
npm run dev
```

访问：**http://localhost:3000**

---

## 🎯 测试用户流程

### 1. 首次访问
- 自动跳转到登录页
- 看到 Google 和 Apple 登录按钮

### 2. Google 登录
- 点击 "使用 Google 继续"
- 完成 Google OAuth
- 自动跳转回应用

### 3. 查看 Feed
- 看到 5 条测试需求
- **免费用户**：只能看到前 3 条
- 第 4 条开始显示模糊锁定

### 4. 查看详情
- 点击任意卡片
- 基础信息可见（标题、摘要、痛点指数）
- **Pro 内容锁定**：
  - 详细描述 - 模糊
  - 竞品分析 - 模糊
  - 热度趋势 - 模糊
  - ROI 预估 - 模糊

### 5. 升级 Pro（Mock 演示）
- 点击 "立即升级" 按钮
- 选择套餐（推荐 Yearly - 有 "最超值" 标签）
- 点击 "完成支付（演示）"
- 等待 1 秒自动跳转
- ✅ 已升级为 Pro 用户

### 6. 查看完整内容
- 刷新页面或返回 Feed
- 现在可以看到所有需求（无限制）
- 详情页显示完整内容：
  - ✅ 详细描述
  - ✅ 竞品分析卡片
  - ✅ 热度趋势图
  - ✅ ROI 预估范围

---

## 🐛 遇到问题？

### Q1: 登录后出现错误

**检查**：
- `.env.local` 中的 URL 和 Keys 是否正确
- 数据库迁移是否成功运行
- 检查浏览器控制台的错误信息

**解决**：
```bash
# 重新启动开发服务器
npm run dev
```

### Q2: 数据库查询失败

**检查**：
- 是否运行了 `SETUP_DATABASE.sql`
- RLS 策略是否已应用

**验证**：
在 Supabase SQL Editor 运行：
```sql
SELECT * FROM demands LIMIT 1;
```
应该返回 1 条记录。

### Q3: OAuth 登录失败

**暂时跳过**：
如果 OAuth 配置遇到困难，可以：

1. 在 Supabase Dashboard → Authentication → Users
2. 手动创建测试用户
3. 在 SQL Editor 运行：
```sql
INSERT INTO profiles (id, email, provider, subscription_status)
VALUES (
  'your-user-id-from-auth-users',
  'test@example.com',
  'google',
  'free'
);
```

### Q4: 看不到测试数据

**重新插入**：
在 SQL Editor 运行 `SETUP_DATABASE.sql` 的最后部分（INSERT 语句）。

---

## 📱 移动端测试（可选）

在手机上测试：

```bash
# 1. 查看本机 IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# 2. 假设你的 IP 是 192.168.1.100
# 更新 .env.local:
NEXT_PUBLIC_SITE_URL=http://192.168.1.100:3000

# 3. 重启服务器
npm run dev

# 4. 手机访问
http://192.168.1.100:3000
```

---

## 📊 查看埋点日志

打开浏览器控制台（F12），你会看到：

```
🔐 [Analytics] auth_login_success { provider: 'google' }
👀 [Analytics] view_feed {}
👆 [Analytics] demand_card_click { demand_id: 'xxx' }
🔒 [Analytics] click_locked_content { field: 'competitors' }
💳 [Analytics] checkout_started { plan: 'yearly' }
✅ [Analytics] checkout_success { plan: 'yearly' }
```

所有用户行为都会被追踪并输出到控制台。

---

## 🎉 完成后

恭喜！你现在有一个完整运行的 SaaS 应用：

- ✅ 用户认证
- ✅ 数据库 + RLS 安全
- ✅ Freemium 商业模式
- ✅ 订阅系统
- ✅ 内容权限控制
- ✅ 埋点系统
- ✅ 多语言支持
- ✅ 响应式设计

---

## 📚 继续学习

**修改功能**：
- `components/feed/` - Feed 列表相关
- `components/demand/` - 详情页相关
- `components/subscription/` - 订阅相关
- `lib/db/api.ts` - 数据库查询

**添加新功能**：
参考 `PROJECT_BLUEPRINT.md` 第 14 章节（Future Enhancements）

**部署到生产**：
参考 `PROJECT_BLUEPRINT.md` 第 13 章节（Deployment Checklist）

---

## 💬 需要帮助？

- 📖 完整技术文档：`PROJECT_BLUEPRINT.md`
- ⚡ 快速启动：`QUICKSTART.md`
- 📊 实施总结：`IMPLEMENTATION_SUMMARY.md`

---

**祝开发顺利！🚀**

