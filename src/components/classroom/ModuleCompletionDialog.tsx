import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ModuleCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
}

export function ModuleCompletionDialog({ open, onOpenChange, moduleName }: ModuleCompletionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-5xl mb-2"
        >
          🎉
        </motion.div>

        <h2 className="text-xl font-bold">Modulo Completado!</h2>
        <p className="text-sm text-muted-foreground">{moduleName}</p>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-2"
        >
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 text-sm px-4 py-1.5">
            <Trophy className="w-4 h-4 mr-1.5" />
            +100 XP
          </Badge>
        </motion.div>

        <Link to="/classroom" className="mt-2">
          <Button className="w-full">Volver al Aula</Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}
