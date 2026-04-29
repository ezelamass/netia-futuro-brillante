import { useDemo } from '@/contexts/DemoContext';
import { toast } from 'sonner';

const DEFAULT_MESSAGE =
  'Estás en modo demo. Registrate para guardar tu progreso de verdad.';

/**
 * Guards write operations from running while the user is in demo mode.
 *
 * Two ergonomic patterns:
 *
 *   1. Early-return guard inside an async function:
 *      const { blockIfDemo } = useDemoGuard();
 *      const handleSave = async () => {
 *        if (blockIfDemo('No podés guardar logs en demo.')) return;
 *        await supabase.from('daily_logs').insert(...);
 *      };
 *
 *   2. Wrapper for sync callbacks (legacy):
 *      const { guardedAction } = useDemoGuard();
 *      const onClick = () => guardedAction(() => doThing());
 */
export const useDemoGuard = () => {
  const { isDemoMode } = useDemo();

  /**
   * Returns `true` if the action should be blocked (and shows a toast).
   * Returns `false` if the caller should proceed.
   */
  const blockIfDemo = (message?: string): boolean => {
    if (!isDemoMode) return false;
    toast.info(message || DEFAULT_MESSAGE);
    return true;
  };

  /** Legacy wrapper kept for sync callbacks. */
  const guardedAction = <T,>(action: () => T, message?: string): T | undefined => {
    if (blockIfDemo(message)) return undefined;
    return action();
  };

  return { isDemoMode, blockIfDemo, guardedAction };
};
