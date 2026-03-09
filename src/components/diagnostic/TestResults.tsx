import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { AXIS_CONFIG, type DiagnosticAxis } from '@/types/diagnostic';
import { motion } from 'framer-motion';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

interface TestResultsProps {
  open: boolean;
  onClose: () => void;
  axis: DiagnosticAxis;
  normalizedScore: number;
  testTitle: string;
}

export function TestResults({ open, onClose, axis, normalizedScore, testTitle }: TestResultsProps) {
  const config = AXIS_CONFIG[axis];
  const percentage = normalizedScore * 10;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Test Completado
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center my-4"
        >
          <div className="w-32 h-32">
            <CircularProgressbar
              value={percentage}
              text={`${normalizedScore}`}
              styles={buildStyles({
                textSize: '28px',
                textColor: 'hsl(var(--foreground))',
                pathColor: config.color,
                trailColor: 'hsl(var(--muted))',
              })}
            />
          </div>
        </motion.div>

        <p className="text-sm text-muted-foreground mb-1">{testTitle}</p>
        <p className="text-xs text-muted-foreground">
          {config.icon} {config.label} · Puntuación: <span className="font-bold text-foreground">{normalizedScore}/10</span>
        </p>

        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <RotateCcw className="w-4 h-4 mr-1" /> Volver
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
