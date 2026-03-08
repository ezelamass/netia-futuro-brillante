

## NETIA - Roadmap: Features Remaining to Build

### Current State Summary

**What exists (frontend only, all mock/localStorage):**
- Auth: Mock with 3 roles (student/coach/admin) -- no `parent` role
- 16 pages, 14 hooks, 54+ components
- Dashboard with health/performance widgets (mock data)
- Onboarding 8-step flow (localStorage)
- Chat IA with TINO/ZAHIA/ROMA via n8n webhooks (sessionStorage)
- Calendar with events (localStorage)
- Profile with Zod validation (localStorage)
- Leaderboard: Fully styled with podium, prizes, countdown (mock data)
- Achievements: Basic page with inline badges, heatmap, weekly stats (localStorage via useDailyLog)
- Daily log system (localStorage)
- Club: Roster, Training Load (mock data)
- Admin: Users, Analytics (mock data)

**What does NOT exist:**
- Supabase tables: **0 tables** -- DB is completely empty
- No `parent` role or parent routes
- No medical clearance module
- No real auth (Supabase Auth)
- No RLS policies
- No `useGamification` hook or gamification types
- No Training page content (placeholder)
- No real-time notifications
- No payment integration
- No Nexo copilot
- No Classroom module

---

### Roadmap

---

#### PHASE 1 -- Supabase Foundation (Weeks 1-2)

**Goal:** Replace all mocks with real infrastructure.

| Task | Detail | Files |
|------|--------|-------|
| **1.1 Create full DB schema** | 10 tables: `profiles`, `clubs`, `enrollments`, `family_links`, `medical_clearances`, `daily_logs`, `player_stats`, `calendar_events`, `ai_conversations`, `ai_messages` | SQL migration |
| **1.2 Migrate Auth to Supabase** | Replace `AuthContext.tsx` mock login with Supabase Auth (email+password). Keep same `useAuth()` interface. Add `parent` as 4th role. | `src/contexts/AuthContext.tsx`, `src/components/RouteGuard.tsx` |
| **1.3 Create `user_roles` table** | Separate roles table per security guidelines. `has_role()` security definer function. | SQL migration |
| **1.4 Enable RLS** | Policies per role: student sees own data, parent sees children (via `family_links`), coach sees club players (via `enrollments`), admin full access. | SQL migration |
| **1.5 Add parent routes** | `/parent/dashboard`, `/parent/child/:id`, `/parent/medical`, `/parent/settings`. New sidebar for parent role. | `src/App.tsx`, new `src/pages/parent/` folder |

---

#### PHASE 2 -- Data Migration & Core Features (Weeks 3-5)

**Goal:** Daily logs, medical clearance, and gamification working with real data.

| Task | Detail |
|------|--------|
| **2.1 Migrate `useDailyLog`** | Replace localStorage with `daily_logs` table. Add `trained` (bool) and `duration_min` fields. Edge Function for XP/streak calculation. |
| **2.2 Migrate onboarding** | Save onboarding data to `profiles.onboarding` (JSONB) instead of localStorage. |
| **2.3 Player-Club enrollment** | Invitation code flow, acceptance, confirmation. `enrollments` table functional. |
| **2.4 Medical clearance module** | Upload certificate to Supabase Storage, `medical_clearances` table with auto-calculated status (valid/expiring_soon/expired), alert in profile and dashboard. |
| **2.5 Create `player_stats`** | Table with XP, streak, level (Bronze/Silver/Gold/Elite). Trigger or Edge Function for calculation. |
| **2.6 Gamification system** | `src/types/gamification.ts`, `src/hooks/useGamification.ts`, 8 components in `src/components/gamification/`, update `/achievements` page, add Dashboard widget. 12 badges across 4 categories. |
| **2.7 Connect calendar** | Migrate `useCalendarEvents` from mock to `calendar_events` in Supabase. |
| **2.8 Persist chat** | Migrate from sessionStorage to `ai_conversations` + `ai_messages` tables. |
| **2.9 Real club dashboard** | Replace placeholder: KPIs from real queries (active players, attendance, expired clearances). |

---

#### PHASE 3 -- Parent Control + Payments + AI (Weeks 6-10)

**Goal:** Parent dashboard functional, payment integration, AI memory.

| Task | Detail |
|------|--------|
| **3.1 Parent dashboard** | `/parent/dashboard`: child activity, wellness traffic light, medical clearances, weekly evolution. Read-only for sports data. |
| **3.2 Parental consent flow** | Modal/page to accept terms, authorize AI use, approve minor's data. |
| **3.3 Mercado Pago integration** | Checkout for club subscription, webhook handling. Edge Function for payment processing. |
| **3.4 Avatar memory (RAG)** | Conversation history + player context for personalized responses from TINO/ZAHIA/ROMA. |
| **3.5 Full gamification** | Leaderboard with real Supabase data, tabs (weekly/monthly/all-time), filters (club/sport/age). |
| **3.6 Real notifications** | Expired clearance, streak at risk, club messages. Replace mock with Supabase + push/email. |
| **3.7 Nexo copilot v1** | Analysis layer reading DB to generate alerts/recommendations for clubs. Conditional logic, not free chat. |

---

#### PHASE 4 -- Classroom + Polish + Deploy (Weeks 11-14)

**Goal:** Complete product, tested, deployed.

| Task | Detail |
|------|--------|
| **4.1 NETIA Classroom** | Live video, class library, certifications. |
| **4.2 Training page** | Functional: daily training plan, history, direct link with TINO. Replace current placeholder. |
| **4.3 Club reports** | Exportable PDF reports with KPIs, alerts, evolution. |
| **4.4 Club→player/parent messaging** | Internal messaging with notifications. |
| **4.5 E2E testing** | Tests with real families, coaches, clubs. Fix blind spots. |
| **4.6 Production deploy** | Vercel + production domain. Start 30-day free hosting/maintenance. |

---

### Priority Order for Immediate Action

The recommended order to start building right now:

1. **DB Schema** -- Create all 10+ tables in Supabase (Phase 1.1)
2. **Supabase Auth** -- Replace mock auth (Phase 1.2-1.3)
3. **RLS Policies** -- Secure data access (Phase 1.4)
4. **Migrate useDailyLog** -- First data migration (Phase 2.1)
5. **Gamification system** -- Types, hook, components, pages (Phase 2.6)
6. **Medical clearance** -- Critical for club pilots (Phase 2.4)

Everything else cascades from having the DB schema and real auth in place.

