import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { PersonalDataStep } from '@/components/onboarding/steps/PersonalDataStep';
import { ObjectivesStep } from '@/components/onboarding/steps/ObjectivesStep';
import { CalendarStep } from '@/components/onboarding/steps/CalendarStep';
import { PhysicalProfileStep } from '@/components/onboarding/steps/PhysicalProfileStep';
import { NutritionStep } from '@/components/onboarding/steps/NutritionStep';
import { MentalProfileStep } from '@/components/onboarding/steps/MentalProfileStep';
import { FamilyStep } from '@/components/onboarding/steps/FamilyStep';
import { PersonalizationStep } from '@/components/onboarding/steps/PersonalizationStep';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import netiaLogo from '@/assets/netia-logo.png';

const TOTAL_STEPS = 8;

const OnboardingContent = () => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, data, completeOnboarding } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!data.fullName || !data.birthDate || !data.country || !data.mainSport || !data.level) {
          toast({ title: 'Completá los campos obligatorios', variant: 'destructive' });
          return false;
        }
        return true;
      case 2:
        if (!data.mainGoal) {
          toast({ title: 'Elegí tu meta principal', variant: 'destructive' });
          return false;
        }
        return true;
      case 7:
        if (!data.tutorName || !data.tutorEmail || !data.dataAuthorization || !data.termsAccepted) {
          toast({ title: 'Completá los datos del tutor y aceptá los términos', variant: 'destructive' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCelebration(true);
      setTimeout(() => {
        completeOnboarding();
        navigate('/dashboard');
      }, 3000);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalDataStep />;
      case 2: return <ObjectivesStep />;
      case 3: return <CalendarStep />;
      case 4: return <PhysicalProfileStep />;
      case 5: return <NutritionStep />;
      case 6: return <MentalProfileStep />;
      case 7: return <FamilyStep />;
      case 8: return <PersonalizationStep />;
      default: return null;
    }
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
          <p className="text-muted-foreground">Tu perfil está listo. ¡Vamos a entrenar!</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-center gap-3 border-b border-border/50">
        <img src={netiaLogo} alt="NETIA" className="h-8" />
        <div className="h-6 w-px bg-border/50" />
        <span className="text-sm font-medium text-muted-foreground">Configuración inicial</span>
      </header>

      {/* Progress - with proper spacing */}
      <div className="bg-background/50 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-3xl mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>
      </div>

      {/* Content - with top margin to prevent overlap */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrev} className="flex-1 h-12">
              <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 h-12 gradient-netia text-white border-0">
            {currentStep === TOTAL_STEPS ? '¡Finalizar!' : 'Siguiente'}
            {currentStep < TOTAL_STEPS && <ChevronRight className="w-4 h-4 ml-2" />}
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
