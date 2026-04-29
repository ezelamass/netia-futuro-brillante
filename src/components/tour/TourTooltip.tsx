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
  const tooltipHeight = 220; // estimate, used for clamp math only
  const gap = 16;
  const margin = 16;

  // All values are in VIEWPORT coordinates because the tour overlay is
  // rendered with `position: fixed` and we use viewport-relative spotlight
  // coords. No window.scrollY math anywhere here.
  let top = 0;
  let left = 0;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  switch (step.placement) {
    case 'bottom':
      top = spotlight.top + spotlight.height + gap;
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2;
      break;
    case 'top':
      top = spotlight.top - gap - tooltipHeight;
      left = spotlight.left + spotlight.width / 2 - tooltipWidth / 2;
      break;
    case 'left':
      top = spotlight.top + spotlight.height / 2 - tooltipHeight / 2;
      left = spotlight.left - tooltipWidth - gap;
      break;
    case 'right':
      top = spotlight.top + spotlight.height / 2 - tooltipHeight / 2;
      left = spotlight.left + spotlight.width + gap;
      break;
  }

  // Horizontal clamp to viewport
  if (left < margin) left = margin;
  if (left + tooltipWidth > viewportWidth - margin) {
    left = viewportWidth - tooltipWidth - margin;
  }

  // Vertical clamp to viewport (both edges)
  const minTop = margin;
  const maxTop = viewportHeight - tooltipHeight - margin;

  if (top < minTop) {
    // Would be cut off at the top → place below spotlight instead
    top = spotlight.top + spotlight.height + gap;
  }
  if (top > maxTop) {
    // Would be cut off at the bottom → place above spotlight instead
    top = spotlight.top - gap - tooltipHeight;
  }
  // Safety clamp for very tall spotlights where neither side fits
  if (top < minTop) top = minTop;
  if (top > maxTop) top = maxTop;

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute z-[9999] bg-white rounded-2xl shadow-2xl border p-5"
      style={{ top, left, width: tooltipWidth, maxWidth: 'calc(100vw - 32px)' }}
      role="dialog"
      aria-live="polite"
      aria-label={`Paso ${currentStep + 1} de ${totalSteps}: ${step.title}`}
      translate="no"
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
