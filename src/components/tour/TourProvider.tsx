import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TOUR_STEPS, type TourStep } from './tourSteps';
import { TourTooltip } from './TourTooltip';

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTour: () => void;
  stopTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
};

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  const step = TOUR_STEPS[currentStep];

  const updateSpotlight = useCallback((step: TourStep) => {
    const el = document.querySelector(step.target);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Delay to let scroll finish
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const pad = 8;
      setSpotlight({
        top: rect.top + window.scrollY - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      });
    }, 400);
  }, []);

  useEffect(() => {
    if (!isActive || !step) return;
    updateSpotlight(step);

    const handleResize = () => updateSpotlight(step);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isActive, currentStep, step, updateSpotlight]);

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
      else if (e.key === 'Escape') stopTour();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsActive(false);
    setSpotlight(null);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      stopTour();
    }
  }, [currentStep, stopTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  }, [currentStep]);

  const overlay = isActive && spotlight ? createPortal(
    <AnimatePresence>
      <motion.div
        key="tour-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70]"
        onClick={stopTour}
      >
        {/* SVG overlay with spotlight cutout */}
        <svg className="absolute inset-0 w-full h-full" style={{ height: document.documentElement.scrollHeight }}>
          <defs>
            <mask id="tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#tour-mask)"
          />
        </svg>

        {/* Tooltip */}
        <div onClick={(e) => e.stopPropagation()}>
          <TourTooltip
            step={step}
            spotlight={spotlight}
            currentStep={currentStep}
            totalSteps={TOUR_STEPS.length}
            onNext={nextStep}
            onPrev={prevStep}
            onSkip={stopTour}
            isLast={currentStep === TOUR_STEPS.length - 1}
          />
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <TourContext.Provider value={{
      isActive,
      currentStep,
      totalSteps: TOUR_STEPS.length,
      startTour,
      stopTour,
      nextStep,
      prevStep,
    }}>
      {children}
      {overlay}
    </TourContext.Provider>
  );
}
