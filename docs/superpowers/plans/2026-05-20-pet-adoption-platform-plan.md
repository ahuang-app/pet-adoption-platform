# 暖心宠物领养平台 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个完整的宠物领养平台 MVP，包含首页展示、搜索筛选、宠物详情、用户认证、收藏、领养申请、实时通知等全流程功能。

**Architecture:** 功能模块架构（Feature-based）。React 19 + TypeScript 5 + Vite，路由用 React Router v7，样式用 Tailwind CSS v4 + shadcn/ui，动效用 Framer Motion，状态管理用 Zustand + TanStack React Query，后端用 Supabase (PostgreSQL + Auth + Storage + Realtime)。

**Tech Stack:** React 19, TypeScript 5, Vite, React Router v7, Tailwind CSS v4, shadcn/ui, Lucide React, Framer Motion, Zustand, TanStack React Query, Supabase, Vitest, React Testing Library

---

## 文件结构

```
src/
  lib/
    supabase.ts              -- Supabase 客户端初始化
    utils.ts                 -- cn() 工具函数
  
  types/
    index.ts                 -- 全局 TS 类型定义
  
  store/
    ui-store.ts              -- Zustand store (筛选条件、通知计数)
  
  features/
    auth/
      AuthProvider.tsx        -- Supabase Auth Context
      LoginPage.tsx           -- /login
      RegisterPage.tsx        -- /register
      useAuth.ts              -- Auth hooks
  
    home/
      HomePage.tsx            -- / 首页（组合各区块）
      HeroSection.tsx         -- Hero 插画 + CTA
      SearchBar.tsx           -- 搜索栏 → /search
      SuccessStoriesScroll.tsx -- 横向拖拽成功故事
      ShelterWall.tsx         -- Logo 信任墙
      FooterCTA.tsx           -- 页脚 CTA
  
    pets/
      PetCard.tsx             -- 可复用宠物卡片（Framer Motion 动效）
      PetCardGrid.tsx         -- 卡片网格
      PetDetailPage.tsx       -- /pets/:id 故事化详情
      usePets.ts              -- React Query hooks
  
    search/
      SearchPage.tsx          -- /search 结果页
      FilterSidebar.tsx       -- 筛选侧边栏
      useSearch.ts            -- 搜索 hooks
  
    adoption/
      AdoptPage.tsx           -- /adopt/:petId 申请页
      ApplicationForm.tsx     -- 申请表单
      useApplications.ts      -- 申请 hooks
  
    dashboard/
      DashboardPage.tsx       -- /dashboard 用户中心
      ProfileSection.tsx      -- 头像上传 + 昵称编辑
      FavoritesList.tsx       -- 收藏列表
      ApplicationsList.tsx    -- 申请记录 + 状态标签
      NotificationsPanel.tsx  -- 通知面板（Realtime badge）
      useFavorites.ts         -- 收藏 hooks
      useNotifications.ts     -- 通知 hooks
  
  shared/
    Layout.tsx                -- 全局布局（Navbar + <Outlet /> + Footer）
    Navbar.tsx                -- 顶部导航
    Footer.tsx                -- 页脚
    Modal.tsx                 -- 通用弹窗/翻转卡片容器
    StatusBadge.tsx           -- 申请状态标签
    EmptyState.tsx            -- 空状态
    LoadingState.tsx          -- 骨架屏
    ErrorState.tsx            -- 错误 + 重试
  
  App.tsx                     -- 根组件（路由配置）
  main.tsx                    -- 入口
  index.css                   -- Tailwind + 全局样式

supabase/
  seed.sql                    -- 建表 + RLS + 种子数据

.env.example                  -- 环境变量模板
```

---

### Task 1: 项目脚手架与依赖安装

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `index.html`, `src/main.tsx`, `src/index.css`, `.env.example`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: 初始化 Vite + React + TS 项目**

用 `npm create vite@latest` 初始化项目，然后安装所有依赖。

Run:
```bash
cd "D:/CCProgram/宠物领养网站" && npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: 安装全部依赖**

Run:
```bash
npm install react-router-dom framer-motion zustand @tanstack/react-query @supabase/supabase-js
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: 安装 shadcn/ui 组件（需要时逐个添加）**

Run:
```bash
npx shadcn@latest init -d
npx shadcn@latest add button card input label select slider form toast separator badge avatar dropdown-menu sheet
```

- [ ] **Step 4: 创建 .env.example**

Write `src/.env.example`:
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- [ ] **Step 5: 配置 Vite**

Write `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 6: 配置 Tailwind + 全局样式**

Write `src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-warm-50: #fff8f0;
  --color-warm-100: #ffecd0;
  --color-warm-200: #ffd9a8;
  --color-warm-300: #ffc580;
  --color-warm-400: #ffb058;
  --color-warm-500: #ff9c30;
  --color-warm-600: #e07e1a;
  --color-warm-700: #b8620e;
  --color-warm-800: #8f4a08;
  --color-warm-900: #6b3503;

  --color-earth-50: #f5f0eb;
  --color-earth-100: #e8dcd0;
  --color-earth-200: #d4bfa5;
  --color-earth-300: #b8946f;
  --color-earth-400: #9c7148;
  --color-earth-500: #7d5533;
  --color-earth-600: #634125;
  --color-earth-700: #4a2f1a;
  --color-earth-800: #331f10;
  --color-earth-900: #1f1108;
}

body {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  background-color: var(--color-warm-50);
  color: var(--color-earth-800);
}
```

- [ ] **Step 7: 写入口文件 src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
```

- [ ] **Step 8: 验证 Vite dev server 启动**

Run: `npm run dev`，确认无报错。

- [ ] **Step 9: Commit**

```
git add -A && git commit -m "feat: 初始化项目脚手架，安装全部依赖"
```

---

### Task 2: 类型定义、工具函数、Zustand Store

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/supabase.ts`
- Create: `src/lib/utils.ts`
- Create: `src/store/ui-store.ts`

- [ ] **Step 1: 创建全局类型定义**

Write `src/types/index.ts`:
```ts
export type PetSize = 'small' | 'medium' | 'large'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Species {
  id: number
  name: string
  icon: string
}

export interface Breed {
  id: number
  species_id: number
  name: string
}

export interface Pet {
  id: number
  name: string
  age: number
  species_id: number
  breed_id: number
  size: PetSize
  traits: string[]
  image_url: string
  health_status: string
  shelter_info: string
  description: string
  is_adopted: boolean
  created_at: string
  species?: Species
  breed?: Breed
}

export interface UserProfile {
  id: string
  name: string
  avatar_url: string | null
  phone: string | null
  email: string | null
  created_at: string
}

export interface Favorite {
  id: number
  user_id: string
  pet_id: number
  created_at: string
  pet?: Pet
}

