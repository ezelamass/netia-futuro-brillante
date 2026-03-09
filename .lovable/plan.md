

# Diagnóstico: Vinculación de hijo falla por RLS en `profiles`

## Problema raíz

En `useFamilyLinks.ts`, `linkChild` hace:

```typescript
const { data: childProfile } = await supabase
  .from('profiles')
  .select('id, full_name')
  .eq('email', childEmail)
  .maybeSingle();
```

Pero las RLS policies de `profiles` solo permiten al padre leer **su propio perfil**. La policy "Parents can view children profiles" requiere que el hijo **ya esté en `family_links`** -- es un problema circular: no puede encontrar al hijo para vincularlo porque aún no está vinculado.

## Solución

Crear una función `SECURITY DEFINER` que busque un perfil por email y devuelva solo `id` + `full_name`, sin pasar por RLS. Luego llamarla desde el hook con `supabase.rpc()`.

### 1. Migración SQL

```sql
CREATE OR REPLACE FUNCTION public.find_profile_by_email(_email text)
RETURNS TABLE(id uuid, full_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE LOWER(p.email) = LOWER(_email)
  LIMIT 1;
$$;
```

### 2. Modificar `useFamilyLinks.ts`

Reemplazar la query directa a `profiles` por `supabase.rpc('find_profile_by_email', { _email: childEmail })`.

### 3. Revisar funcionalidades del rol parent

Verificar que todas las features del parent (dashboard hijo, medical clearances, daily logs view) funcionan correctamente una vez que el link existe -- las RLS policies para `daily_logs`, `medical_clearances`, `player_stats` ya tienen clauses para parents vía `family_links`, así que deberían funcionar una vez resuelto el linking.

## Archivos a modificar
- **Migración SQL**: nueva función `find_profile_by_email`
- **`src/hooks/useFamilyLinks.ts`**: usar `rpc` en vez de query directa

