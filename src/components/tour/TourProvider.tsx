import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
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
  // Viewport-relative coordinates. The overlay is `position: fixed`,
  // so its child SVG/tooltip coordinate system starts at the visible
  // viewport top-left, NOT at the document top.
  top: number;
  left: number;
  width: number;
  height: number;
}

const TOUR_COMPLETED_KEY = 'netia_tour_completed';
const PAD = 8;

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  const step = TOUR_STEPS[currentStep];

  // Compute spotlight rect in VIEWPORT coordinates. We anchor the overlay
  // to the viewport (position: fixed), so document-scroll offsets must NOT
  // be added. Using viewport coords lets the spotlight follow the element
  // visually whether the user is at scrollY=0 or scrollY=5000.
  const computeRect = useCallback((target: string): SpotlightRect | null => {
    const el = document.querySelector(target);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top - PAD,
      left: rect.left - PAD,
      width: rect.width + PAD * 2,
      height: rect.height + PAD * 2,
    };
  }, []);

  // Reposition only — used by scroll/resize listeners. No re-scroll.
  const repositionSpotlight = useCallback(
    (target: string) => {
      const rect = computeRect(target);
      if (rect) setSpotlight(rect);
    },
    [computeRect]
  );

  // Scroll target into view, wait until layout is stable via rAF, then
  // capture the final rect. This avoids the old hardcoded 400ms timeout
  // that misfired on slow devices and long scrolls.
  const scrollAndShow = useCallback(
    (target: string, onMissing: () => void) => {
      const el = document.querySelector(target);
      if (!el) {
        console.warn('[tour] target not found:', target);
        onMissing();
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      let lastTop: number | null = null;
      let stableFrames = 0;
      let safetyCounter = 0;
      const SAFETY_LIMIT = 90; // ~1.5s @60fps fallback

      const tick = () => {
        const rect = el.getBoundingClientRect();
        if (lastTop !== null && Math.abs(rect.top - lastTop) < 0.5) {
          stableFrames += 1;
        } else {
          stableFrames = 0;
        }
        lastTop = rect.top;
        safetyCounter += 1;

        if (stableFrames >= 3 || safetyCounter >= SAFETY_LIMIT) {
          setSpotlight({
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          });
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    []
  );

  // Auto-advance hook: forward declaration for missing targets.
  const onMissingRef = useRef<() => void>(() => {});

  // ---- step change → scroll + show
  useEffect(() => {
    if (!isActive || !step) return;
    scrollAndShow(step.target, onMissingRef.current);
  }, [isActive, currentStep, step, scrollAndShow]);

  // ---- scroll/resize → reposition only (no re-scroll, no jitter)
  useEffect(() => {
    if (!isActive || !step) return;
    const handle = () => repositionSpotlight(step.target);
    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, { passive: true });
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle);
    };
  }, [isActive, step, repositionSpotlight]);

  // ---- lock body scroll while tour is active
  useEffect(() => {
    if (!isActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);

  // ---- imperative API
  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsActive(false);
    setSpotlight(null);
    try {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    } catch {
      /* ignore quota / privacy mode */
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => {
      if (s < TOUR_STEPS.length - 1) return s + 1;
      // last step: stop tour
      setIsActive(false);
      setSpotlight(null);
      try {
        localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      } catch {
        /* ignore */
      }
      return s;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => (s > 0 ? s - 1 : s));
  }, []);

  // If a step has no target rendered, advance automatically (or stop on last).
  useEffect(() => {
    onMissingRef.current = () => {
      setCurrentStep((s) => {
        if (s < TOUR_STEPS.length - 1) return s + 1;
        setIsActive(false);
        setSpotlight(null);
        return s;
      });
    };
  }, []);

  // ---- keyboard navigation (with proper deps to prevent duplicate listeners)
  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
      else if (e.key === 'Escape') stopTour();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, nextStep, prevStep, stopTour]);

  const overlay = isActive && spotlight ? createPortal(
    <AnimatePresence>
      <motion.div
        key="tour-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9990]"
        translate="no"
      >
        {/* SVG covers exactly the viewport. Body scroll is locked while
            the tour is active, so we don't need to span the whole document. */}
        <svg className="absolute inset-0 w-full h-full">
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

        {/* Tooltip — own click stop so buttons work. We intentionally do NOT
            close on overlay click anymore: it was too easy to lose progress
            mid-tour by clicking outside. The Skip button handles dismissal. */}
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
