

# Plan: Post-Onboarding Result Screen + Avatar Activation + Dashboard Avatar Widget

## Overview

Three changes to transform NETIA from "smart form" to "product that returns value":
1. **OnboardingResult page** — shows personalized analysis after onboarding
2. **Avatar activation** — selected avatar delivers the result message, other two introduce themselves
3. **Dashboard AvatarMessageWidget** — daily message from the user's avatar

---

## Step 1: OnboardingResult Page

### New file: `src/pages/OnboardingResult.tsx`

A full-screen page that reads from `OnboardingContext` and displays:

**For players:**
- Detected level badge (from `data.level`: "principiante" / "intermedio" / "avanzado" / "competitivo")
- Main goal acknowledged (from `data.mainGoal`)
- Areas to improve (from `data.areasToImprove`)
- A personalized recommendation based on simple rules:

```text
Rules engine (no AI needed):
- level + mainGoal + areasToImprove → recommendation text
- E.g. level=principiante + goal=mejorar_tecnica → "Te recomendamos empezar con 30 min de técnica básica"
- E.g. level=competitivo + goal=ganar_torneos → "Enfocate en resistencia mental y simulación de partidos"
```

- The selected avatar (`data.selectedAvatar`) delivers the main message using `AvatarGuide`
- The other two avatars each show a short intro message (staggered animation):
  - TINO: "Soy Tino, tu entrenador físico. Voy a ayudarte a mejorar tu rendimiento."
  - ZAHIA: "Soy Zahia, tu guía de nutrición. Juntas vamos a cuidar tu alimentación."
  - ROMA: "Soy Roma, tu entrenadora mental. Te acompaño a fortalecer tu mente."

**For parents:** Simplified — "Perfil creado. Ya podés ver el progreso de tus hijos."
**For coaches:** "Tu equipo está configurado. Empezá a registrar sesiones."
**For admins:** "Plataforma lista. Accedé al panel de administración."

**Layout:**
- Gradient background matching the selected avatar's color
- Confetti/celebration animation (reuse existing `PartyPopper` pattern)
- CTA button: "Ir a mi Dashboard" → redirects to role-specific dashboard

### Changes to `src/pages/Onboarding.tsx`

- In `handleNext` when `currentStep === totalSteps`: instead of showing celebration + navigating directly to dashboard, navigate to `/onboarding-result`
- Remove the `showCelebration` state and celebration screen (moved to OnboardingResult)
- The `OnboardingProvider` wraps the result page too (via route nesting or by reading from Supabase `profiles.onboarding` JSON)

**Key issue**: `OnboardingContext` is scoped inside `<OnboardingProvider>` which wraps only `<OnboardingContent />`. The result page is a separate route.

**Solution**: In `completeOnboarding()`, the data is already saved to `profiles.onboarding` JSON in Supabase. The result page will read from `profiles.onboarding` + `profiles.onboarding_completed` directly via a Supabase query, not from context. This is more robust since the user could refresh the page.

### Changes to `src/App.tsx`

- Add route: `<Route path="/onboarding-result" element={<RouteGuard allowedRoles={['player','parent','coach','club_admin','admin']}><OnboardingResult /></RouteGuard>} />`
- Import `OnboardingResult` from `./pages/OnboardingResult`

---

## Step 2: Recommendation Rules Engine

### New file: `src/lib/onboarding-recommendations.ts`

Pure function, no dependencies:

```typescript
interface RecommendationInput {
  role: string;
  level: string;
  mainGoal: string;
  mainSport: string;
  areasToImprove: string[];
  selectedAvatar: string;
  fullName: string;
  trainingDaysPerWeek: number;
}

interface Recommendation {
  levelLabel: string;        // "Nivel Principiante"
  levelEmoji: string;        // "🌱"
  objectiveSuggestion: string; // "Trabajar consistencia y técnica básica"
  trainingTip: string;       // "Hoy podrías hacer 30 min de técnica en cancha"
  avatarMessage: string;     // Full personalized message from selected avatar
}
```

Mapping tables:
- **Level → label/emoji**: principiante→🌱, intermedio→⚡, avanzado→🔥, competitivo→🏆
- **Goal + Level → objective**: matrix of ~8 combinations
- **Sport + areasToImprove → training tip**: basic suggestions per sport/area
- **Avatar message**: template string combining name + level + goal + tip

---

## Step 3: Dashboard AvatarMessageWidget

### New file: `src/components/dashboard/AvatarMessageWidget.tsx`

A card at the top of the dashboard (below TodayCard) that shows the user's selected avatar with a daily contextual message.

**Data source**: Reads from `profiles.onboarding` JSON to get `selectedAvatar`, then combines with `useDashboardData` to generate a contextual message:

```text
Rules:
- No daily log today → "¡Todavía no registraste tu día! Hacelo ahora para mantener tu racha."
- Streak > 7 → "¡{streak} días seguidos! Seguí así, campeón."
- Low energy (from latest log) → "Parece que tu energía está baja. Descansá bien hoy."
- Default → rotating motivational messages based on day of week
```

**UI**: Reuses `AvatarGuide` component inside a subtle card with a dismiss/collapse option (localStorage flag for the day).

### Changes to `src/pages/Dashboard.tsx`

- Import and add `<AvatarMessageWidget />` between TodayCard and Club Enrollment sections
- Pass relevant data from `useDashboardData` (or let the widget fetch its own data)

### Changes to `src/hooks/useDashboardData.ts`

- Add `selectedAvatar` to the profile fetch (read from `profiles.onboarding` → `selectedAvatar`)
- Expose it in the return type so Dashboard can pass it to the widget

---

## Files Summary

| Action | File |
|--------|------|
| Create | `src/pages/OnboardingResult.tsx` |
| Create | `src/lib/onboarding-recommendations.ts` |
| Create | `src/components/dashboard/AvatarMessageWidget.tsx` |
| Modify | `src/pages/Onboarding.tsx` — redirect to `/onboarding-result` instead of dashboard |
| Modify | `src/App.tsx` — add `/onboarding-result` route |
| Modify | `src/pages/Dashboard.tsx` — add AvatarMessageWidget |
| Modify | `src/hooks/useDashboardData.ts` — expose selectedAvatar from onboarding JSON |

No database migrations needed. All data already exists in `profiles.onboarding` JSON and `profiles.onboarding_completed`.

