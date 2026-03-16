

# Plan: Migración Completa de Mock Data a Datos Reales

## Estado actual — 5 módulos con mock data

| # | Módulo | Mock file | Consumido por |
|---|--------|-----------|---------------|
| 1 | **Club Roster** | `mockPlayers.ts` | `useRoster.ts` |
| 2 | **Club Training Sessions** | `mockTrainingSessions.ts` | `useTrainingSessions.ts` |
| 3 | **Player Training Plan** | `mockTrainingPlan.ts` | `Training.tsx` + 7 training components |
| 4 | **Player Dashboard** | *(props hardcodeados)* | `Dashboard.tsx` — "Mateo", age 12, etc. |
| 5 | **Admin Analytics** | *(todo generado en memoria)* | `useAnalytics.ts` (293 líneas hardcoded) |
| 6 | **Leaderboard Prizes** | `mockPrizes.ts` | `Leaderboard.tsx`, `PrizeCard`, `PrizeDetailModal` |

> **Nota**: `mockUsers.ts` ya fue migrado en Fase 1 pero el archivo aún existe (puede eliminarse).

---

## Fase 2: Club Roster

### Nueva tabla
```sql
coach_notes (id uuid PK, player_id uuid, coach_id uuid, club_id uuid, content text, created_at timestamptz)
```
RLS: coaches can CRUD own notes for players in their clubs; admins full access.

### Reescribir `useRoster.ts`
- Query `enrollments` WHERE `club_id` IN coach's clubs → get player `user_id`s
- JOIN `profiles` → name, date_of_birth, sport, avatar
- JOIN latest `daily_logs` per player → sleep, hydration, energy, pain
- JOIN `player_stats` → streak, XP
- JOIN `coach_notes` → notes for each player
- Traffic light calculated from real daily_log data
- `addCoachNote` → INSERT into `coach_notes`

### Archivos
- Migración SQL: `coach_notes` table + RLS
- Reescribir `src/hooks/useRoster.ts`
- Eliminar `src/data/mockPlayers.ts`

---

## Fase 3: Club Training Sessions

### Nuevas tablas
```sql
training_sessions (id, club_id, coach_id, group_name, category, sport, type, date, duration_min,
                   rpe_group, warmup_done, cooldown_done, notes, created_at)

session_attendance (id, session_id, player_id, status text ['present','absent','excused'], created_at)
```
RLS: coaches CRUD for their club; players can view sessions they attend; admins full.

### Reescribir `useTrainingSessions.ts`
- CRUD sessions against `training_sessions`
- Attendance against `session_attendance`
- A:C ratio from real session data (last 4 weeks)
- Remove localStorage fallback

### Archivos
- Migración SQL: 2 tablas + RLS
- Reescribir `src/hooks/useTrainingSessions.ts`
- Eliminar `src/data/mockTrainingSessions.ts`

---

## Fase 4: Player Dashboard

### Conectar a datos reales (no requiere tablas nuevas)
- `ProgressWidget`: leer `profiles` (nombre, deporte, edad) + `player_stats` (streak) + compliance de `daily_logs` (últimos 7 días)
- `HealthWidget`: último `daily_logs` del usuario (hydration, sleep, pain)
- `TechniqueWidget` / `PhysicalTrainingWidget` / `EvolutionWidget`: últimos scores de `diagnostic_history` por eje
- `SailingCalendarWidget`: condicionar por deporte o eliminar si no aplica

### Archivos
- Crear `src/hooks/useDashboardData.ts` — hook que agrega datos de profile, daily_logs, player_stats, diagnostic_history
- Modificar `src/pages/Dashboard.tsx` — reemplazar props hardcoded con datos del hook

---

## Fase 5: Admin Analytics

### Reescribir `useAnalytics.ts` (no requiere tablas nuevas)
- **KPIs**: COUNT profiles por status, COUNT daily_logs del día (DAU)
- **User Growth**: COUNT profiles agrupado por created_at (por mes/semana)
- **Role Distribution**: COUNT user_roles agrupado por role
- **Engagement**: COUNT daily_logs por día, COUNT ai_messages por día
- **Feature Usage**: proporción de usuarios con logs, chat, calendar_events en últimos 30 días
- **Health Metrics**: AVG sleep_hours, hydration_liters, pain_level de daily_logs
- **Top Clubs**: COUNT enrollments por club JOIN clubs.name
- **Retention**: usuarios con daily_logs esta semana vs semana anterior

### Archivos
- Reescribir `src/hooks/useAnalytics.ts`

---

## Fase 6: Player Training Plan

### Nuevas tablas
```sql
training_plans (id, user_id, coach_id, cycle_name, sport, category, current_stage text,
                objective text, start_date, end_date, total_weeks int, current_week int, created_at)

training_plan_sessions (id, plan_id, week_number int, day_index int, day_label text,
                        session_type text, title text, exercises jsonb, duration_min int,
                        intensity text, status text, rpe int, notes text, created_at)
```
RLS: users read own plans; coaches CRUD for their players; admins full.

### Reescribir Training page
- Create `src/hooks/useTrainingPlan.ts` — fetch active plan + sessions
- Move type definitions from `mockTrainingPlan.ts` to `src/types/training.ts`
- Update `Training.tsx` + all 7 training components to use hook data
- Compliance calculated from completed vs total sessions

### Archivos
- Migración SQL: 2 tablas + RLS
- Crear `src/hooks/useTrainingPlan.ts`
- Mover tipos a `src/types/training.ts`
- Modificar `src/pages/Training.tsx` y componentes
- Eliminar `src/data/mockTrainingPlan.ts`

---

## Fase 7: Leaderboard Prizes

### Nueva tabla
```sql
prizes (id uuid PK, name text, description text, image_url text, value text,
        sponsor text, details text, is_active boolean DEFAULT true, created_at timestamptz)
```
RLS: anyone authenticated can read; admins can CRUD.

### Archivos
- Migración SQL: `prizes` table + RLS
- Modificar `src/pages/Leaderboard.tsx` — query from `prizes`
- Move `Prize` type to `src/types/prize.ts`
- Update `PrizeCard` and `PrizeDetailModal` imports
- Eliminar `src/data/mockPrizes.ts`

---

## Limpieza final
- Eliminar `src/data/mockUsers.ts` (ya no se usa tras Fase 1)
- Verificar que no queden imports a `@/data/mock*`

## Resumen

| Fase | Tablas nuevas | Hooks a crear/reescribir | Mock files a eliminar |
|------|--------------|------------------------|-----------------------|
| 2. Roster | `coach_notes` | `useRoster` | `mockPlayers.ts` |
| 3. Training Sessions | `training_sessions`, `session_attendance` | `useTrainingSessions` | `mockTrainingSessions.ts` |
| 4. Dashboard | — | `useDashboardData` (nuevo) | — |
| 5. Analytics | — | `useAnalytics` | — |
| 6. Training Plan | `training_plans`, `training_plan_sessions` | `useTrainingPlan` (nuevo) | `mockTrainingPlan.ts` |
| 7. Prizes | `prizes` | — | `mockPrizes.ts` |

**Orden recomendado**: Fase 4 (más rápida, solo conectar hooks existentes) → Fase 2 → Fase 3 → Fase 5 → Fase 6 → Fase 7.

