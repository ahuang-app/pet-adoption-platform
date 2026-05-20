# Role & Objective
You are an Expert Full-Stack TypeScript Developer and UI/UX Specialist. 
Your objective is to build a complete, production-ready "Heartwarming Pet Adoption Platform" MVP. 

# Design & UX Directives
- **Core Prompt:** Build a heartwarming pet adoption platform landing page with motion-driven pet cards, search filters preview, success stories, shelter partnerships, and adoption CTA. Use warm inviting colors.
- **Visuals:** Use warm, empathetic, and inviting color palettes (e.g., soft oranges, warm yellows, gentle earth tones).
- **Interactions:** Implement "motion-driven" animations heavily using Framer Motion (e.g., hover lifts on pet cards, smooth layout transitions, fade-in success stories).

# Tech Stack Constraints
STRICTLY adhere to the following stack. Do not use alternative libraries unless explicitly approved.
- **Framework:** React 19 + TypeScript 5 + Vite (PWA plugin included)
- **Routing:** React Router v7
- **UI & Styling:** Tailwind CSS v4, shadcn/ui (for complex accessible components like Select/Slider), Lucide React (for icons)
- **Animations:** Framer Motion
- **State Management:** Zustand (Global UI state)
- **Data Fetching/Caching:** TanStack React Query
- **Backend/Database:** Supabase (PostgreSQL + Supabase JS Client)
- **Testing:** Vitest + React Testing Library

# Execution Phases & Requirements

## Phase 1: Project Initialization & Setup
1. Initialize a Vite + React + TS project.
2. Install and configure all required dependencies (Tailwind, Framer Motion, React Router, React Query, Zustand, Supabase, shadcn/ui, Vitest).
3. Set up the basic project structure (e.g., `/src/components`, `/src/pages`, `/src/lib/supabase.ts`, `/src/store`, `/src/types`).
4. Read `.env.example` (which you will create) reminding the user to input their `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Phase 2: Database Schema & Mock Data (Supabase)
Since I am starting with a blank Supabase project, you MUST create a standard SQL script file located at `/supabase/seed.sql` that I can run in my Supabase SQL Editor. 
The SQL script must include:
1. **Tables definition:** `pets` (id, name, age, breed, traits, image_url, health_status, shelter_info, is_adopted), `users` (id, name, avatar), `success_stories`.
2. **RLS Policies:** Allow read access to all public data for the MVP.
3. **Mock Data Seeding:** Insert at least 6 diverse pet records, 3 dummy users, and 2 success stories so the UI is immediately populated.
Generate a Supabase client configuration in `/src/lib/supabase.ts`.

## Phase 3: UI/UX & Frontend Development
Develop the responsive web application following the Design Directives:
1. **Hero Section:** Warm greeting, engaging copy, and a clear Adoption CTA.
2. **Search & Filters:** Real-time preview filters using shadcn/ui (filter by species, age, size).
3. **Motion-Driven Pet Cards:** Grid of pets fetched via Supabase + React Query. Cards must have hover physics and image scaling.
4. **Success Stories & Shelter Partnerships:** Sections highlighting past adoptions and shelter logos.
5. **Pet Detail View (Routing):** A dedicated route for individual pet details with a simulated "Adopt/Inquire" button.

## Phase 4: Self-Correction, Testing & Verification
Before declaring the task complete, you MUST execute the following checks automatically:
1. **Type Safety:** Run `npx tsc --noEmit` and fix any TypeScript errors.
2. **Testing:** Write at least 2 basic unit tests using Vitest (e.g., testing the pet filtering logic or rendering of a pet card). Run the tests and ensure they pass.
3. **Build Check:** Run `npm run build` to guarantee Vite builds successfully for Netlify deployment.
4. **Code Quality:** Ensure all components are modular, properly typed, and decoupled from raw data-fetching logic.

# Output Instructions
- **Language Requirement: You MUST communicate with me entirely in Simplified Chinese. All terminal outputs, explanations, and code comments must be in Chinese.**
- Execute these phases step by step. If you encounter missing configuration (like missing environment variables), pause and clearly instruct me in Chinese on what to provide. Do not skip the self-checking phase.