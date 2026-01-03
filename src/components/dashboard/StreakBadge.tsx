import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  xp: number;
  onClick?: () => void;
}

export const StreakBadge = ({ streak, xp, onClick }: StreakBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50"
    >
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          "bg-orange-500/10 hover:bg-orange-500/20 transition-colors",
          "text-orange-600"
        )}
      >
        <Flame className="w-4 h-4" />
        <span className="text-sm font-semibold">{streak} días</span>
      </button>
      
      <button
        onClick={onClick}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          "bg-amber-500/10 hover:bg-amber-500/20 transition-colors",
          "text-amber-600"
        )}
      >
        <Star className="w-4 h-4" />
        <span className="text-sm font-semibold">{xp.toLocaleString()} XP</span>
      </button>
    </motion.div>
  );
};
