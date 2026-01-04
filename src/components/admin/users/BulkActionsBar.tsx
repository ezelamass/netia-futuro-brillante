import { Button } from '@/components/ui/button';
import { X, Lock, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionsBarProps {
  selectedCount: number;
  onDeactivate: () => void;
  onAssignClub: () => void;
  onClear: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onDeactivate,
  onAssignClub,
  onClear,
}: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-card border rounded-full shadow-lg">
            <span className="text-sm font-medium">
              {selectedCount} usuario{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
            <div className="h-4 w-px bg-border" />
            <Button variant="outline" size="sm" onClick={onDeactivate} className="gap-2">
              <Lock className="h-4 w-4" />
              Desactivar
            </Button>
            <Button variant="outline" size="sm" onClick={onAssignClub} className="gap-2">
              <Building2 className="h-4 w-4" />
              Asignar club
            </Button>
            <Button variant="ghost" size="icon" onClick={onClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
