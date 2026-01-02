import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface OnboardingData {
  // Section 1: Personal Data
  fullName: string;
  birthDate: string;
  country: string;
  city: string;
  language: string;
  mainSport: string;
  level: string;
  laterality: string;
  hasCoach: boolean;
  coachName: string;
  
  // Section 2: Objectives
  mainGoal: string;
  otherGoal: string;
  trainingDaysPerWeek: number;
  averageDuration: number;
  areasToImprove: string[];
  championModeReminders: boolean;
  
  // Section 3: Calendar
  trainingDays: string[];
  hasTournaments: boolean;
  tournaments: { name: string; date: string }[];
  importantDates: string[];
  netiaPlansRest: boolean;
  shareCalendar: boolean;
  
  // Section 4: Physical Profile
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
  
  // Section 5: Nutrition
  breakfastBeforeTraining: string;
  mealsPerDay: number;
  hydrationLevel: number;
  usesSupplements: boolean;
  supplements: string;
  dietaryRestrictions: string[];
  zahiaMealPlan: boolean;
  
  // Section 6: Mental Profile
  motivationLevel: number;
  preCompetitionFeeling: string;
  concentrationHelpers: string[];
  postTrainingRelaxation: boolean;
  romaWeeklyGoals: boolean;
  
  // Section 7: Family
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  weeklyReports: boolean;
  dataAuthorization: boolean;
  termsAccepted: boolean;
  
  // Section 8: Personalization
  selectedAvatar: string;
  avatarNickname: string;
  communicationPreference: string;
  championChallenges: boolean;
}

const defaultOnboardingData: OnboardingData = {
  fullName: '',
  birthDate: '',
  country: '',
  city: '',
  language: 'es',
  mainSport: '',
  level: '',
  laterality: '',
  hasCoach: false,
  coachName: '',
  mainGoal: '',
  otherGoal: '',
  trainingDaysPerWeek: 3,
  averageDuration: 60,
  areasToImprove: [],
  championModeReminders: true,
  trainingDays: [],
  hasTournaments: false,
  tournaments: [],
  importantDates: [],
  netiaPlansRest: true,
  shareCalendar: false,
  height: 0,
  heightUnit: 'cm',
  weight: 0,
  weightUnit: 'kg',
  injuries: '',
  energyLevel: 'medio',
  sleepHours: 8,
  physicalPreparation: '',
  usesSmartwatch: false,
  smartwatchBrand: '',
  breakfastBeforeTraining: '',
  mealsPerDay: 4,
  hydrationLevel: 3,
  usesSupplements: false,
  supplements: '',
  dietaryRestrictions: [],
  zahiaMealPlan: true,
  motivationLevel: 3,
  preCompetitionFeeling: '',
  concentrationHelpers: [],
  postTrainingRelaxation: true,
  romaWeeklyGoals: true,
  tutorName: '',
  tutorEmail: '',
  tutorPhone: '',
  weeklyReports: true,
  dataAuthorization: false,
  termsAccepted: false,
  selectedAvatar: 'tino',
  avatarNickname: '',
  communicationPreference: 'text',
  championChallenges: true,
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
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem('netia_onboarding_data');
    return saved ? { ...defaultOnboardingData, ...JSON.parse(saved) } : defaultOnboardingData;
  });
  
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('netia_onboarding_step');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('netia_onboarding_completed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('netia_onboarding_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('netia_onboarding_step', currentStep.toString());
  }, [currentStep]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('netia_onboarding_completed', 'true');
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
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
