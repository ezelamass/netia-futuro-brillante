import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OnboardingStepProps {
  children: ReactNode;
  className?: string;
}

export const OnboardingStep = ({ children, className }: OnboardingStepProps) => {
  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};
