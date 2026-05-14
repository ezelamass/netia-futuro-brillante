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
   * Demo mode now uses an in-memory mock supabase client (writes never reach
   * the real DB), so writes are safe to run. We keep this hook for backwards
   * compatibility but it always returns false — the mock layer handles
   * everything transparently.
   */
  const blockIfDemo = (_message?: string): boolean => {
    return false;
  };

  /** Legacy wrapper kept for sync callbacks. */
  const guardedAction = <T,>(action: () => T, message?: string): T | undefined => {
    if (blockIfDemo(message)) return undefined;
    return action();
  };

  return { isDemoMode, blockIfDemo, guardedAction };
};
