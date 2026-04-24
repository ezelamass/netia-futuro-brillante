import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingData {
  // Shared
  fullName: string;
  birthDate: string;
  country: string;
  city: string;
  language: string;
  termsAccepted: boolean;
  dataAuthorization: boolean;

  // Player fields
  mainSport: string;
  level: string;
  laterality: string;
  hasCoach: boolean;
  coachName: string;
  mainGoal: string;
  otherGoal: string;
  trainingDaysPerWeek: number;
  averageDuration: number;
  areasToImprove: string[];
  championModeReminders: boolean;
  trainingDays: string[];
  hasTournaments: boolean;
  tournaments: { name: string; date: string }[];
  importantDates: string[];
  netiaPlansRest: boolean;
  shareCalendar: boolean;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  injuries: string;
  energyLevel: string;
  sleepHours: number;
  physicalPreparation: string;
  usesSmartwatch: boolean;
  smartwatchBrand: string;
  breakfastBeforeTraining: string;
  mealsPerDay: number;
  hydrationLevel: number;
  usesSupplements: boolean;
  supplements: string;
  dietaryRestrictions: string[];
  zahiaMealPlan: boolean;
  motivationLevel: number;
  preCompetitionFeeling: string;
  concentrationHelpers: string[];
  postTrainingRelaxation: boolean;
  romaWeeklyGoals: boolean;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  weeklyReports: boolean;
  selectedAvatar: string;
  avatarNickname: string;
  communicationPreference: string;
  championChallenges: boolean;

  // Parent fields
  parentRelationship: string;
  childrenEmails: string[];
  parentTrainingAlerts: boolean;
  parentMedicalAlerts: boolean;

  // Coach fields
  coachClubName: string;
  coachClubCode: string;
  coachSpecialty: string;
  coachExperienceYears: number;
  coachCertifications: string;
  coachTeamSize: number;
  coachAgeRange: string;
  coachSeasonGoal: string;
  coachReportFrequency: string;
  coachWellnessAlerts: boolean;

  // Admin fields
  adminOrganization: string;
  adminTimezone: string;
  adminEmailNotifications: boolean;
}

const defaultOnboardingData: OnboardingData = {
  fullName: '', birthDate: '', country: '', city: '', language: 'es',
  termsAccepted: false, dataAuthorization: false,
  mainSport: '', level: '', laterality: '', hasCoach: false, coachName: '',
  mainGoal: '', otherGoal: '', trainingDaysPerWeek: 3, averageDuration: 60,
  areasToImprove: [], championModeReminders: true,
  trainingDays: [], hasTournaments: false, tournaments: [], importantDates: [],
  netiaPlansRest: true, shareCalendar: false,
  height: 0, heightUnit: 'cm', weight: 0, weightUnit: 'kg', injuries: '',
  energyLevel: 'medio', sleepHours: 8, physicalPreparation: '',
  usesSmartwatch: false, smartwatchBrand: '',
  breakfastBeforeTraining: '', mealsPerDay: 4, hydrationLevel: 3,
  usesSupplements: false, supplements: '', dietaryRestrictions: [],
  zahiaMealPlan: true, motivationLevel: 3, preCompetitionFeeling: '',
  concentrationHelpers: [], postTrainingRelaxation: true, romaWeeklyGoals: true,
  tutorName: '', tutorEmail: '', tutorPhone: '',
  weeklyReports: true, selectedAvatar: 'tino', avatarNickname: '',
  communicationPreference: 'text', championChallenges: true,
  // Parent
  parentRelationship: '', childrenEmails: [],
  parentTrainingAlerts: true, parentMedicalAlerts: true,
  // Coach
  coachClubName: '', coachClubCode: '', coachSpecialty: '',
  coachExperienceYears: 0, coachCertifications: '',
  coachTeamSize: 0, coachAgeRange: '', coachSeasonGoal: '',
  coachReportFrequency: 'weekly', coachWellnessAlerts: true,
  // Admin
  adminOrganization: '', adminTimezone: 'america_buenos_aires',
  adminEmailNotifications: true,
};

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
  return context;
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [currentStep, setCurrentStep] = useState(1);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load onboarding data from Supabase profile
  useEffect(() => {
    if (!user) {
      // Fallback to localStorage for unauthenticated state
      const saved = localStorage.getItem('netia_onboarding_data');
      if (saved) setData(prev => ({ ...prev, ...JSON.parse(saved) }));
      const step = localStorage.getItem('netia_onboarding_step');
      if (step) setCurrentStep(parseInt(step, 10));
      setHasCompletedOnboarding(localStorage.getItem('netia_onboarding_completed') === 'true');
      setLoaded(true);
      return;
    }

    (async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding, onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        if (profile.onboarding && typeof profile.onboarding === 'object') {
          const ob = profile.onboarding as Record<string, any>;
          setData(prev => ({ ...prev, ...ob }));
          if (ob._currentStep) setCurrentStep(ob._currentStep);
        }
        setHasCompletedOnboarding(profile.onboarding_completed || false);
      }
      setLoaded(true);
    })();
  }, [user]);

  // Save onboarding data to Supabase (debounced via effect)
  const saveToSupabase = useCallback(async (newData: OnboardingData, step: number) => {
    if (!user) {
      localStorage.setItem('netia_onboarding_data', JSON.stringify(newData));
      localStorage.setItem('netia_onboarding_step', step.toString());
      return;
    }

    await supabase
      .from('profiles')
      .update({
        onboarding: { ...newData, _currentStep: step } as any,
      })
      .eq('id', user.id);
  }, [user]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => {
      const next = { ...prev, ...updates };
      saveToSupabase(next, currentStep);
      return next;
    });
  };

  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    if (user) {
      const profileUpdate: Record<string, any> = {
        onboarding_completed: true,
        full_name: data.fullName || user.name,
        city: data.city || null,
        country: data.country || 'Argentina',
      };

      // Role-specific fields
      if (user.role === 'player') {
        // mainSport is validated in Onboarding.tsx step 1 — no silent fallback
        if (data.mainSport) profileUpdate.sport = data.mainSport;
        profileUpdate.date_of_birth = data.birthDate || null;
      } else if (user.role === 'coach' || user.role === 'club_admin') {
        profileUpdate.club_name = data.coachClubName || null;
        if (data.mainSport) profileUpdate.sport = data.mainSport;
      }

      await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);
    } else {
      localStorage.setItem('netia_onboarding_completed', 'true');
    }
  };

  const resetOnboarding = () => {
    setData(defaultOnboardingData);
    setCurrentStep(1);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('netia_onboarding_data');
    localStorage.removeItem('netia_onboarding_step');
    localStorage.removeItem('netia_onboarding_completed');
  };

  return (
    <OnboardingContext.Provider value={{
      data, updateData, currentStep, setCurrentStep,
      hasCompletedOnboarding, completeOnboarding, resetOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};
