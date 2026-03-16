
# Plan: RLS Policies para Acceso Parental a Datos de Hijos

## Análisis de Tablas

### Ya tienen política de padres ✓
- `daily_logs` → "Parents can view children logs"
- `medical_clearances` → "Parents can view children clearances"
- `profiles` → "Parents can view children profiles"

### Necesitan política de padres ✗
| Tabla | Justificación |
|-------|---------------|
| `player_stats` | XP, racha, nivel del hijo |
| `player_badges` | Insignias ganadas |
| `diagnostic_history` | Scores del radar diagnóstico |
| `diagnostic_sessions` | Tests completados |
| `enrollments` | Clubs donde está inscripto |
| `calendar_events` | Eventos del hijo |

### NO deben tener acceso parental
- `ai_conversations` / `ai_messages` → Privacidad del chat
- `notifications` → Notificaciones personales

## Migración SQL

```sql
-- player_stats
CREATE POLICY "Parents can view children stats"
  ON public.player_stats FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- player_badges
CREATE POLICY "Parents can view children badges"
  ON public.player_badges FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- diagnostic_history
CREATE POLICY "Parents can view children diagnostic history"
  ON public.diagnostic_history FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- diagnostic_sessions
CREATE POLICY "Parents can view children diagnostic sessions"
  ON public.diagnostic_sessions FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- enrollments
CREATE POLICY "Parents can view children enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- calendar_events
CREATE POLICY "Parents can view children events"
  ON public.calendar_events FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));
```

## Archivos a Modificar
- **Migración SQL**: Nueva migración con 6 políticas RLS

## Resultado
Una vez vinculado un hijo, el padre podrá ver automáticamente:
- Estadísticas y progreso (XP, racha, nivel)
- Insignias ganadas
- Resultados de tests diagnósticos
- Clubs donde está inscripto
- Eventos en el calendario
