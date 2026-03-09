
# Detailed Bug Report & Implementation Plan

Based on the database logs and codebase analysis, here is a detailed report of the current issues and how we will fix them.

## 1. Bugs and Errors Identified

### A. Infinite Recursion in Row Level Security (RLS) - `HTTP 500 Errors`
**Symptom:** API requests to fetch user profiles, enrollments, and related data are failing with an `HTTP 500 Internal Server Error`.
**Cause:** 
The database logs explicitly state: `infinite recursion detected in policy for relation "enrollments"`. 
Currently, the RLS policy that allows coaches to view club data runs a query against the `enrollments` table:
```sql
club_id IN (SELECT club_id FROM enrollments WHERE user_id = auth.uid())
```
When this policy executes, it queries `enrollments`, which triggers the RLS policy *again*, leading to an infinite loop. This design flaw breaks endpoints for `profiles`, `daily_logs`, `player_stats`, `calendar_events`, `clubs`, and `medical_clearances`.

### B. Unhandled Exceptions on Missing Data (`PGRST116`)
**Symptom:** Some components flash empty states, silent failures occur, or console errors appear when data is simply missing (e.g., checking if a user has a daily log).
**Cause:**
The codebase uses Supabase's `.single()` method extensively. The `.single()` method throws a `PGRST116` error if exactly zero rows are returned. For example, if a parent views a child's profile who hasn't logged anything today, or if we check if a user is already enrolled in a club, the query crashes instead of safely returning `null`.

---

## 2. Implementation Plan

To fix these issues, I will execute a two-step plan:

### Step 1: Fix RLS Infinite Recursion (Database Migration)
I will create secure helper functions that bypass RLS evaluation while preserving strict access control. Then, I will update all affected policies.

1. **Create `SECURITY DEFINER` Functions:**
   - `public.get_user_club_ids(_user_id uuid)`: Securely returns the `club_id`s a user is enrolled in.
   - `public.get_users_in_same_clubs(_user_id uuid)`: Securely returns a list of `user_id`s that share a club with the provided user.
2. **Update RLS Policies (eliminating subqueries):**
   - **`enrollments`**: "Coaches can view club enrollments" → Use `get_user_club_ids`
   - **`profiles`**: "Coaches can view club player profiles" → Use `get_users_in_same_clubs`
   - **`daily_logs`**: "Coaches can view club player logs" → Use `get_users_in_same_clubs`
   - **`calendar_events`**: "Club members can view club events" → Use `get_user_club_ids`
   - **`clubs`**: "Club members can view their club" → Use `get_user_club_ids`
   - **`medical_clearances`**: "Coaches can view club player clearances" → Use `get_users_in_same_clubs`
   - **`player_stats`**: "Coaches can view club player stats" → Use `get_users_in_same_clubs`

### Step 2: Refactor Query Methods (Codebase Updates)
I will replace `.single()` with `.maybeSingle()` across the React application to handle "0 rows returned" gracefully without throwing errors.

- **`src/contexts/AuthContext.tsx`**: Prevent auth failures on profile/role fetch.
- **`src/hooks/useEnrollment.ts`**: Safely check for existing enrollments and clubs.
- **`src/hooks/useFamilyLinks.ts`**: Safely check if child accounts or active links exist.
- **`src/pages/parent/ParentChild.tsx`**: Safely fetch recent daily logs and stats.
- **`src/hooks/useGamification.ts` & `useDailyLog.ts`**: Safely fetch user entries.
- **`src/contexts/OnboardingContext.tsx`**: Safely check onboarding progress.