export interface AdoptionApplication {
  id: number
  user_id: string
  pet_id: number
  name: string
  phone: string
  message: string
  status: ApplicationStatus
  created_at: string
  updated_at: string
  pet?: Pet
}

export interface SuccessStory {
  id: number
  pet_name: string
  before_image: string
  after_image: string
  story_text: string
  adopter_name: string
  created_at: string
}

export interface Notification {
  id: number
  user_id: string
  application_id: number
  message: string
  is_read: boolean
  created_at: string
  application?: AdoptionApplication
}

export interface PetFilters {
  species_id?: number
  age_min?: number
  age_max?: number
  size?: PetSize
}
```

- [ ] **Step 2: 创建 cn 工具函数**

Write `src/lib/utils.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: 创建 Supabase 客户端**

Write `src/lib/supabase.ts`:
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 环境变量')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
})
```

- [ ] **Step 4: 创建 Zustand UI Store**

Write `src/store/ui-store.ts`:
```ts
import { create } from 'zustand'
import type { PetFilters } from '@/types'

interface UIState {
  filters: PetFilters
  setFilters: (filters: Partial<PetFilters>) => void
  resetFilters: () => void
  unreadCount: number
  setUnreadCount: (count: number) => void
}

const defaultFilters: PetFilters = {}

export const useUIStore = create<UIState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
}))
```

- [ ] **Step 5: Commit**

```
git add src/types src/lib src/store && git commit -m "feat: 添加类型定义、Supabase客户端、Zustand store"
```

---

### Task 3: Supabase 数据库种子脚本

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: 编写完整 SQL 种子文件**

Write `supabase/seed.sql`:

```sql
-- 物种表
CREATE TABLE IF NOT EXISTS species (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT
);

-- 品种表
CREATE TABLE IF NOT EXISTS breeds (
  id BIGSERIAL PRIMARY KEY,
  species_id BIGINT REFERENCES species(id),
  name TEXT NOT NULL
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 宠物表
CREATE TABLE IF NOT EXISTS pets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  species_id BIGINT REFERENCES species(id),
  breed_id BIGINT REFERENCES breeds(id),
  size TEXT CHECK (size IN ('small', 'medium', 'large')),
  traits TEXT[] DEFAULT '{}',
  image_url TEXT,
  health_status TEXT,
  shelter_info TEXT,
  description TEXT,
  is_adopted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id BIGINT REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, pet_id)
);

