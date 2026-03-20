import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { PersonalDataStep } from '@/components/onboarding/steps/PersonalDataStep';
import { ObjectivesStep } from '@/components/onboarding/steps/ObjectivesStep';
import { CalendarStep } from '@/components/onboarding/steps/CalendarStep';
import { PhysicalProfileStep } from '@/components/onboarding/steps/PhysicalProfileStep';
import { NutritionStep } from '@/components/onboarding/steps/NutritionStep';
import { MentalProfileStep } from '@/components/onboarding/steps/MentalProfileStep';
import { FamilyStep } from '@/components/onboarding/steps/FamilyStep';
import { PersonalizationStep } from '@/components/onboarding/steps/PersonalizationStep';
import { ParentProfileStep } from '@/components/onboarding/steps/ParentProfileStep';
import { LinkChildrenStep } from '@/components/onboarding/steps/LinkChildrenStep';
import { ParentNotificationsStep } from '@/components/onboarding/steps/ParentNotificationsStep';
import { ParentTermsStep } from '@/components/onboarding/steps/ParentTermsStep';
import { CoachProfileStep } from '@/components/onboarding/steps/CoachProfileStep';
import { ClubSportStep } from '@/components/onboarding/steps/ClubSportStep';
import { TeamSetupStep } from '@/components/onboarding/steps/TeamSetupStep';
import { CoachCommunicationStep } from '@/components/onboarding/steps/CoachCommunicationStep';
import { AdminProfileStep } from '@/components/onboarding/steps/AdminProfileStep';
import { PlatformPrefsStep } from '@/components/onboarding/steps/PlatformPrefsStep';
import { AdminConfirmationStep } from '@/components/onboarding/steps/AdminConfirmationStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import netiaLogo from '@/assets/netia-logo.png';
import type { ReactNode } from 'react';

interface StepConfig {
  label: string;
  component: ReactNode;
}

const playerSteps: StepConfig[] = [
  { label: 'Datos', component: <PersonalDataStep /> },
  { label: 'Objetivos', component: <ObjectivesStep /> },
  { label: 'Calendario', component: <CalendarStep /> },
  { label: 'Físico', component: <PhysicalProfileStep /> },
  { label: 'Nutrición', component: <NutritionStep /> },
  { label: 'Mental', component: <MentalProfileStep /> },
  { label: 'Familia', component: <FamilyStep /> },
  { label: 'Avatar', component: <PersonalizationStep /> },
];

const parentSteps: StepConfig[] = [
  { label: 'Perfil', component: <ParentProfileStep /> },
  { label: 'Hijos', component: <LinkChildrenStep /> },
  { label: 'Alertas', component: <ParentNotificationsStep /> },
  { label: 'Términos', component: <ParentTermsStep /> },
];

const coachSteps: StepConfig[] = [
  { label: 'Perfil', component: <CoachProfileStep /> },
  { label: 'Club', component: <ClubSportStep /> },
  { label: 'Equipo', component: <TeamSetupStep /> },
  { label: 'Comunicación', component: <CoachCommunicationStep /> },
  { label: 'Avatar', component: <PersonalizationStep /> },
];

const adminSteps: StepConfig[] = [
  { label: 'Perfil', component: <AdminProfileStep /> },
  { label: 'Preferencias', component: <PlatformPrefsStep /> },
  { label: 'Confirmación', component: <AdminConfirmationStep /> },
];

const getStepsForRole = (role: UserRole): StepConfig[] => {
  switch (role) {
    case 'parent': return parentSteps;
    case 'coach': return coachSteps;
    case 'club_admin': return coachSteps; // club_admin uses coach flow
    case 'admin': return adminSteps;
    default: return playerSteps;
  }
};

const getRedirectForRole = (role: UserRole): string => {
  switch (role) {
    case 'parent': return '/parent/dashboard';
    case 'coach':
    case 'club_admin': return '/club/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/dashboard';
  }
};

const OnboardingContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentStep, setCurrentStep, data, completeOnboarding } = useOnboarding();
  // celebration moved to OnboardingResult page

  const role = user?.role ?? 'player';
  const steps = useMemo(() => getStepsForRole(role), [role]);
  const totalSteps = steps.length;
  const stepLabels = useMemo(() => steps.map(s => s.label), [steps]);

  const validateStep = (step: number): boolean => {
    // Player validations
    if (role === 'player') {
      if (step === 1 && (!data.fullName || !data.birthDate || !data.country || !data.mainSport || !data.level)) {
        toast({ title: 'Completá los campos obligatorios', variant: 'destructive' });
        return false;
      }
      if (step === 2 && !data.mainGoal) {
        toast({ title: 'Elegí tu meta principal', variant: 'destructive' });
        return false;
      }
      if (step === 7 && (!data.tutorName || !data.tutorEmail || !data.dataAuthorization || !data.termsAccepted)) {
        toast({ title: 'Completá los datos del tutor y aceptá los términos', variant: 'destructive' });
        return false;
      }
    }

    // Parent validations
    if (role === 'parent') {
      if (step === 1 && (!data.fullName || !data.parentRelationship)) {
        toast({ title: 'Completá tu nombre y relación', variant: 'destructive' });
        return false;
      }
      if (step === 4 && (!data.dataAuthorization || !data.termsAccepted)) {
        toast({ title: 'Aceptá los términos para continuar', variant: 'destructive' });
        return false;
      }
    }

    // Coach validations
    if (role === 'coach' || role === 'club_admin') {
      if (step === 1 && !data.fullName) {
        toast({ title: 'Ingresá tu nombre', variant: 'destructive' });
        return false;
      }
      if (step === 2 && (!data.coachClubName || !data.mainSport)) {
        toast({ title: 'Completá club y deporte', variant: 'destructive' });
        return false;
      }
    }

    // Admin validations
    if (role === 'admin') {
      if (step === 1 && !data.fullName) {
        toast({ title: 'Ingresá tu nombre', variant: 'destructive' });
        return false;
      }
      if (step === 3 && !data.termsAccepted) {
        toast({ title: 'Aceptá los términos para continuar', variant: 'destructive' });
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
      navigate('/onboarding-result');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (showCelebration) {
    return (
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-center"
        >
          <PartyPopper className="w-24 h-24 text-secondary mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">¡Felicitaciones! 🎉</h1>
          <p className="text-muted-foreground">Tu perfil está listo. ¡Vamos!</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <header className="p-4 flex items-center justify-center gap-3 border-b border-border/50">
        <img src={netiaLogo} alt="NETIA" className="h-8" />
        <div className="h-6 w-px bg-border/50" />
        <span className="text-sm font-medium text-muted-foreground">Configuración inicial</span>
      </header>

      <div className="bg-background/50 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-3xl mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} stepLabels={stepLabels} />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>
              {steps[currentStep - 1]?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrev} className="flex-1 h-12">
              <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 h-12 gradient-netia text-white border-0">
            {currentStep === totalSteps ? '¡Finalizar!' : 'Siguiente'}
            {currentStep < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Onboarding = () => (
  <OnboardingProvider>
    <OnboardingContent />
  </OnboardingProvider>
);

export default Onboarding;
