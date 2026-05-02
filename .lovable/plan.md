# Plan: Fix Demo Role Switching + Add Familia Role

## Problems detected

### 1. Role switching is broken (PC + mobile)

`switchDemoRole` in `DemoContext.tsx` does: `signOut → 100ms wait → signInWithPassword → navigate(dashboard)`.

The issue is a **race condition with `RouteGuard`**:
- `signOut` fires `SIGNED_OUT` → `AuthContext.user` becomes `null` → `RouteGuard` on the current page (e.g. `/admin/dashboard`) sees `!isAuthenticated` and redirects to `/login`.
- `signInWithPassword` completes → `onAuthStateChange` rebuilds the user with the new role → but `buildUser` is async (two DB queries). During that gap, `navigate('/dashboard')` runs against the **old/null** user. RouteGuard then sees a role mismatch (e.g. new role is `player`, page requires `admin`-only or vice-versa) and bounces to `/dashboard`, which itself may not allow that role, causing redirect loops or landing on the wrong screen.
- On mobile this is more visible because dropdown re-opens on top of a half-rendered page.

### 2. Familia (parent) role missing

- `DEMO_ROLES` in `DemoContext.tsx` only has 4 roles: player, coach, club_admin, admin.
- No `demo-padre@netia.app` user exists in the database (verified via SQL).
- The parent UI (`/parent/dashboard`, `/parent/child`, `/parent/medical`) is fully built but unreachable from demo mode.
- Parent needs at least one linked child (via `family_links`) to render anything meaningful — the demo player (`demo-jugador@netia.app`) is the natural target.

---

## Implementation

### A. Create the demo Familia user (SQL migration)

Create `demo-padre@netia.app` (password `netiademo`) via a migration that:
1. Inserts into `auth.users` using `supabase_auth_admin` — actually, since we cannot directly insert into `auth.users` from a migration safely, we will instead use a **one-time SQL block calling `auth.users` insert with encrypted password** (same approach used for the existing demo users — they exist, so the pattern works). If the cleaner path is needed, we use `supabase.auth.admin.createUser` from a temporary Edge Function call. **Preferred: SQL migration mirroring how the other demo accounts were created.**
2. The `handle_new_user` trigger automatically creates `profiles`, `user_roles` (`parent`), and `player_stats` rows. We pass `raw_user_meta_data = {"role": "parent", "full_name": "Familia Demo"}`.
3. Insert a `family_links` row linking `demo-padre` (parent_id) → `demo-jugador` (child_id), with `consent_given = true` and `consent_date = now()`. This unlocks RLS so the parent can read the child's stats, logs, badges, calendar, etc.
4. Mark `profiles.onboarding_completed = true` for the parent so they skip onboarding.

### B. Add Familia to `DEMO_ROLES` (`src/contexts/DemoContext.tsx`)

Add a 5th entry between `player` and `coach`:
```
{
  role: 'parent',
  email: 'demo-padre@netia.app',
  password: 'netiademo',
  dashboard: '/parent/dashboard',
  label: 'Familia',
  icon: Heart,           // or Users — pick one not already used
  description: 'Seguí el bienestar, entrenamientos y apto médico de tu hijo/a',
  gradient: 'from-pink-500/10 to-rose-500/10',
  iconColor: 'text-pink-500',
}
```

This automatically adds Familia to both the picker dialog (`DemoRolePickerDialog`) and the in-banner switcher (`DemoBanner`) since both iterate `DEMO_ROLES`.

### C. Fix the switching race condition (`src/contexts/DemoContext.tsx`)

Rewrite `switchDemoRole` to:
1. **Navigate to a neutral, role-agnostic route first** (e.g. `/`) before signOut, so RouteGuard doesn't bounce while the swap happens. The landing page has no auth requirement.
2. `signOut` → `signInWithPassword`.
3. **Wait for the `AuthContext.user.role` to actually equal the target role** before navigating to the destination dashboard. Implement this via a small helper that polls `supabase.auth.getUser` + `user_roles` query (or, simpler: subscribe once to `onAuthStateChange` inside `switchDemoRole` and resolve when SIGNED_IN fires + role matches). Use a 3s timeout fallback.
4. Then `navigate(account.dashboard)`.

Also apply the same pattern to `demoLogin` (initial entry) for consistency — there, `AuthContext.user` may not be set yet when `navigate` runs, but `RouteGuard` will show the loader and resolve correctly. Lower priority.

Alternative simpler fix (acceptable): in `switchDemoRole`, wrap the swap in a "demo-switching" flag exposed via context, and have `RouteGuard` short-circuit (render the loader) while that flag is true. Pick whichever is less invasive — recommend the **navigate-to-`/` first** approach because it requires no RouteGuard change.

### D. Verify navigation menus already include parent items

Confirmed already present:
- `Sidebar.tsx` → `parentNav` (Panel, Hijo/a, Apto Médico) ✓
- `MobileNav.tsx` → `parentNavItems` ✓
- `Header.tsx` role-based routing ✓

No changes needed there.

---

## Files

| Action | File |
|--------|------|
| Create | `supabase/migrations/<timestamp>_demo_parent_user.sql` — insert demo-padre user + family_link |
| Modify | `src/contexts/DemoContext.tsx` — add `parent` to `DEMO_ROLES`; fix `switchDemoRole` race |

## Verification steps after build

1. From landing → demo picker → pick each of the 5 roles → land on the correct dashboard.
2. From demo banner dropdown → switch player↔admin↔coach↔club_admin↔parent in any order → URL and UI update correctly every time, no redirect loops.
3. As Familia: `/parent/dashboard` shows the linked demo player; `/parent/child` shows their stats; `/parent/medical` loads.
4. Test on mobile viewport (411px) — dropdown closes cleanly and switch completes.
