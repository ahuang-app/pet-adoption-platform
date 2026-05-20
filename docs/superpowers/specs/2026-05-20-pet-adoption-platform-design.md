# 暖心宠物领养平台 — 设计规格书

## 项目概述

构建一个生产级宠物领养平台 MVP，以温暖治愈的视觉风格呈现可领养宠物信息，支持搜索筛选、用户认证、收藏与领养申请全流程。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5 + Vite (PWA) |
| 路由 | React Router v7 |
| 样式 | Tailwind CSS v4 + shadcn/ui |
| 图标 | Lucide React |
| 动效 | Framer Motion |
| 状态管理 | Zustand (UI 状态) + TanStack React Query (服务端状态) |
| 后端 | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| 测试 | Vitest + React Testing Library |

## 架构模式

采用**功能模块架构（Feature-based）**：

```
src/
  features/
    pets/         -- 宠物卡片、详情、筛选
    auth/         -- 登录、注册
    dashboard/    -- 收藏、申请、通知
    adoption/     -- 领养申请表单
    home/         -- Hero、成功故事、收容所
  shared/         -- 通用 UI 组件、布局
  lib/            -- supabase 客户端、工具函数
  store/          -- Zustand slices（按模块拆分）
  types/          -- 全局 TypeScript 类型
```

## 路由结构

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 长滚动：Hero → 搜索栏 → 宠物卡片 → 成功故事 → 收容所 → 页脚 |
| `/pets/:id` | 宠物详情 | 故事化叙事：认识我 → 我的故事 → 我的健康 → 如何带我回家 |
| `/search` | 搜索结果 | 筛选侧边栏 + 结果网格 |
| `/adopt/:petId` | 领养申请 | 宠物摘要 + 申请表单（需登录） |
| `/login` | 登录 | 邮箱/手机号 Tab 切换 |
| `/register` | 注册 | 邮箱/手机号双通道注册 |
| `/dashboard` | 用户中心 | 资料编辑 + 收藏 + 申请记录 + 通知（需登录） |

## 数据库设计

```sql
-- 物种
species (id, name, icon)

-- 品种
breeds (id, species_id, name)

-- 宠物
pets (id, name, age, species_id, breed_id, size, traits[],
      image_url, health_status, shelter_info, description,
      is_adopted, created_at)

-- 用户（关联 auth.users）
public.users (id, name, avatar_url, phone, email, created_at)
-- avatar_url 指向 Supabase Storage bucket: avatars

-- 收藏
favorites (id, user_id, pet_id, created_at)

-- 领养申请
adoption_applications (id, user_id, pet_id, name, phone,
                       message, status, created_at, updated_at)
-- status: pending | approved | rejected

-- 成功故事
success_stories (id, pet_name, before_image, after_image,
                 story_text, adopter_name, created_at)

-- 通知
notifications (id, user_id, application_id, message,
               is_read, created_at)
```

RLS 策略：公开数据所有人可读，用户私有数据仅本人可读写。

## 状态管理

- **Zustand**：UI 状态（筛选条件、弹窗开关、通知未读计数）
- **TanStack React Query**：服务端状态（pets 列表/详情、收藏、申请、通知），自动缓存与重新获取
- **Supabase Realtime**：订阅 notifications 表变更，实时推送申请状态更新

## 组件树

```
App
├── AuthProvider
├── Layout (Navbar + Footer)
├── HomePage
│   ├── HeroSection（插画 + 标题 + CTA）
│   ├── SearchBar（物种/年龄/体型筛选 → /search）
│   ├── PetCardGrid（Framer Motion hover 上浮 + 暖色光晕）
│   ├── SuccessStoriesScroll（横向拖动卡片）
│   ├── ShelterWall（Logo 信任墙）
│   └── FooterCTA
├── PetDetailPage（故事化叙事布局）
├── SearchPage（FilterSidebar + PetCardGrid）
├── AdoptPage（PetSummary + ApplicationForm）
├── AuthPages（LoginForm / RegisterForm）
├── DashboardPage
│   ├── ProfileSection（头像上传）
│   ├── FavoritesList
│   ├── ApplicationsList（状态标签）
│   └── NotificationsPanel（Realtime badge）
└── Shared (PetCard, Modal, StatusBadge, EmptyState, LoadingState, ErrorState)
```

## 视觉设计

- **卡片风格**：温暖圆润风 — 大圆角、柔阴影、hover 时卡片上浮 8px + 暖色光晕扩散 + 图片 scale(1.05)
- **Hero**：大幅暖心插画 + 简短标语 + CTA 按钮
- **成功故事**：横向可拖拽滚动卡片
- **收容所**：Logo 网格信任墙
- **搜索**：筛选条件 → 跳转独立结果页
- **色系**：柔橙、暖黄、大地色

## 动效策略

| 触发方式 | 动效 | 应用位置 |
|---------|------|---------|
| 路由切换 | fadeInUp | 所有页面 |
| whileInView | fadeIn + translateY(20px) | Hero 副标题、卡片网格、故事区 |
| hover | translateY(-8px) + 光晕 + img scale(1.05) | PetCard |
| staggerChildren | 子元素依次淡入 0.1s 间隔 | 宠物列表网格 |
| drag | 鼠标拖拽 + 惯性衰减 | 成功故事滚动 |
| layoutId | 图片飞入过渡 | / → /pets/:id |
| tap | scale(0.95) | CTA 按钮 |
| Realtime | 数字弹跳 + 脉冲光晕 | 通知 badge |

动画时长 0.3-0.5s，spring 曲线为主。

## 错误处理与加载

- **页面级加载**：骨架屏（Skeleton），匹配实际卡片网格布局
- **组件级加载**：静默更新，不阻断交互
- **操作中**：按钮 spinner + 禁用
- **查询失败**：ErrorState 组件 + 重试按钮
- **Auth 失败**：toast 提示具体原因
- **表单验证**：字段级错误提示
- **404**：EmptyState（"该宠物不存在"）
- **空状态**：友好的引导文案 + 跳转按钮
- **网络异常**：全局 toast "网络连接异常"

## 测试策略

- **单元测试**：宠物筛选逻辑、表单验证逻辑
- **组件测试**：PetCard 渲染、搜索筛选交互
- **构建验证**：`npx tsc --noEmit` + `npm run build`