-- 领养申请表
CREATE TABLE IF NOT EXISTS adoption_applications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id BIGINT REFERENCES pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 成功故事表
CREATE TABLE IF NOT EXISTS success_stories (
  id BIGSERIAL PRIMARY KEY,
  pet_name TEXT NOT NULL,
  before_image TEXT,
  after_image TEXT,
  story_text TEXT,
  adopter_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_id BIGINT REFERENCES adoption_applications(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 策略：公开数据所有人可读
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开物种" ON species FOR SELECT USING (true);
CREATE POLICY "公开品种" ON breeds FOR SELECT USING (true);
CREATE POLICY "公开宠物" ON pets FOR SELECT USING (true);
CREATE POLICY "公开故事" ON success_stories FOR SELECT USING (true);

-- RLS：用户私有数据
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "本人读写" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "本人读写收藏" ON favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "本人读写申请" ON adoption_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "本人读写通知" ON notifications FOR ALL USING (auth.uid() = user_id);

-- 启用 Realtime（通知表）
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 种子数据：物种
INSERT INTO species (id, name, icon) VALUES
  (1, '狗', '🐕'), (2, '猫', '🐈'), (3, '兔', '🐰');

-- 种子数据：品种
INSERT INTO breeds (id, species_id, name) VALUES
  (1, 1, '金毛寻回犬'), (2, 1, '拉布拉多'), (3, 1, '柯基'),
  (4, 2, '布偶猫'), (5, 2, '英短'), (6, 2, '橘猫'),
  (7, 3, '荷兰垂耳兔'), (8, 3, '侏儒兔');

-- 种子数据：宠物
INSERT INTO pets (name, age, species_id, breed_id, size, traits, image_url, health_status, shelter_info, description) VALUES
  ('Buddy', 2, 1, 1, 'large', ARRAY['温顺', '活泼', '亲人'], 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop', '已接种疫苗，已绝育', '阳光动物救助中心 · 北京市朝阳区', 'Buddy 是一只非常友善的金毛，喜欢和人玩耍，适合有孩子的家庭。'),
  ('小花', 1, 2, 4, 'medium', ARRAY['安静', '粘人', '优雅'], 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop', '已接种疫苗，已绝育', '喵星人救助站 · 上海市浦东新区', '小花是一只温柔的布偶猫，喜欢窝在主人腿上，非常适合公寓生活。'),
  ('豆豆', 3, 1, 3, 'small', ARRAY['机灵', '忠诚', '好动'], 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop', '已接种疫苗', '爱心宠物之家 · 广州市天河区', '豆豆是一只可爱的柯基，精力充沛，每天都需要散步和玩耍。'),
  ('雪球', 6, 3, 7, 'small', ARRAY['温顺', '安静', '可爱'], 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop', '健康良好', '小动物保护协会 · 成都市武侯区', '雪球是一只纯白的垂耳兔，性格温顺安静，适合新手饲养。'),
  ('大橘', 4, 2, 6, 'medium', ARRAY['贪吃', '慵懒', '亲人'], 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop', '已接种疫苗', '喵星人救助站 · 上海市浦东新区', '大橘是一只典型的橘猫，爱吃爱睡，性格超级好，从来不挠人。'),
  ('Lucky', 1, 1, 2, 'large', ARRAY['热情', '聪明', '忠诚'], 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=400&fit=crop', '已接种疫苗，已绝育', '阳光动物救助中心 · 北京市朝阳区', 'Lucky 是一只聪明的拉布拉多幼犬，学习能力超强，正在接受基础训练。'),
  ('咪咪', 2, 2, 5, 'small', ARRAY['独立', '爱干净', '机警'], 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600&h=400&fit=crop', '已接种疫苗', '爱心宠物之家 · 广州市天河区', '咪咪是一只优雅的英短，非常爱干净，独立性强但也会撒娇。'),
  ('团团', 1, 3, 8, 'small', ARRAY['活泼', '好奇', '粘人'], 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop', '健康良好', '小动物保护协会 · 成都市武侯区', '团团是一只小侏儒兔，好奇心强，喜欢探索新环境，非常粘人。');

-- 种子数据：成功故事
INSERT INTO success_stories (pet_name, before_image, after_image, story_text, adopter_name) VALUES
  ('阿福', 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=400', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', '阿福刚来救助站时非常瘦弱，经过3个月的照顾，现在已经健康快乐地生活在新家了！', '张女士'),
  ('奶茶', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400', 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400', '奶茶从一只胆小的流浪猫变成了家里的女王，每天都享受着被宠爱的日子。', '李先生');
```

- [ ] **Step 2: 说明使用方法**

本文件需在 Supabase SQL Editor 中手动执行，或在 Supabase CLI 中运行。
终端提示用户：
```
请在 Supabase Dashboard → SQL Editor 中复制并执行 supabase/seed.sql 文件内容。
同时请确保已开启 Supabase Realtime 功能。
```

- [ ] **Step 3: Commit**

```
git add supabase/seed.sql && git commit -m "feat: 添加数据库Schema、RLS策略与种子数据"
```

---

### Task 4: 共享 UI 组件（Layout, Navbar, Footer, StatusBadge, Empty/Loading/ErrorState）

**Files:**
- Create: `src/shared/Layout.tsx`, `src/shared/Navbar.tsx`, `src/shared/Footer.tsx`
- Create: `src/shared/StatusBadge.tsx`, `src/shared/Modal.tsx`
- Create: `src/shared/EmptyState.tsx`, `src/shared/LoadingState.tsx`, `src/shared/ErrorState.tsx`
- Create: `src/App.tsx` (最小路由骨架)

- [ ] **Step 1: 创建 Navbar**

Write `src/shared/Navbar.tsx`:
```tsx
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Search, User, LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/useAuth'
import { useUIStore } from '@/store/ui-store'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const unreadCount = useUIStore((s) => s.unreadCount)
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-warm-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-warm-600 hover:text-warm-700 transition-colors">
          <Heart className="w-7 h-7 fill-current" />
          <span className="text-xl font-bold">暖心领养</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
            <Search className="w-5 h-5" />
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/dashboard')}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-1" /> 退出
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" className="bg-warm-500 hover:bg-warm-600" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: 创建 Footer**

Write `src/shared/Footer.tsx`:
```tsx
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-earth-800 text-warm-100 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 fill-current text-warm-400" />
          <span className="text-lg font-bold">暖心领养</span>
        </div>
        <p className="text-earth-300 text-sm">每一只小动物都值得一个温暖的家</p>
        <p className="text-earth-400 text-xs mt-4">© 2026 暖心领养平台 · 用爱终止流浪</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: 创建 Layout**

Write `src/shared/Layout.tsx`:
```tsx
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: 创建 StatusBadge**

Write `src/shared/StatusBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/types'

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  pending: { label: '审核中', variant: 'secondary' },
  approved: { label: '已通过', variant: 'default' },
  rejected: { label: '已拒绝', variant: 'destructive' },
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
```

- [ ] **Step 5: 创建 EmptyState / LoadingState / ErrorState**

Write `src/shared/EmptyState.tsx`:
```tsx
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface Props {
  message: string
  actionLabel?: string
  actionTo?: string
}

export default function EmptyState({ message, actionLabel, actionTo }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-earth-400 text-lg mb-4">{message}</p>
      {actionLabel && actionTo && (
        <Button asChild variant="outline" className="border-warm-300 text-warm-600">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
```

Write `src/shared/LoadingState.tsx`:
```tsx
export default function LoadingState({ rows = 2, cols = 3 }: { rows?: number; cols?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-6 animate-pulse`}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
          <div className="bg-warm-100 rounded-xl h-48" />
          <div className="h-4 bg-warm-100 rounded w-3/4" />
          <div className="h-3 bg-warm-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
```

Write `src/shared/ErrorState.tsx`:
```tsx
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-earth-500 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>重试</Button>
      )}
    </div>
  )
}
```

- [ ] **Step 6: 创建 Modal 组件**

Write `src/shared/Modal.tsx`:
```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function Modal({ open, onClose, children, title }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 z-10"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-earth-700">{title}</h2>
                <button onClick={onClose} className="text-earth-400 hover:text-earth-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 7: 创建最小 App.tsx 路由骨架**

Write `src/App.tsx`:
```tsx
import { Routes, Route } from 'react-router-dom'
import Layout from '@/shared/Layout'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<div className="p-8 text-center text-earth-500">首页 — 开发中</div>} />
        <Route path="pets/:id" element={<div className="p-8 text-center text-earth-500">宠物详情 — 开发中</div>} />
        <Route path="search" element={<div className="p-8 text-center text-earth-500">搜索结果 — 开发中</div>} />
        <Route path="adopt/:petId" element={<div className="p-8 text-center text-earth-500">领养申请 — 开发中</div>} />
        <Route path="login" element={<div className="p-8 text-center text-earth-500">登录 — 开发中</div>} />
        <Route path="register" element={<div className="p-8 text-center text-earth-500">注册 — 开发中</div>} />
        <Route path="dashboard" element={<div className="p-8 text-center text-earth-500">用户中心 — 开发中</div>} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 8: 验证**

Run: `npm run dev`，确认路由全部可访问且 Layout 正常渲染。

- [ ] **Step 9: Commit**

```
git add src/shared src/App.tsx && git commit -m "feat: 添加共享UI组件(Layout/Navbar/Footer/StatusBadge/Modal/EmptyState等)与路由骨架"
```

---

### Task 5: Auth 功能模块（AuthProvider、useAuth、登录注册页）

**Files:**
- Create: `src/features/auth/AuthProvider.tsx`
- Create: `src/features/auth/useAuth.ts`
- Create: `src/features/auth/LoginPage.tsx`
- Create: `src/features/auth/RegisterPage.tsx`
- Modify: `src/App.tsx`（接入 AuthProvider 和登录/注册路由）

- [ ] **Step 1: 创建 AuthProvider**

Write `src/features/auth/AuthProvider.tsx`:
```tsx
import { createContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, signOut: async () => {},
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

- [ ] **Step 2: 创建 useAuth hook**

Write `src/features/auth/useAuth.ts`:
```ts
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 3: 创建 LoginPage**

Write `src/features/auth/LoginPage.tsx`:
```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ phone, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Heart className="w-10 h-10 text-warm-500 mx-auto fill-current" />
          <h1 className="text-2xl font-bold text-earth-700 mt-3">欢迎回来</h1>
          <p className="text-earth-400 text-sm mt-1">登录你的暖心领养账户</p>
        </div>

        <Tabs defaultValue="email">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="email" className="flex-1">邮箱登录</TabsTrigger>
            <TabsTrigger value="phone" className="flex-1">手机号登录</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div><Label>邮箱</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div><Label>手机号</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="13800138000" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-earth-400 mt-6">
          还没有账户？<Link to="/register" className="text-warm-500 hover:underline">立即注册</Link>
        </p>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 RegisterPage**

Write `src/features/auth/RegisterPage.tsx`:
```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Heart } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('users').insert({ id: data.user.id, name, email })
      setSuccess('注册成功！请查收验证邮件')
    }
    setLoading(false)
  }

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      phone, password,
      options: { data: { name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('users').insert({ id: data.user.id, name, phone })
      setSuccess('注册成功！')
      setTimeout(() => navigate('/login'), 1500)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Heart className="w-10 h-10 text-warm-500 mx-auto fill-current" />
          <h1 className="text-2xl font-bold text-earth-700 mt-3">加入我们</h1>
          <p className="text-earth-400 text-sm mt-1">创建一个暖心领养账户</p>
        </div>

        <Tabs defaultValue="email">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="email" className="flex-1">邮箱注册</TabsTrigger>
            <TabsTrigger value="phone" className="flex-1">手机号注册</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div><Label>昵称</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的昵称" required /></div>
              <div><Label>邮箱</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少6位" required minLength={6} /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '注册中...' : '注册'}</Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneRegister} className="space-y-4">
              <div><Label>昵称</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的昵称" required /></div>
              <div><Label>手机号</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="13800138000" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少6位" required minLength={6} /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '注册中...' : '注册'}</Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-earth-400 mt-6">
          已有账户？<Link to="/login" className="text-warm-500 hover:underline">去登录</Link>
        </p>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 5: 更新 App.tsx 接入 AuthProvider**

Update `src/App.tsx`:
```tsx
import { Routes, Route } from 'react-router-dom'
import Layout from '@/shared/Layout'
import AuthProvider from '@/features/auth/AuthProvider'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div className="p-8 text-center text-earth-500">首页 — 开发中</div>} />
          <Route path="pets/:id" element={<div className="p-8 text-center text-earth-500">宠物详情 — 开发中</div>} />
          <Route path="search" element={<div className="p-8 text-center text-earth-500">搜索结果 — 开发中</div>} />
          <Route path="adopt/:petId" element={<div className="p-8 text-center text-earth-500">领养申请 — 开发中</div>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<div className="p-8 text-center text-earth-500">用户中心 — 开发中</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
```

- [ ] **Step 6: Commit**

```
git add src/features/auth src/App.tsx && git commit -m "feat: 添加Auth模块(Provider/hooks/登录/注册页)"
```

---

### Task 6: 宠物数据层（React Query Hooks）

**Files:**
- Create: `src/features/pets/usePets.ts`

- [ ] **Step 1: 创建 usePets hooks**

Write `src/features/pets/usePets.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Pet, PetFilters } from '@/types'

async function fetchPets(filters?: PetFilters): Promise<Pet[]> {
  let query = supabase
    .from('pets')
    .select('*, species:species_id(*), breed:breed_id(*)')
    .eq('is_adopted', false)
    .order('created_at', { ascending: false })

  if (filters?.species_id) query = query.eq('species_id', filters.species_id)
  if (filters?.size) query = query.eq('size', filters.size)
  if (filters?.age_min !== undefined) query = query.gte('age', filters.age_min)
  if (filters?.age_max !== undefined) query = query.lte('age', filters.age_max)

  const { data, error } = await query
  if (error) throw error
  return data as Pet[]
}

export function usePets(filters?: PetFilters) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: () => fetchPets(filters),
  })
}

export function usePet(id: number | undefined) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: async (): Promise<Pet> => {
      const { data, error } = await supabase
        .from('pets')
        .select('*, species:species_id(*), breed:breed_id(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Pet
    },
    enabled: !!id,
  })
}

export function useSpecies() {
  return useQuery({
    queryKey: ['species'],
    queryFn: async () => {
      const { data, error } = await supabase.from('species').select('*').order('id')
      if (error) throw error
      return data
    },
  })
}

export function useBreeds(speciesId?: number) {
  return useQuery({
    queryKey: ['breeds', speciesId],
    queryFn: async () => {
      let query = supabase.from('breeds').select('*')
      if (speciesId) query = query.eq('species_id', speciesId)
      const { data, error } = await query.order('id')
      if (error) throw error
      return data
    },
    enabled: true,
  })
}
```

- [ ] **Step 2: Commit**

```
git add src/features/pets/usePets.ts && git commit -m "feat: 添加宠物数据层(React Query hooks)"
```

---

### Task 7: 宠物卡片与首页区块

**Files:**
- Create: `src/features/pets/PetCard.tsx`
- Create: `src/features/pets/PetCardGrid.tsx`
- Create: `src/features/home/HeroSection.tsx`
- Create: `src/features/home/SearchBar.tsx`
- Create: `src/features/home/SuccessStoriesScroll.tsx`
- Create: `src/features/home/ShelterWall.tsx`
- Create: `src/features/home/FooterCTA.tsx`
- Create: `src/features/home/HomePage.tsx`
- Modify: `src/App.tsx`（接入首页）

- [ ] **Step 1: 创建 PetCard（Framer Motion 动效）**

Write `src/features/pets/PetCard.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { Pet } from '@/types'
import { cn } from '@/lib/utils'

const sizeLabel: Record<string, string> = { small: '小型', medium: '中型', large: '大型' }

export default function PetCard({ pet, featured }: { pet: Pet; featured?: boolean }) {
  return (
    <motion.div
      layoutId={featured ? `pet-${pet.id}` : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer
                 hover:shadow-[0_12px_40px_rgba(255,156,48,0.2)] transition-shadow duration-300"
    >
      <Link to={`/pets/${pet.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <motion.img
            src={pet.image_url}
            alt={pet.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {pet.is_adopted && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">已被领养</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-earth-700">{pet.name}</h3>
            <span className="text-sm text-earth-400">{pet.age}岁</span>
          </div>
          <p className="text-sm text-earth-400 mt-1">
            {pet.breed?.name ?? pet.species?.name} · {pet.size ? sizeLabel[pet.size] : ''}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {pet.traits?.slice(0, 3).map((trait) => (
              <span key={trait} className="bg-warm-100 text-warm-700 text-xs px-3 py-1 rounded-full">{trait}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: 创建 PetCardGrid**

Write `src/features/pets/PetCardGrid.tsx`:
```tsx
import { motion } from 'framer-motion'
import PetCard from './PetCard'
import type { Pet } from '@/types'

export default function PetCardGrid({ pets }: { pets: Pet[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {pets.map((pet) => (
        <motion.div key={pet.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <PetCard pet={pet} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

- [ ] **Step 3: 创建 HomePage 各区块**

Write `src/features/home/HeroSection.tsx`:
```tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function HeroSection() {
  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-gradient-to-br from-warm-100 via-warm-50 to-earth-100 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-warm-200 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-warm-600 fill-current" />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-earth-800 mb-4">
          给它们一个<span className="text-warm-500">温暖的家</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-earth-500 mb-8 max-w-2xl mx-auto">
          每只等待领养的小动物都值得被爱。开启你的领养之旅，成为它们生命中最重要的那个人。
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="flex gap-4 justify-center">
          <Button size="lg" className="bg-warm-500 hover:bg-warm-600 text-white text-lg px-8 py-6 rounded-xl" onClick={scrollToSearch}>
            寻找小动物
          </Button>
          <Button size="lg" variant="outline" className="border-warm-300 text-warm-600 text-lg px-8 py-6 rounded-xl" onClick={scrollToSearch}>
            了解更多
          </Button>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-50 to-transparent" />
    </section>
  )
}
```

Write `src/features/home/SearchBar.tsx`:
```tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUIStore } from '@/store/ui-store'
import { useSpecies } from '@/features/pets/usePets'
import type { PetSize } from '@/types'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const { filters, setFilters } = useUIStore()
  const { data: species } = useSpecies()
  const navigate = useNavigate()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.species_id) params.set('species_id', String(filters.species_id))
    if (filters.size) params.set('size', filters.size)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <section id="search-section" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-earth-700 text-center mb-8">寻找你的小伙伴</h2>
        <div className="flex flex-wrap gap-4 items-end justify-center">
          <div className="w-40">
            <label className="text-sm text-earth-500 mb-1 block">物种</label>
            <Select value={filters.species_id ? String(filters.species_id) : ''}
              onValueChange={(v) => setFilters({ species_id: v ? Number(v) : undefined })}>
              <SelectTrigger><SelectValue placeholder="全部物种" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部物种</SelectItem>
                {species?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.icon} {s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <label className="text-sm text-earth-500 mb-1 block">体型</label>
            <Select value={filters.size || ''} onValueChange={(v) => setFilters({ size: (v as PetSize) || undefined })}>
              <SelectTrigger><SelectValue placeholder="不限" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">不限</SelectItem>
                <SelectItem value="small">小型</SelectItem>
                <SelectItem value="medium">中型</SelectItem>
                <SelectItem value="large">大型</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch} className="bg-warm-500 hover:bg-warm-600">
            <Search className="w-4 h-4 mr-2" /> 搜索
          </Button>
        </div>
      </div>
    </section>
  )
}
```

Write `src/features/home/SuccessStoriesScroll.tsx`:
```tsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { SuccessStory } from '@/types'

const fetchStories = async (): Promise<SuccessStory[]> => {
  const { data, error } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export default function SuccessStoriesScroll() {
  const { data: stories } = useQuery({ queryKey: ['success_stories'], queryFn: fetchStories })
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section className="py-16 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl font-bold text-earth-700 text-center mb-8">成功领养故事</motion.h2>
        <motion.div ref={ref} className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing"
          whileTap={{ cursor: 'grabbing' }}>
          {stories?.map((story) => (
            <motion.div key={story.id} drag="x" dragConstraints={ref} dragElastic={0.1}
              className="min-w-[300px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0"
              whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="flex">
                <img src={story.before_image} alt="之前" className="w-1/2 h-40 object-cover" />
                <img src={story.after_image} alt="之后" className="w-1/2 h-40 object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-earth-700">{story.pet_name}</h3>
                <p className="text-sm text-earth-500 mt-1 line-clamp-2">{story.story_text}</p>
                <p className="text-xs text-warm-500 mt-2">— {story.adopter_name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

Write `src/features/home/ShelterWall.tsx`:
```tsx
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'

const shelters = [
  { name: '阳光动物救助中心', city: '北京' },
  { name: '喵星人救助站', city: '上海' },
  { name: '爱心宠物之家', city: '广州' },
  { name: '小动物保护协会', city: '成都' },
  { name: '流浪天使救助站', city: '深圳' },
  { name: '毛孩儿之家', city: '杭州' },
]

export default function ShelterWall() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl font-bold text-earth-700 text-center mb-8">合作收容所</motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {shelters.map((shelter, i) => (
            <motion.div key={shelter.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 p-6 bg-warm-50 rounded-2xl hover:bg-warm-100 transition-colors">
              <Building2 className="w-10 h-10 text-warm-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-earth-700">{shelter.name}</p>
                <p className="text-xs text-earth-400">{shelter.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

Write `src/features/home/FooterCTA.tsx`:
```tsx
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function FooterCTA() {
  const navigate = useNavigate()
  return (
    <section className="py-16 bg-gradient-to-r from-warm-500 to-warm-400">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-4">准备好给它们一个家了吗？</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-warm-100 text-lg mb-8">
          数以千计的小动物正在等待有爱心的你
        </motion.p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Button size="lg" className="bg-white text-warm-600 hover:bg-warm-50 text-lg px-10 py-6 rounded-xl shadow-lg"
            onClick={() => navigate('/search')}>
            开始寻找
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: 创建 HomePage**

Write `src/features/home/HomePage.tsx`:
```tsx
import HeroSection from './HeroSection'
import SearchBar from './SearchBar'
import SuccessStoriesScroll from './SuccessStoriesScroll'
import ShelterWall from './ShelterWall'
import FooterCTA from './FooterCTA'
import PetCardGrid from '@/features/pets/PetCardGrid'
import { usePets } from '@/features/pets/usePets'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'

export default function HomePage() {
  const { data: pets, isLoading, error, refetch } = usePets()

  return (
    <>
      <HeroSection />
      <SearchBar />
      <section className="py-16 bg-warm-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-earth-700 text-center mb-8">等待领养的可爱伙伴</h2>
          {isLoading && <LoadingState rows={1} cols={4} />}
          {error && <ErrorState message="加载宠物列表失败" onRetry={() => refetch()} />}
          {pets && <PetCardGrid pets={pets.slice(0, 4)} />}
        </div>
      </section>
      <SuccessStoriesScroll />
      <ShelterWall />
      <FooterCTA />
    </>
  )
}
```

- [ ] **Step 5: 更新 App.tsx 接入首页**

Update `src/App.tsx` — replace the index route:
```tsx
import HomePage from '@/features/home/HomePage'

// Replace: <Route index element={<div>...</div>} />
// With: <Route index element={<HomePage />} />
```

- [ ] **Step 6: Commit**

```
git add src/features/pets/PetCard.tsx src/features/pets/PetCardGrid.tsx src/features/home src/App.tsx && git commit -m "feat: 添加宠物卡片、首页各区块(Hero/Search/Story/Shelter/CTA)"
```

---

### Task 8: 搜索结果页与筛选侧边栏

**Files:**
- Create: `src/features/search/SearchPage.tsx`
- Create: `src/features/search/FilterSidebar.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 FilterSidebar**

Write `src/features/search/FilterSidebar.tsx`:
```tsx
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useSpecies } from '@/features/pets/usePets'
import { useUIStore } from '@/store/ui-store'
import type { PetSize } from '@/types'
import { useState } from 'react'

export default function FilterSidebar() {
  const { filters, setFilters, resetFilters } = useUIStore()
  const { data: species } = useSpecies()
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 15])

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm p-6 space-y-6 h-fit sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-earth-700">筛选条件</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-earth-400">重置</Button>
      </div>

      <div>
        <Label>物种</Label>
        <Select value={filters.species_id ? String(filters.species_id) : ''}
          onValueChange={(v) => setFilters({ species_id: v ? Number(v) : undefined })}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="全部" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部物种</SelectItem>
            {species?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.icon} {s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>体型</Label>
        <Select value={filters.size || ''} onValueChange={(v) => setFilters({ size: (v as PetSize) || undefined })}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="不限" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">不限</SelectItem>
            <SelectItem value="small">小型</SelectItem>
            <SelectItem value="medium">中型</SelectItem>
            <SelectItem value="large">大型</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>年龄范围：{ageRange[0]} - {ageRange[1]} 岁</Label>
        <Slider className="mt-2" min={0} max={15} step={1} value={ageRange} onValueChange={(v) => {
          setAgeRange(v as [number, number])
          setFilters({ age_min: v[0], age_max: v[1] })
        }} />
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: 创建 SearchPage**

Write `src/features/search/SearchPage.tsx`:
```tsx
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import FilterSidebar from './FilterSidebar'
import PetCardGrid from '@/features/pets/PetCardGrid'
import { usePets } from '@/features/pets/usePets'
import { useUIStore } from '@/store/ui-store'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'
import EmptyState from '@/shared/EmptyState'

export default function SearchPage() {
  const { filters, setFilters } = useUIStore()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const speciesId = searchParams.get('species_id')
    const size = searchParams.get('size')
    if (speciesId) setFilters({ species_id: Number(speciesId) })
    if (size) setFilters({ size: size as any })
  }, [searchParams])

  const { data: pets, isLoading, error, refetch } = usePets(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-earth-700 mb-8">发现小伙伴</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          {isLoading && <LoadingState rows={2} cols={3} />}
          {error && <ErrorState message="搜索失败" onRetry={() => refetch()} />}
          {pets && pets.length === 0 && <EmptyState message="没有匹配的宠物，试试其他筛选条件" actionLabel="清除筛选" actionTo="/search" />}
          {pets && pets.length > 0 && <PetCardGrid pets={pets} />}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 更新 App.tsx 路由**

Update `src/App.tsx` search route:
```tsx
import SearchPage from '@/features/search/SearchPage'
// Replace placeholder with: <Route path="search" element={<SearchPage />} />
```

- [ ] **Step 4: Commit**

```
git add src/features/search src/App.tsx && git commit -m "feat: 添加搜索结果页与筛选侧边栏"
```

---

### Task 9: 宠物详情页（故事化叙事）

**Files:**
- Create: `src/features/pets/PetDetailPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 PetDetailPage**

Write `src/features/pets/PetDetailPage.tsx`:
```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { usePet } from './usePets'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'
import { Heart, Shield, Stethoscope, MapPin, PawPrint } from 'lucide-react'

const sizeLabel: Record<string, string> = { small: '小型', medium: '中型', large: '大型' }

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pet, isLoading, error, refetch } = usePet(id ? Number(id) : undefined)

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16"><LoadingState rows={1} cols={1} /></div>
  if (error || !pet) return <div className="max-w-4xl mx-auto px-4 py-16"><ErrorState message="该宠物不存在" onRetry={refetch} /></div>

  const nextSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-20">
      {/* 第1部分：认识我 */}
      <motion.section id="meet" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8 items-center">
        <motion.img src={pet.image_url} alt={pet.name}
          className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg"
          whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} />
        <div>
          <p className="text-warm-500 font-medium mb-2">认识我 👋</p>
          <h1 className="text-4xl font-bold text-earth-800 mb-4">{pet.name}</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{pet.species?.icon} {pet.species?.name}</span>
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{pet.breed?.name}</span>
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{pet.age}岁</span>
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{sizeLabel[pet.size]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pet.traits?.map((t) => (
              <span key={t} className="bg-earth-100 text-earth-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <PawPrint className="w-3 h-3" /> {t}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 第2部分：我的故事 */}
      <motion.section id="story" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-warm-500 font-medium mb-2">我的故事 📖</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-4">关于{pet.name}</h2>
        <p className="text-earth-500 leading-relaxed text-lg">{pet.description}</p>
      </motion.section>

      {/* 第3部分：我的健康 */}
      <motion.section id="health" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-warm-500 font-medium mb-2">我的健康 🩺</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-4">健康状况</h2>
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
          <Stethoscope className="w-8 h-8 text-green-500" />
          <div>
            <p className="font-medium text-green-800">健康状态</p>
            <p className="text-green-600">{pet.health_status}</p>
          </div>
        </div>
      </motion.section>

      {/* 第4部分：如何带我回家 */}
      <motion.section id="adopt" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-warm-100 to-warm-50 rounded-3xl p-8 shadow-sm text-center">
        <p className="text-warm-500 font-medium mb-2">如何带我回家 🏡</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-4">领养{pet.name}</h2>
        <div className="flex items-center justify-center gap-2 text-earth-500 mb-6">
          <MapPin className="w-5 h-5" />
          <span>{pet.shelter_info}</span>
        </div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-warm-500 hover:bg-warm-600 text-white text-lg px-10 py-6 rounded-xl"
            onClick={() => navigate(`/adopt/${pet.id}`)}>
            <Heart className="w-5 h-5 mr-2 fill-current" /> 领养它
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
```

- [ ] **Step 2: 更新 App.tsx**

Update `src/App.tsx` pets/:id route:
```tsx
import PetDetailPage from '@/features/pets/PetDetailPage'
// Replace placeholder with: <Route path="pets/:id" element={<PetDetailPage />} />
```

- [ ] **Step 3: Commit**

```
git add src/features/pets/PetDetailPage.tsx src/App.tsx && git commit -m "feat: 添加宠物详情页(故事化叙事布局)"
```

---

### Task 10: 领养申请页

**Files:**
- Create: `src/features/adoption/ApplicationForm.tsx`
- Create: `src/features/adoption/useApplications.ts`
- Create: `src/features/adoption/AdoptPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 useApplications hook**

Write `src/features/adoption/useApplications.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { AdoptionApplication } from '@/types'

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async (): Promise<AdoptionApplication[]> => {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select('*, pet:pet_id(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as AdoptionApplication[]
    },
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (app: { user_id: string; pet_id: number; name: string; phone: string; message: string }) => {
      const { data, error } = await supabase.from('adoption_applications').insert(app).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
```

- [ ] **Step 2: 创建 ApplicationForm**

Write `src/features/adoption/ApplicationForm.tsx`:
```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitApplication } from './useApplications'
import { useAuth } from '@/features/auth/useAuth'
import { useNavigate } from 'react-router-dom'

interface Props { petId: number; petName: string }

export default function ApplicationForm({ petId, petName }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const mutation = useSubmitApplication()

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-earth-500 mb-4">请先登录后提交领养申请</p>
        <Button className="bg-warm-500 hover:bg-warm-600" onClick={() => navigate('/login')}>去登录</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim()) { setError('请填写必填项'); return }
    mutation.mutate(
      { user_id: user.id, pet_id: petId, name, phone, message },
      { onSuccess: () => navigate('/dashboard'), onError: (err) => setError(err.message) }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-earth-700 mb-1">领养申请 — {petName}</h3>
        <p className="text-earth-400 text-sm">填写以下信息，我们将尽快联系你</p>
      </div>
      <div><Label>姓名 *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的真实姓名" required /></div>
      <div><Label>手机号 *</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="方便联系你的号码" required /></div>
      <div><Label>留言</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="告诉我们你为什么想领养它..." rows={4} /></div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={mutation.isPending}>
        {mutation.isPending ? '提交中...' : '提交申请'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: 创建 AdoptPage**

Write `src/features/adoption/AdoptPage.tsx`:
```tsx
import { useParams } from 'react-router-dom'
import { usePet } from '@/features/pets/usePets'
import ApplicationForm from './ApplicationForm'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'

export default function AdoptPage() {
  const { petId } = useParams<{ petId: string }>()
  const { data: pet, isLoading, error } = usePet(petId ? Number(petId) : undefined)

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-16"><LoadingState rows={1} cols={1} /></div>
  if (error || !pet) return <div className="max-w-2xl mx-auto px-4 py-16"><ErrorState message="宠物信息加载失败" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex gap-6 mb-8 p-4 bg-white rounded-2xl shadow-sm">
        <img src={pet.image_url} alt={pet.name} className="w-24 h-24 object-cover rounded-xl" />
        <div>
          <h2 className="font-bold text-lg text-earth-700">{pet.name}</h2>
          <p className="text-earth-400 text-sm">{pet.breed?.name ?? pet.species?.name}</p>
          <p className="text-earth-400 text-sm">{pet.shelter_info}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <ApplicationForm petId={pet.id} petName={pet.name} />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 更新 App.tsx**

Update `src/App.tsx` adopt route:
```tsx
import AdoptPage from '@/features/adoption/AdoptPage'
// Replace placeholder with: <Route path="adopt/:petId" element={<AdoptPage />} />
```

- [ ] **Step 5: Commit**

```
git add src/features/adoption src/App.tsx && git commit -m "feat: 添加领养申请页与表单"
```

---

### Task 11: Dashboard 用户中心

**Files:**
- Create: `src/features/dashboard/ProfileSection.tsx`
- Create: `src/features/dashboard/FavoritesList.tsx`
- Create: `src/features/dashboard/useFavorites.ts`
- Create: `src/features/dashboard/ApplicationsList.tsx`
- Create: `src/features/dashboard/NotificationsPanel.tsx`
- Create: `src/features/dashboard/useNotifications.ts`
- Create: `src/features/dashboard/DashboardPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 创建 useFavorites hook**

Write `src/features/dashboard/useFavorites.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Favorite } from '@/types'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<Favorite[]> => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, pet:pet_id(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Favorite[]
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, petId, isFavorited }: { userId: string; petId: number; isFavorited: boolean }) => {
      if (isFavorited) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('pet_id', petId)
      } else {
        await supabase.from('favorites').insert({ user_id: userId, pet_id: petId })
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['favorites'] }) },
  })
}
```

- [ ] **Step 2: 创建 useNotifications hook**

Write `src/features/dashboard/useNotifications.ts`:
```ts
import { useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUIStore } from '@/store/ui-store'
import type { Notification } from '@/types'

export function useNotifications() {
  const setUnreadCount = useUIStore((s) => s.setUnreadCount)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, application:application_id(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Notification[]
    },
  })

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [queryClient])

  useEffect(() => {
    if (query.data) setUnreadCount(query.data.filter((n) => !n.is_read).length)
  }, [query.data, setUnreadCount])

  return query
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }) },
  })
}
```

Note: `useMutation` needs to be imported from `@tanstack/react-query` in the above file.

- [ ] **Step 3: 创建 ProfileSection**

Write `src/features/dashboard/ProfileSection.tsx`:
```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { Camera } from 'lucide-react'

export default function ProfileSection() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const filePath = `${user.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (error) { setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
    await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    setUploading(false)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">个人信息</h3>
      <div className="flex items-center gap-6">
        <label className="relative cursor-pointer group">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-warm-200 text-warm-600 text-2xl">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
        </label>
        <div>
          <p className="font-medium text-earth-700">{user?.user_metadata?.name ?? '用户'}</p>
          <p className="text-earth-400 text-sm">{user?.email ?? user?.phone}</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 FavoritesList**

Write `src/features/dashboard/FavoritesList.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { useFavorites } from './useFavorites'
import EmptyState from '@/shared/EmptyState'
import LoadingState from '@/shared/LoadingState'
import { Heart } from 'lucide-react'

export default function FavoritesList() {
  const { data: favorites, isLoading } = useFavorites()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">我的收藏</h3>
      {isLoading && <LoadingState rows={1} cols={2} />}
      {favorites?.length === 0 && <EmptyState message="还没有收藏，去发现小动物吧" actionLabel="去看看" actionTo="/search" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites?.map((fav) => (
          <Link key={fav.id} to={`/pets/${fav.pet_id}`}
            className="flex gap-4 p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors">
            <img src={fav.pet?.image_url} alt={fav.pet?.name} className="w-20 h-20 object-cover rounded-lg" />
            <div>
              <p className="font-medium text-earth-700">{fav.pet?.name}</p>
              <p className="text-sm text-earth-400">{fav.pet?.breed?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 ApplicationsList**

Write `src/features/dashboard/ApplicationsList.tsx`:
```tsx
import { useApplications } from '@/features/adoption/useApplications'
import StatusBadge from '@/shared/StatusBadge'
import EmptyState from '@/shared/EmptyState'
import LoadingState from '@/shared/LoadingState'

export default function ApplicationsList() {
  const { data: applications, isLoading } = useApplications()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">领养申请记录</h3>
      {isLoading && <LoadingState rows={1} cols={1} />}
      {applications?.length === 0 && <EmptyState message="还没有领养申请" actionLabel="去发现小动物" actionTo="/search" />}
      <div className="space-y-3">
        {applications?.map((app) => (
          <div key={app.id} className="flex items-center justify-between p-4 bg-warm-50 rounded-xl">
            <div>
              <p className="font-medium text-earth-700">{app.pet?.name}</p>
              <p className="text-sm text-earth-400">{new Date(app.created_at).toLocaleDateString('zh-CN')}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 创建 NotificationsPanel**

Write `src/features/dashboard/NotificationsPanel.tsx`:
```tsx
import { useNotifications, useMarkAsRead } from './useNotifications'
import EmptyState from '@/shared/EmptyState'
import LoadingState from '@/shared/LoadingState'
import { Bell, BellRing } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotificationsPanel() {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkAsRead()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BellRing className="w-5 h-5 text-warm-500" />
        <h3 className="font-bold text-earth-700">通知中心</h3>
      </div>
      {isLoading && <LoadingState rows={1} cols={1} />}
      {notifications?.length === 0 && <EmptyState message="暂无通知" />}
      <div className="space-y-2">
        {notifications?.map((n) => (
          <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${n.is_read ? 'bg-warm-50' : 'bg-warm-100'}`}
            onClick={() => !n.is_read && markAsRead.mutate(n.id)}>
            {n.is_read ? <Bell className="w-4 h-4 text-earth-400" /> : <BellRing className="w-4 h-4 text-warm-500" />}
            <div className="flex-1">
              <p className={`text-sm ${n.is_read ? 'text-earth-400' : 'text-earth-700 font-medium'}`}>{n.message}</p>
              <p className="text-xs text-earth-400">{new Date(n.created_at).toLocaleDateString('zh-CN')}</p>
            </div>
            {!n.is_read && <span className="w-2 h-2 bg-warm-500 rounded-full" />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: 创建 DashboardPage**

Write `src/features/dashboard/DashboardPage.tsx`:
```tsx
import { useAuth } from '@/features/auth/useAuth'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProfileSection from './ProfileSection'
import FavoritesList from './FavoritesList'
import ApplicationsList from './ApplicationsList'
import NotificationsPanel from './NotificationsPanel'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-earth-400">加载中...</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-earth-700">我的账户</motion.h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ProfileSection />
          <FavoritesList />
        </div>
        <div className="space-y-8">
          <NotificationsPanel />
          <ApplicationsList />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: 更新 App.tsx**

Update `src/App.tsx` dashboard route:
```tsx
import DashboardPage from '@/features/dashboard/DashboardPage'
// Replace placeholder with: <Route path="dashboard" element={<DashboardPage />} />
```

- [ ] **Step 9: 确认 useNotifications.ts 中含有所有必需的 import**

验证 `src/features/dashboard/useNotifications.ts` 导入了 `useQuery, useQueryClient, useMutation`。

- [ ] **Step 10: Commit**

```
git add src/features/dashboard src/App.tsx && git commit -m "feat: 添加Dashboard(Profile/Favorites/Applications/Notifications)"
```

---

### Task 12: 集成测试与构建验证

**Files:**
- Create: `src/features/pets/__tests__/PetCard.test.tsx`
- Create: `src/features/pets/__tests__/usePets.test.ts`
- Modify: `tsconfig.json`（确保路径别名正确）

- [ ] **Step 1: 编写 PetCard 渲染测试**

Write `src/features/pets/__tests__/PetCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PetCard from '../PetCard'
import type { Pet } from '@/types'

const mockPet: Pet = {
  id: 1,
  name: 'Buddy',
  age: 2,
  species_id: 1,
  breed_id: 1,
  size: 'large',
  traits: ['温顺', '活泼'],
  image_url: 'https://example.com/dog.jpg',
  health_status: '健康',
  shelter_info: '阳光救助中心',
  description: '一只可爱的金毛',
  is_adopted: false,
  created_at: '2026-01-01',
  species: { id: 1, name: '狗', icon: '🐕' },
  breed: { id: 1, name: '金毛寻回犬', species_id: 1 },
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('PetCard', () => {
  it('渲染宠物名称和年龄', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    expect(screen.getByText('Buddy')).toBeDefined()
    expect(screen.getByText('2岁')).toBeDefined()
  })

  it('渲染品种和体型信息', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    expect(screen.getByText(/金毛寻回犬/)).toBeDefined()
    expect(screen.getByText(/大型/)).toBeDefined()
  })

  it('渲染性格标签', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    expect(screen.getByText('温顺')).toBeDefined()
    expect(screen.getByText('活泼')).toBeDefined()
  })

  it('链接指向正确的宠物详情页', () => {
    renderWithRouter(<PetCard pet={mockPet} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/pets/1')
  })
})
```

- [ ] **Step 2: 编写筛选逻辑测试**

Write `src/features/pets/__tests__/usePets.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

// 纯逻辑测试：宠物筛选条件构建
function buildFilters(filters: {
  species_id?: number
  age_min?: number
  age_max?: number
  size?: string
}) {
  const result: Record<string, unknown> = {}
  if (filters.species_id) result.species_id = filters.species_id
  if (filters.size) result.size = filters.size
  if (filters.age_min !== undefined) result.age_min = filters.age_min
  if (filters.age_max !== undefined) result.age_max = filters.age_max
  return result
}

describe('宠物筛选逻辑', () => {
  it('空筛选条件返回空对象', () => {
    expect(buildFilters({})).toEqual({})
  })

  it('包含物种筛选', () => {
    expect(buildFilters({ species_id: 1 })).toEqual({ species_id: 1 })
  })

  it('包含体型筛选', () => {
    expect(buildFilters({ size: 'small' })).toEqual({ size: 'small' })
  })

  it('包含年龄范围', () => {
    expect(buildFilters({ age_min: 1, age_max: 5 })).toEqual({ age_min: 1, age_max: 5 })
  })

  it('组合多条件', () => {
    expect(buildFilters({ species_id: 2, size: 'medium', age_max: 3 }))
      .toEqual({ species_id: 2, size: 'medium', age_max: 3 })
  })
})
```

- [ ] **Step 3: 配置 Vitest**

Update `vite.config.ts` to include test config:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

Write `src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: 运行测试**

Run: `npx vitest run`
Expected: 所有 6 个测试通过

- [ ] **Step 5: 运行 TypeScript 检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 6: 运行构建**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 7: Commit**

```
git add src/features/pets/__tests__ src/test-setup.ts vite.config.ts && git commit -m "test: 添加PetCard渲染测试与筛选逻辑测试，验证tsc与build"
```

---

### Task 13: 最终调通与 PWA 配置

**Files:**
- Modify: `index.html`（添加 PWA meta 标签）
- Modify: `vite.config.ts`（VitePWA 插件配置）

- [ ] **Step 1: 添加 PWA meta 标签**

Update `index.html` `<head>`:
```html
<meta name="theme-color" content="#FF9C30" />
<link rel="manifest" href="/manifest.json" />
```

Write `public/manifest.json`:
```json
{
  "name": "暖心领养 - 宠物领养平台",
  "short_name": "暖心领养",
  "theme_color": "#FF9C30",
  "background_color": "#FFF8F0",
  "display": "standalone",
  "start_url": "/",
  "icons": []
}
```

- [ ] **Step 2: 最终构建验证**

Run: `npm run build`
Expected: 构建成功，dist/ 目录生成

Run: `npx tsc --noEmit`
Expected: 无 TypeScript 错误

Run: `npx vitest run`
Expected: 全部测试通过

- [ ] **Step 3: Commit**

```
git add index.html public/ vite.config.ts && git commit -m "feat: 添加PWA配置，最终构建验证通过"
```
