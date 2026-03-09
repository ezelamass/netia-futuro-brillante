

# Plan: Role-Specific Onboarding Flows

## Problem
All roles (player, parent, coach, admin) are funneled into the same 8-step player-oriented onboarding (sport selection, nutrition, mental profile, tutor data). Parents, coaches, and admins see irrelevant fields.

## Architecture

Each role gets a tailored step sequence:

```text
Player (8 steps - existing):  PersonalData → Objectives → Calendar → Physical → Nutrition → Mental → Family → Personalization
Parent (4 steps):             ParentProfile → LinkChildren → NotificationPrefs → Terms
Coach  (5 steps):             CoachProfile → ClubSport → TeamSetup → CommunicationPrefs → Personalization
Admin  (3 steps):             AdminProfile → PlatformPrefs → Confirmation
```

## Files to Change

### 1. Update `src/contexts/OnboardingContext.tsx`
- Add parent/coach/admin-specific fields to `OnboardingData` (e.g. `clubName`, `specialty`, `certifications`, `childrenNames`, `platformGoals`)
- Add defaults for the new fields

### 2. Update `src/pages/Onboarding.tsx`
- Read the user's role from `useAuth()`
- Define step configs per role (component + label arrays)
- Replace hardcoded `TOTAL_STEPS = 8` with dynamic count based on role
- Replace hardcoded `renderStep()` switch with role-aware step lookup
- Adjust validation per role/step

### 3. Update `src/components/onboarding/ProgressBar.tsx`
- Accept `stepLabels: string[]` as prop instead of hardcoded 8 labels
- Derive `totalSteps` from the labels array

### 4. Create new step components

**Parent steps** (`src/components/onboarding/steps/`):
- `ParentProfileStep.tsx` -- Name, email, phone, relationship to child
- `LinkChildrenStep.tsx` -- Enter child's name/email or invite code to link accounts
- `ParentNotificationsStep.tsx` -- Weekly reports, alert types, communication channel prefs
- `ParentTermsStep.tsx` -- Data authorization, terms acceptance (reuses FamilyStep logic but from parent perspective)

**Coach steps** (`src/components/onboarding/steps/`):
- `CoachProfileStep.tsx` -- Name, country, city, certifications, experience years
- `ClubSportStep.tsx` -- Club name/code, sport, specialty (e.g. fitness, technique, mental)
- `TeamSetupStep.tsx` -- Team size, age range, training frequency, goals
- `CoachCommunicationStep.tsx` -- Notification prefs, report frequency, preferred tools

**Admin steps** (`src/components/onboarding/steps/`):
- `AdminProfileStep.tsx` -- Name, role confirmation, organization
- `PlatformPrefsStep.tsx` -- Default language, timezone, notification preferences
- `AdminConfirmationStep.tsx` -- Summary + terms acceptance

### 5. Update `src/pages/Register.tsx`
- Line 51: redirect already goes to `/onboarding` -- no change needed (role is already stored in user_roles table on signup)

### 6. Update `src/contexts/OnboardingContext.tsx` > `completeOnboarding()`
- Save role-specific profile fields (e.g. coach saves club_name, parent doesn't save sport)

## Step Details

### Parent Flow
1. **ParentProfile**: Name, phone, country, city, relationship (madre/padre/tutor)
2. **LinkChildren**: Input child email or invite code, preview linked children
3. **Notifications**: Toggle weekly reports, alerts for missed training, medical reminders
4. **Terms**: Data auth + terms acceptance (mandatory)

### Coach Flow  
1. **CoachProfile**: Name, country, city, years of experience, certifications
2. **ClubSport**: Club name (or join by code), sport, coaching specialty
3. **TeamSetup**: Expected team size, age range of players, training days/week, season goals
4. **Communication**: Alert preferences, report frequency, avatar interaction preference
5. **Personalization**: Select preferred avatar + nickname (reuses existing PersonalizationStep)

### Admin Flow
1. **AdminProfile**: Name, organization, confirm admin role
2. **PlatformPrefs**: Default language, timezone, email notification toggles
3. **Confirmation**: Summary of settings + terms acceptance

## Total: 10 new step components + 3 modified files

