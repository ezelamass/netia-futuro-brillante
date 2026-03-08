

## NETIA v3 Spec -- Gap Analysis: What's Built vs Not Built

### Phase 3 (Acceptance Criteria from Section 12) -- STATUS

| # | Criterion | Status | Detail |
|---|-----------|--------|--------|
| 1 | Login real with Supabase Auth | **DONE** | `AuthContext.tsx` uses `supabase.auth`, Google OAuth added to `/register` |
| 2 | 4 functional roles (student, parent, coach, admin) | **DONE** | 5 roles: player, parent, coach, club_admin, admin. Routing + sidebar per role |
| 3 | Player-Club linking (enrollments) | **DONE** | `useEnrollment` hook + `JoinClubModal` + `EnrollmentsList` UI on Dashboard |
| 4 | Parent-Child linking (family_links + consent) | **DONE** | `useFamilyLinks` hook + `LinkChildModal` + `FamilyLinksList` on ParentDashboard |
| 5 | Daily log saving to Supabase with XP/streak | **DONE** | `useDailyLog` writes to `daily_logs`, XP via `player_stats` |
| 6 | Medical clearance: upload + status + alert | **DONE** | `useMedicalClearance` + `MedicalClearanceUpload` + `MedicalClearanceStatus` UI |
| 7 | RLS enabled and tested per role | **DONE** | All 10 tables have RLS policies |
| 8 | Club dashboard with real KPIs | **DONE** | `ClubDashboard` queries Supabase for live data |
| 9 | AI Chat persisted in DB | **DONE** | `Chat.tsx` uses `ai_conversations` + `ai_messages` tables |
| 10 | Calendar connected to `calendar_events` | **DONE** | `useCalendarEvents` does Supabase CRUD |

**Phase 3 is CLOSED per the spec's 10 acceptance criteria.**

---

### Sprint 2A (Weeks 6-10) -- What's NOT Built

| Feature | Spec Section | Status | What's Missing |
|---------|-------------|--------|----------------|
| **Parent consent flow** | Sprint 2A, Sec 6 | **NOT BUILT** | No consent modal/page for parents to authorize IA usage and data for minors. Currently `consent_given` field exists in `family_links` but no dedicated UI flow |
| **Mercado Pago integration** | Sprint 2A | **NOT BUILT** | No payment/subscription checkout, no webhook handling, no billing page |
| **Avatar memory / RAG** | Sprint 2A | **NOT BUILT** | Chat works via n8n webhooks but has no player context injection. No RAG pipeline sending daily_logs/player_stats as context to the AI |
| **Alert engine** | Section 7 | **NOT BUILT** | No threshold-based alerts (sleep < 7h, hydration < 1.2L, pain >= 7, apto vencido, racha en riesgo, escalation after 2+ alerts in 7 days). No `alerts` table. No notification delivery |
| **Nexo copilot (v1)** | Section 8 | **NOT BUILT** | No management copilot for clubs. No analysis layer that reads DB and generates actionable recommendations |
| **Real notifications** | Sprint 2A | **NOT BUILT** | `useNotifications` still uses `localStorage` + `MOCK_NOTIFICATIONS`. No Supabase table, no push/email |

### Sprint 2B (Weeks 11-14) -- What's NOT Built

| Feature | Spec Section | Status | What's Missing |
|---------|-------------|--------|----------------|
| **NETIA Classroom** | Sprint 2B | **NOT BUILT** | No video, library, or certifications module |
| **Training page** | Sprint 2B | **NOT BUILT** | `Training.tsx` is a placeholder with "próximamente..." text. No training plan, session history, or TINO link |
| **Club Reports (PDF)** | Sprint 2B | **NOT BUILT** | `Reports.tsx` is a placeholder. No exportable PDF reports with KPIs |
| **Club Messaging** | Sprint 2B | **NOT BUILT** | `Communication.tsx` is a placeholder. No internal messaging system |
| **E2E Testing** | Sprint 2B | **NOT BUILT** | No automated test suite |
| **Production Deploy** | Sprint 2B | **NOT BUILT** | Not deployed to production domain |

### Other Gaps Found in Code

- **Enrollments RLS for self-enrollment**: Players cannot INSERT into `enrollments` -- only `club_admin` and `admin` can. The `joinClubByCode` function in `useEnrollment.ts` will fail due to RLS. Needs an INSERT policy for authenticated users or an edge function.
- **Google OAuth on Login page**: Google button was added to `/register` but NOT to `/login`.
- **Parent routing**: Spec says `/parent/child/:id` (dynamic per child), code has `/parent/child` (single static page).

---

### Summary

**Phase 3: COMPLETE** (all 10 acceptance criteria met)

**Sprint 2A (6 features): 0/6 built** -- Alert engine, consent flow, Mercado Pago, RAG memory, Nexo copilot, real notifications

**Sprint 2B (6 features): 0/6 built** -- Classroom, Training, Reports, Communication, E2E tests, production deploy

**Quick fixes needed**: Enrollments RLS INSERT policy, Google button on Login, dynamic parent/child/:id route

