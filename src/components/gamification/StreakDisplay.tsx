import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  streak: number;
  compact?: boolean;
  className?: string;
}

export const StreakDisplay = ({ streak, compact, className }: StreakDisplayProps) => {
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Flame className={cn('w-4 h-4', isOnFire ? 'text-orange-500' : isHot ? 'text-amber-500' : 'text-muted-foreground')} />
        <span className={cn('text-sm font-bold', isOnFire ? 'text-orange-500' : isHot ? 'text-amber-500' : 'text-muted-foreground')}>
          {streak}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl',
        isOnFire ? 'bg-orange-500/10 border border-orange-500/20' :
        isHot ? 'bg-amber-500/10 border border-amber-500/20' :
        'bg-muted/50',
        className
      )}
    >
      <motion.div
        animate={isHot ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Flame className={cn(
          'w-8 h-8',
          isOnFire ? 'text-orange-500' : isHot ? 'text-amber-500' : 'text-muted-foreground'
        )} />
      </motion.div>
      <div>
        <p className="text-2xl font-bold">{streak}</p>
        <p className="text-xs text-muted-foreground">días de racha</p>
      </div>
    </motion.div>
  );
};
