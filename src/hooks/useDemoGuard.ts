import { useDemo } from '@/contexts/DemoContext';
import { toast } from 'sonner';

export const useDemoGuard = () => {
  const { isDemoMode } = useDemo();

  const guardedAction = <T,>(action: () => T, message?: string): T | undefined => {
    if (isDemoMode) {
      toast.info(message || 'Acción no disponible en modo demo. Registrate para usar la plataforma completa.');
      return undefined;
    }
    return action();
  };

  return { isDemoMode, guardedAction };
};
