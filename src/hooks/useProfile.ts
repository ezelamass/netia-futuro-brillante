import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserProfile, profileSchema, DEFAULT_PROFILE } from '@/types/profile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDemoGuard } from '@/hooks/useDemoGuard';

interface UseProfileReturn {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  setIsEditing: (editing: boolean) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  saveProfile: () => Promise<void>;
  updateField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void;
}

/**
 * Maps Supabase profiles row + onboarding JSONB into the UserProfile form shape.
 */
function mapDbToFormProfile(
  dbRow: Record<string, unknown>,
  playerStats?: Record<string, unknown> | null
): Partial<UserProfile> {
  const onboarding = (dbRow.onboarding as Record<string, unknown>) ?? {};

  return {
    fullName: (dbRow.full_name as string) || DEFAULT_PROFILE.fullName,
    birthDate: (dbRow.date_of_birth as string) || DEFAULT_PROFILE.birthDate,
    country: (dbRow.country as string) || DEFAULT_PROFILE.country,
    city: (dbRow.city as string) || DEFAULT_PROFILE.city,
    language: (onboarding.language as 'es' | 'en') || DEFAULT_PROFILE.language,
    avatarUrl: (dbRow.avatar_url as string) || undefined,
    sport: (dbRow.sport as string) || DEFAULT_PROFILE.sport,
    level: (onboarding.level as UserProfile['level']) || DEFAULT_PROFILE.level,
    handedness: (onboarding.handedness as UserProfile['handedness']) || DEFAULT_PROFILE.handedness,
    hasCoach: (onboarding.hasCoach as boolean) ?? DEFAULT_PROFILE.hasCoach,
    coachName: (onboarding.coachName as string) || DEFAULT_PROFILE.coachName,
    trainingDays: (onboarding.trainingDays as string[]) || DEFAULT_PROFILE.trainingDays,
    sessionDuration: (onboarding.sessionDuration as number) || DEFAULT_PROFILE.sessionDuration,
    mainGoal: (onboarding.mainGoal as UserProfile['mainGoal']) || DEFAULT_PROFILE.mainGoal,
    areasToImprove: (onboarding.areasToImprove as string[]) || DEFAULT_PROFILE.areasToImprove,
    championModeReminders: (onboarding.championModeReminders as boolean) ?? DEFAULT_PROFILE.championModeReminders,
    height: (onboarding.height as number) || DEFAULT_PROFILE.height,
    heightUnit: (onboarding.heightUnit as UserProfile['heightUnit']) || DEFAULT_PROFILE.heightUnit,
    weight: (onboarding.weight as number) || DEFAULT_PROFILE.weight,
    weightUnit: (onboarding.weightUnit as UserProfile['weightUnit']) || DEFAULT_PROFILE.weightUnit,
    injuries: (onboarding.injuries as string) || '',
    doesPhysicalPrep: (onboarding.doesPhysicalPrep as UserProfile['doesPhysicalPrep']) || DEFAULT_PROFILE.doesPhysicalPrep,
    hasSmartwatch: (onboarding.hasSmartwatch as boolean) ?? DEFAULT_PROFILE.hasSmartwatch,
    smartwatchType: (onboarding.smartwatchType as string) || '',
    breakfastBeforeTraining: (onboarding.breakfastBeforeTraining as UserProfile['breakfastBeforeTraining']) || DEFAULT_PROFILE.breakfastBeforeTraining,
    mealsPerDay: (onboarding.mealsPerDay as number) || DEFAULT_PROFILE.mealsPerDay,
    dietaryRestrictions: (onboarding.dietaryRestrictions as string[]) || DEFAULT_PROFILE.dietaryRestrictions,
    zahiaPlanActive: (onboarding.zahiaPlanActive as boolean) ?? DEFAULT_PROFILE.zahiaPlanActive,
    preCompetitionFeeling: (onboarding.preCompetitionFeeling as UserProfile['preCompetitionFeeling']) || DEFAULT_PROFILE.preCompetitionFeeling,
    focusTechniques: (onboarding.focusTechniques as string[]) || DEFAULT_PROFILE.focusTechniques,
    relaxationExercises: (onboarding.relaxationExercises as boolean) ?? DEFAULT_PROFILE.relaxationExercises,
    romaGoalsActive: (onboarding.romaGoalsActive as boolean) ?? DEFAULT_PROFILE.romaGoalsActive,
    tutorName: (onboarding.tutorName as string) || DEFAULT_PROFILE.tutorName,
    tutorEmail: (onboarding.tutorEmail as string) || DEFAULT_PROFILE.tutorEmail,
    tutorPhone: (onboarding.tutorPhone as string) || '',
    weeklyReports: (onboarding.weeklyReports as boolean) ?? DEFAULT_PROFILE.weeklyReports,
    preferredAvatar: (onboarding.preferredAvatar as UserProfile['preferredAvatar']) || DEFAULT_PROFILE.preferredAvatar,
    avatarNickname: (onboarding.avatarNickname as string) || '',
    communicationMode: (onboarding.communicationMode as UserProfile['communicationMode']) || DEFAULT_PROFILE.communicationMode,
    championModeChallenges: (onboarding.championModeChallenges as boolean) ?? DEFAULT_PROFILE.championModeChallenges,
    // Stats from player_stats (read-only)
    streak: (playerStats?.current_streak as number) ?? 0,
    totalXP: (playerStats?.xp as number) ?? 0,
    achievementsCount: 0,
    memberSince: (dbRow.created_at as string) || new Date().toISOString(),
  };
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuth();
  const { blockIfDemo } = useDemoGuard();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: DEFAULT_PROFILE,
    mode: 'onChange',
  });

  const { isDirty } = form.formState;

  // Load profile from Supabase on mount
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const [{ data: dbProfile }, { data: stats }] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('player_stats').select('xp, current_streak').eq('user_id', user.id).maybeSingle(),
        ]);

        if (dbProfile) {
          const mapped = mapDbToFormProfile(dbProfile, stats);
          const merged = { ...DEFAULT_PROFILE, ...mapped };
          setProfile(merged);
          form.reset(merged);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, form]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && isEditing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isEditing]);

  const startEditing = useCallback(() => {
    form.reset(profile);
    setIsEditing(true);
  }, [form, profile]);

  const cancelEditing = useCallback(() => {
    form.reset(profile);
    setIsEditing(false);
  }, [form, profile]);

  const saveProfile = useCallback(async () => {
    if (!user?.id) return;
    if (blockIfDemo('Estás en modo demo. Registrate para guardar cambios en tu perfil.')) return;

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Hay errores en el formulario');
      return;
    }

    setIsSaving(true);

    try {
      const values = form.getValues();

      // Separate DB columns from onboarding JSONB fields
      const { fullName, birthDate, country, city, sport, avatarUrl, ...onboardingFields } = values;

      // Remove read-only stats from onboarding data
      const { streak: _s, totalXP: _x, achievementsCount: _a, memberSince: _m, ...cleanOnboarding } = onboardingFields;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          date_of_birth: birthDate || null,
          country,
          city,
          sport,
          avatar_url: avatarUrl || null,
          onboarding: cleanOnboarding,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(values);
      setIsEditing(false);
      toast.success('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  }, [form, user?.id, blockIfDemo]);

  const updateField = useCallback(<K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue(field, value as any, { shouldDirty: true, shouldValidate: true });
  }, [form]);

  return {
    profile,
    form,
    isEditing,
    isDirty,
    isLoading,
    isSaving,
    setIsEditing,
    startEditing,
    cancelEditing,
    saveProfile,
    updateField,
  };
};
