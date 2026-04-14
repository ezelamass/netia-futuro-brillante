import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { TourStep } from './tourSteps';

interface TourTooltipProps {
  step: TourStep;
  spotlight: { top: number; left: number; width: number; height: number };
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isLast: boolean;
}

export function TourTooltip({
  step, spotlight, currentStep, totalSteps,
  onNext, onPrev, onSkip, isLast,
}: TourTooltipProps) {
  // Position tooltip relative to spotlight
  const tooltipWidth = 340;
  const gap = 16;

  let top = 0;
  let left = 0;

  const viewportWidth = window.innerWidth;

  switch (step.placement) {
    case 'bottom':
      top = spotlight.top + spotlight.height + gap;
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2;
      break;
    case 'top':
      top = spotlight.top - gap - 200; // approx tooltip height
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2;
      break;
    case 'left':
      top = spotlight.top + spotlight.height / 2 - 100;
      left = spotlight.left - tooltipWidth - gap;
      break;
    case 'right':
      top = spotlight.top + spotlight.height / 2 - 100;
      left = spotlight.left + spotlight.width + gap;
      break;
  }

  // Clamp to viewport
  if (left < 16) left = 16;
  if (left + tooltipWidth > viewportWidth - 16) left = viewportWidth - tooltipWidth - 16;
  if (top < 16) top = spotlight.top + spotlight.height + gap; // fallback to bottom

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed z-[80] bg-white rounded-2xl shadow-2xl border p-5"
      style={{ top, left, width: tooltipWidth, maxWidth: 'calc(100vw - 32px)' }}
    >
      <h3 className="text-lg font-heading font-semibold text-foreground">
        {step.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        {step.description}
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-muted-foreground">
          {currentStep + 1} de {totalSteps}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs h-8">
            Omitir
          </Button>
          {currentStep > 0 && (
            <Button variant="outline" size="sm" onClick={onPrev} className="text-xs h-8">
              Anterior
            </Button>
          )}
          <Button size="sm" onClick={onNext} className="text-xs h-8">
            {isLast ? 'Probar Demo' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
