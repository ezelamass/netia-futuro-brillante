# Fix: Demo no inicia desde mobile

## Diagnóstico

Mirando el screenshot del mobile y el código, el flujo de la demo se rompe por **una condición de carrera entre `LandingPage` y `DemoContext.demoLogin`**. En el screenshot se ve:

- "Familia" muestra el ícono de loading (la llamada arrancó).
- "Entrenador" quedó con outline de focus (el tap se procesó).
- Pero el diálogo nunca se cierra y la pantalla nunca cambia.

### Causa raíz

En `src/pages/LandingPage.tsx` (líneas 25-33):

```ts
useEffect(() => {
  if (isAuthenticated && !isDemoMode) {
    if (tourActive) stopTour();
    navigate('/dashboard');
  }
}, [isAuthenticated, isDemoMode, navigate, tourActive, stopTour]);
```

Y en `DemoContext.demoLogin` (líneas 169-194), el orden es:

1. `supabase.auth.signInWithPassword(...)` → dispara `onAuthStateChange`.
2. `AuthContext` setea `user` → `isAuthenticated` pasa a `true`.
3. **En este momento `isDemoMode` todavía es `false`** porque `setState({ isDemoMode: true })` se ejecuta más tarde.
4. El `useEffect` de `LandingPage` dispara `navigate('/dashboard')` inmediatamente.
5. `LandingPage` se desmonta → el `Dialog` (que vive dentro de `LandingContent`) se desmonta junto con su estado de loading.
6. Recién después, `demoLogin` hace `setState({ isDemoMode: true })` y `navigate(account.dashboard)`, pero como ya hubo una navegación anterior, en mobile la nueva navegación se pierde y para roles que no son `player` (Familia → `/parent/dashboard`, Entrenador → `/club/dashboard`, Admin → `/admin/dashboard`) el usuario ya fue redirigido al lugar equivocado (`/dashboard`).

En desktop a veces funciona porque la animación del Dialog (Radix) y el timing del re-render son distintos; en mobile la pestaña es más lenta y la condición se manifiesta siempre.

Hay un problema adicional: el destino `'/dashboard'` está hard-codeado en LandingPage, lo cual además rompe el login normal de no-jugadores incluso fuera de la demo.

---

## Plan paso a paso

### 1. `src/pages/LandingPage.tsx` — redirección consciente del rol y de la demo

- Importar `useDemo` (ya está) y `useAuth` con `user` (no solo `isAuthenticated`).
- Reemplazar el `useEffect` de redirección por uno que:
  - Espere a que `isLoading` de `AuthContext` sea `false` antes de actuar.
  - Si `isDemoMode` está activo, **no haga nada** (el `DemoContext` se encarga de navegar).
  - Si está autenticado y no en demo, navegue al dashboard correspondiente al rol (`/dashboard` para player, `/parent/dashboard` para parent, `/club/dashboard` para coach/club_admin, `/admin/dashboard` para admin) en vez de siempre `/dashboard`.

Esto elimina la carrera: durante la transición de demo, LandingPage ya no fuerza una navegación intermedia.

### 2. `src/contexts/DemoContext.tsx` — marcar demo ANTES de que auth cambie

Como salvaguarda extra (por si en el futuro otra página agrega un useEffect parecido):

- En `demoLogin` y `switchDemoRole`, llamar `setState({ isDemoMode: true, demoRole: role })` **antes** de `signInWithPassword`. Si el login falla, revertir con `setState({ isDemoMode: false, demoRole: null })` en el `catch`.
- Así, en el instante en que `onAuthStateChange` dispare y cualquier componente vea `isAuthenticated = true`, también verá `isDemoMode = true` y respetará la lógica de demo.

### 3. `src/components/demo/DemoRolePickerDialog.tsx` — cerrar el diálogo apenas arranca el login

Hoy el diálogo se cierra dentro del `try` después de que `demoLogin` resuelve, lo que en mobile se siente colgado y mantiene el spinner visible varios segundos sobre un fondo que ya está navegando.

- Cerrar el diálogo (`onOpenChange(false)`) inmediatamente después de setear `loadingRole`, antes de `await demoLogin(...)`.
- Mostrar el estado "Abriendo demo..." con un `toast.loading` (sonner) y descartarlo en éxito o error con `toast.success` / `toast.error`.
- Mantener `loadingRole` para deshabilitar más toques mientras el diálogo se anima cerrando.

### 4. Verificación manual

- Mobile (411×751): abrir el modal de demo, tocar **Jugador**, **Familia**, **Entrenador**, **Admin de Club** y **Administrador** uno por uno desde el landing. Cada uno debe cerrar el diálogo, mostrar el toast y aterrizar en el dashboard correcto sin rebote a `/dashboard` ni a `/login`.
- Desktop: confirmar que sigue funcionando igual.
- Banner de demo: alternar de rol entre `Familia` ↔ `Entrenador` ↔ `Admin` desde el dropdown del banner para confirmar que el fix de carrera no rompió `switchDemoRole`.

## Archivos a modificar

| Acción | Archivo |
|--------|---------|
| Modificar | `src/pages/LandingPage.tsx` (redirección por rol + respetar `isDemoMode`) |
| Modificar | `src/contexts/DemoContext.tsx` (set `isDemoMode` antes del login, revert on error) |
| Modificar | `src/components/demo/DemoRolePickerDialog.tsx` (cerrar diálogo temprano + toasts) |
