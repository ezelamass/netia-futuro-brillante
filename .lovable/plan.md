

# Plan: Migración de Mock Data a Datos Reales (Supabase)

## Auditoría: Estado Actual

### Ya conectado a Supabase (no requiere cambios)
- `useDailyLog` → `daily_logs`
- `useGamification` → `player_stats`, `badges`, `player_badges`
- `useLeaderboard` → `player_stats`, `profiles`
- `useDiagnostic` → tablas `diagnostic_*`
- `useFamilyLinks` / `useMedicalClearance` → `family_links`, `medical_clearances`
- `ClubDashboard` → `enrollments`, `medical_clearances`, `player_stats`
- Chat → `ai_conversations`, `ai_messages`
- Calendario → `calendar_events`

### Todavía usando mock data (requiere migración)

| # | Módulo | Hook/Page | Mock source | Tablas Supabase disponibles |
|---|--------|-----------|-------------|----------------------------|
| 1 | **Admin Users** | `useUsers.ts` | `mockUsers.ts` (85 usuarios fake) | `profiles`, `user_roles`, `enrollments`, `player_stats` |
| 2 | **Admin Analytics** | `useAnalytics.ts` | Todo hardcoded | Agregar de tablas existentes |
| 3 | **Club Roster** | `useRoster.ts` | `mockPlayers.ts` (767 líneas) | `profiles`, `enrollments`, `daily_logs`, `player_stats` |
| 4 | **Club Training Sessions** | `useTrainingSessions.ts` | `mockTrainingSessions.ts` | Necesita nueva tabla `training_sessions` |
| 5 | **Player Dashboard** | `Dashboard.tsx` | Props hardcoded | `profiles`, `daily_logs`, `player_stats`, `diagnostic_history` |
| 6 | **Player Training Plan** | `Training.tsx` | `mockTrainingPlan.ts` | Necesita nueva tabla `training_plans` + `training_plan_sessions` |

---

## Fase 1: Admin Users (prioridad alta)

### Reescribir `useUsers.ts`
- Reemplazar `mockUsers` con queries a Supabase
- `profiles` JOIN `user_roles` → datos de usuario (nombre, email, rol, estado)
- `enrollments` JOIN `clubs` → club asignado
- `player_stats` → métricas del usuario
- Las acciones CRUD pasan a ser operaciones reales:
  - **Crear usuario**: `supabase.auth.admin` no disponible desde el cliente → usar edge function `admin-create-user`
  - **Editar**: UPDATE en `profiles`, cambios de rol en `user_roles`
  - **Desactivar**: UPDATE `profiles.status`
  - **Eliminar**: marcar como inactivo (soft delete)
  - **Reset password**: `supabase.auth.resetPasswordForEmail()`
  - **Cambiar rol**: UPDATE/INSERT en `user_roles`
  - **Asignar club**: INSERT/UPDATE en `enrollments`
- Clubs desde tabla `clubs` en vez de array hardcoded

### Edge Function: `admin-manage-user`
Necesaria para operaciones que requieren `service_role`:
- Crear usuario con `auth.admin.createUser()`
- Eliminar usuario
- Listar usuarios de `auth.users` (para `last_sign_in_at`)

### Archivos a modificar/crear:
- Reescribir `src/hooks/useUsers.ts`
- Crear `supabase/functions/admin-manage-user/index.ts`
- Eliminar `src/data/mockUsers.ts`

---

## Fase 2: Club Roster (prioridad alta)

### Reescribir `useRoster.ts`
- Query: `enrollments` WHERE `club_id` IN (clubs del coach) → get `user_id`s
- JOIN `profiles` → nombre, edad, deporte, categoría
- JOIN `daily_logs` (último registro) → estado actual (sueño, hidratación, energía, dolor)
- JOIN `player_stats` → racha, XP
- Coach notes: necesita nueva tabla `coach_notes`

### Nueva tabla: `coach_notes`
```
coach_notes (id, player_id, coach_id, content, created_at)
```
RLS: coaches pueden CRUD sus propias notas para jugadores de su club.

### Archivos a modificar/crear:
- Reescribir `src/hooks/useRoster.ts`
- Migración SQL: `coach_notes`
- Eliminar `src/data/mockPlayers.ts`

---

## Fase 3: Club Training Sessions (prioridad media)

