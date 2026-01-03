import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  overlay?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const LOADING_MESSAGES = [
  'Preparando tu entrenamiento...',
  'Analizando tus datos...',
  'Consultando con TINO...',
  'Cargando información...',
];

export const LoadingSpinner = ({
  size = 'md',
  message,
  overlay = false,
  className,
}: LoadingSpinnerProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      role="status"
      aria-busy="true"
      aria-label={message || 'Cargando...'}
    >
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </motion.div>
  );

  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Hook for cycling through loading messages
export const useLoadingMessage = (isLoading: boolean, interval = 3000) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, interval]);

  return LOADING_MESSAGES[index];
};

// Need to import these for the hook
import { useState, useEffect } from 'react';
