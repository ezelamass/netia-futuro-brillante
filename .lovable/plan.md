

## NETIA -- Status Report: Built vs Pending

### CRITICAL BUILD ERROR

`@supabase/supabase-js` is **not installed** in `package.json`. Both `AuthContext.tsx` and `client.ts` import from it, causing a build failure. This must be fixed first.

---

### Phase 3 Acceptance Criteria (from DOCX Section 12)

The spec defines 10 mandatory items to close Phase 3:

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | Login real with Supabase Auth | **CODE EXISTS, BROKEN** | `AuthContext.tsx` uses Supabase Auth but `@supabase/supabase-js` not in `package.json` -- app won't build |
| 2 | 4 functional roles: student, parent, coach, admin | **BUILT** | Roles defined as `player, parent, coach, club_admin, admin`. Routes and sidebar exist per role. `user_roles` table with RLS in DB |
| 3 | Player-Club linking (enrollments) | **HOOK ONLY** | `useEnrollment.ts` exists with invite code logic. No UI for joining a club or managing enrollments |
| 4 | Parent-Child linking (family_links + consent) | **HOOK ONLY** | `useFamilyLinks.ts` exists. No UI -- parent pages are static placeholders with hardcoded "0" values |
| 5 | Daily log saving to Supabase with XP/streak | **BUILT** | `useDailyLog.ts` reads/writes `daily_logs` table. XP calculation via `player_stats` update on log |
| 6 | Medical clearance: upload + status + alert | **HOOK ONLY** | `useMedicalClearance.ts` exists. No UI for upload or status display anywhere |
| 7 | RLS enabled and tested per role | **BUILT** | All 10 tables have RLS policies per role |
| 8 | Club dashboard with real KPIs | **BUILT** | `ClubDashboard.tsx` queries Supabase for active players, pending enrollments, expired clearances |
| 9 | AI Chat persisted in DB | **BUILT** | `Chat.tsx` loads/saves to `ai_conversations` + `ai_messages` |
| 10 | Calendar connected to `calendar_events` | **BUILT** | `useCalendarEvents.ts` uses Supabase CRUD |

### Additional Spec Items (Sections 7-9)

| Feature | Status |
|---------|--------|
| Gamification (levels, badges, XP, leaderboard) | **BUILT** | Types, hooks, components, widget, achievements page, leaderboard all exist |
| Onboarding persisted to `profiles.onboarding` | **BUILT** | `OnboardingContext.tsx` saves to JSONB field |
| Alert engine (Section 7) | **NOT BUILT** | No sleep/hydration/pain threshold alerts, no escalation logic |
| Nexo copilot (Section 8) | **NOT BUILT** | No management copilot for clubs |
| Parent consent flow (Section Sprint 2) | **NOT BUILT** | No consent modal/page |
| Mercado Pago (Section Sprint 2) | **NOT BUILT** | No payment integration |
| Avatar memory / RAG (Section Sprint 2) | **NOT BUILT** | Chat works but no context/memory |
| Real notifications | **NOT BUILT** | Mock only |
| NETIA Classroom | **NOT BUILT** | No video/library/certifications |
| Training page functional | **NOT BUILT** | Placeholder page |
| Club reports (PDF export) | **NOT BUILT** | Placeholder |
| Club messaging | **NOT BUILT** | Placeholder |

---

### Summary: What needs to happen to close Phase 3

1. **Fix build** -- Install `@supabase/supabase-js` package
2. **Enrollment UI** -- Page/modal for players to enter invite code and join a club
3. **Family linking UI** -- Page for parents to link children by email + consent toggle
4. **Medical clearance UI** -- Upload form + status display in profile and parent dashboard
5. **Connect parent pages to real data** -- Replace placeholder "0" values with actual queries from `family_links`, `daily_logs`, `medical_clearances`

Items 1-5 would close Phase 3 per the spec's acceptance criteria.

### Sprint 2 (not yet started)
- Alert engine, Nexo copilot, Mercado Pago, RAG, notifications, Classroom, Training, Reports, Club messaging, Production deploy