### Nueva tabla: `training_sessions`
```
training_sessions (
  id, club_id, coach_id, group_name, category, sport, type,
  date, duration, rpe_group, warmup_done, cooldown_done, notes,
  created_at
)
```

### Nueva tabla: `session_attendance`
```
session_attendance (id, session_id, player_id, status)  -- present/absent
```

### Reescribir `useTrainingSessions.ts`
- CRUD de sesiones contra `training_sessions`
- Asistencia contra `session_attendance`
- Cálculos A:C ratio desde datos reales

### Archivos a modificar/crear:
- Reescribir `src/hooks/useTrainingSessions.ts`
- Migración SQL: `training_sessions`, `session_attendance`
- Eliminar `src/data/mockTrainingSessions.ts`

---

## Fase 4: Player Dashboard (prioridad media)

### Conectar `Dashboard.tsx` a datos reales
- `ProgressWidget`: leer `profiles` (nombre, deporte, edad) + `player_stats` (racha) + compliance calculado desde `daily_logs`
- `HealthWidget`: último `daily_logs` del usuario
- `TechniqueWidget` / `PhysicalTrainingWidget` / `EvolutionWidget`: leer últimos scores de `diagnostic_history`
- `SailingCalendarWidget`: eliminar o condicionar por deporte (solo aplica a navegación)

### Archivos a modificar:
- `src/pages/Dashboard.tsx` — reemplazar props hardcodeados con datos de hooks existentes (`useDailyLog`, `useGamification`, `useDiagnostic`)

---

## Fase 5: Admin Analytics (prioridad baja)

### Reescribir `useAnalytics.ts`
Agregar datos desde tablas existentes:
- **KPIs**: COUNT de `profiles` por status, COUNT de `daily_logs` del día (DAU)
- **Crecimiento**: COUNT de `profiles` agrupado por `created_at`
- **Distribución de roles**: COUNT de `user_roles` agrupado por `role`
- **Engagement**: COUNT de `daily_logs` por día, COUNT de `ai_messages` por día
- **Feature usage**: proporción de usuarios que usaron cada feature (logs, chat, calendar)
- **Salud**: AVG de `sleep_hours`, `hydration_liters`, `pain_level` de `daily_logs`
- **Clubs**: COUNT de `enrollments` por club
- **Retención**: calculada comparando usuarios activos semana a semana

### Archivos a modificar:
- Reescribir `src/hooks/useAnalytics.ts`

---

## Fase 6: Player Training Plan (prioridad baja)

### Nuevas tablas:
```
training_plans (
  id, user_id, coach_id, cycle_name, sport, category,
  current_stage, start_date, end_date, objectives, created_at
)

training_plan_sessions (
  id, plan_id, day_index, day_label, session_type, title,
  exercises jsonb, duration, intensity, status, rpe, created_at
)
```

### Reescribir `Training.tsx`
- Leer plan activo del usuario desde `training_plans` + `training_plan_sessions`
- RPE logging persiste en `training_plan_sessions`
- Compliance calculado desde sesiones completadas vs totales

### Archivos a modificar/crear:
- Migración SQL: `training_plans`, `training_plan_sessions`
- Reescribir `src/pages/Training.tsx` y hook
- Eliminar `src/data/mockTrainingPlan.ts`

---

## Resumen de entregables por fase

| Fase | Tablas nuevas | Edge Functions | Hooks a reescribir | Mock files a eliminar |
|------|--------------|----------------|--------------------|-----------------------|
| 1. Admin Users | — | `admin-manage-user` | `useUsers` | `mockUsers.ts` |
| 2. Club Roster | `coach_notes` | — | `useRoster` | `mockPlayers.ts` |
| 3. Club Training | `training_sessions`, `session_attendance` | — | `useTrainingSessions` | `mockTrainingSessions.ts` |
| 4. Player Dashboard | — | — | — (usa hooks existentes) | — |
| 5. Admin Analytics | — | — | `useAnalytics` | — |
| 6. Training Plan | `training_plans`, `training_plan_sessions` | — | nuevo hook | `mockTrainingPlan.ts` |

## Recomendación de orden de implementación

Sugiero implementar **una fase a la vez** para poder testear cada migración. La Fase 1 (Admin Users) es la más crítica porque requiere una edge function y es el módulo que más operaciones CRUD tiene. La Fase 4 (Dashboard) es la más rápida porque solo requiere conectar hooks que ya existen.

