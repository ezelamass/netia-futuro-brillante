# NETIA Futuro Brillante

## Supabase

- **Project ID**: `doeqebxhzctlhizcphkq`
- Supabase is installed as a local CLI dependency. All commands run via:

```bash
npx supabase <command>
```

Examples: `npx supabase db push`, `npx supabase functions deploy`, `npx supabase gen types typescript`.

**IMPORTANT: Do NOT use the Supabase MCP connector. Always use `npx supabase` or direct SQL/client calls.**

---

## Project Overview

NETIA Futuro Brillante is an AI-powered sports training platform targeting young athletes (initially ages 8-16, expanding to all ages). It provides athlete profiling, training recommendations, wellness tracking, gamification, and AI avatar-based interaction. The entire UI is in **Spanish (es-AR)**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3 + TypeScript 5.8 |
| Build | Vite 5.4 (SWC plugin) |
| Backend/DB | Supabase (PostgreSQL + Auth + Edge Functions) |
| Styling | Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives) |
| State | React Context (Auth, Onboarding) + TanStack React Query 5 |
| Forms | React Hook Form + Zod validation |
| Routing | React Router DOM 6 |
| 3D/Avatars | Three.js + React Three Fiber + Drei |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── components/       # Reusable components organized by domain
│   ├── ui/           # shadcn/ui base components (30+)
│   ├── admin/        # Admin panel components
│   ├── avatars/      # 3D avatar scenes & particles
│   ├── chat/         # AI chat interface
│   ├── club/         # Club management
│   ├── dashboard/    # Dashboard widgets
│   ├── diagnostic/   # Diagnostic tests
│   ├── enrollment/   # Club enrollment
│   ├── family/       # Parent features
│   ├── gamification/ # XP, badges, levels
│   ├── landing/      # Landing page
│   ├── leaderboard/  # Rankings
│   ├── medical/      # Medical clearance
│   ├── navigation/   # Sidebar, header, mobile nav
│   ├── onboarding/   # Onboarding wizard steps
│   ├── profile/      # Profile management
│   ├── settings/     # User settings
│   ├── skeletons/    # Loading states
│   └── training/     # Training UI
├── pages/            # Route page components
│   ├── admin/        # Admin pages
│   ├── club/         # Club pages
│   └── parent/       # Parent pages
├── contexts/         # React contexts (AuthContext, OnboardingContext)
├── hooks/            # 23+ custom hooks (useProfile, useDashboardData, etc.)
├── integrations/
│   └── supabase/
│       ├── client.ts # Supabase client init
│       └── types.ts  # Auto-generated DB types
├── types/            # TypeScript type definitions
├── lib/              # Utilities (cn(), recommendation logic)
├── layouts/          # AppLayout, PageTransition
├── data/             # Static/mock data
└── assets/           # Images, icons

supabase/
├── config.toml       # Project config (ID: doeqebxhzctlhizcphkq)
├── migrations/       # 9 SQL migration files
└── functions/        # Edge Functions
    ├── avatar-chat/           # AI avatar conversations
    ├── avatar-rag-upload/     # RAG document ingestion
    ├── whisper-transcribe/    # Speech-to-text
    └── admin-manage-user/     # Admin user management

recursos/             # Strategic planning documents (Word files with transcriptions)
```

---

## Architecture

### Data Flow

```
Supabase DB ↔ Custom Hooks (useX) ↔ React Context (Auth, Onboarding)
  ↔ Pages ↔ Components ↔ shadcn/ui
```

### Authentication

- `AuthContext` wraps the app, listens to Supabase auth state changes
- User roles stored in `user_roles` table, profiles in `profiles` table
- `RouteGuard` component enforces role-based route access
- Sessions persist via localStorage with auto-refresh tokens

### User Roles

| Role | Access |
|------|--------|
| `player` | Dashboard, training, chat, achievements, diagnostics |
| `parent` | Child monitoring, medical clearance |
| `coach` | Roster, training load, reports, communication |
| `club_admin` | Club dashboard + coach features |
| `admin` | System-wide user management, analytics, settings |

---

## Supabase

- **Project ID**: `doeqebxhzctlhizcphkq`
- **Client**: `src/integrations/supabase/client.ts` (env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)
- **Types**: Auto-generated in `src/integrations/supabase/types.ts`
- **Edge Functions**: All 4 have `verify_jwt = false` in config.toml
- **Key tables**: profiles, user_roles, player_stats, daily_logs, diagnostic_history, badges, player_badges, ai_conversations, ai_messages

---

## Key Conventions

- **Language**: All UI text is in Spanish (Argentine dialect)
- **Avatar System**: 3 AI avatars — TINO (training), ZAHIA (nutrition/wellness), ROMA (mental/motivation)
- **Gamification**: XP system with levels (bronze: 0, silver: 500, gold: 2000, elite: 5000), streaks, badges
- **Design System**: NETIA brand colors via CSS variables (Primary: #007BFF, Secondary: #FF6F3C)
- **Fonts**: Inter (body), Poppins (headings), Nunito Sans (AI components)
- **Component pattern**: shadcn/ui base → composed domain components → page components
- **Utility**: `cn()` from `src/lib/utils.ts` for conditional Tailwind classes

---

## Development Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

---

## Deployment

- Deployed on **Vercel** (SPA routing configured in `vercel.json`)
- Environment variables set via Vercel dashboard (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`)
