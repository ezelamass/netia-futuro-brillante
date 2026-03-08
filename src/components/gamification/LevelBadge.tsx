import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LEVEL_CONFIG, type PlayerLevel } from '@/types/gamification';

interface LevelBadgeProps {
  level: PlayerLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-12 h-12 text-2xl',
  lg: 'w-16 h-16 text-3xl',
};

const glowClasses: Record<PlayerLevel, string> = {
  bronze: 'shadow-[0_0_12px_rgba(180,83,9,0.3)]',
  silver: 'shadow-[0_0_12px_rgba(148,163,184,0.4)]',
  gold: 'shadow-[0_0_16px_rgba(234,179,8,0.5)]',
  elite: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
};

const bgClasses: Record<PlayerLevel, string> = {
  bronze: 'bg-gradient-to-br from-amber-700/20 to-amber-900/10 border-amber-700/30',
  silver: 'bg-gradient-to-br from-slate-300/20 to-slate-500/10 border-slate-400/30',
  gold: 'bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border-yellow-500/30',
  elite: 'bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border-cyan-400/30',
};

export const LevelBadge = ({ level, size = 'md', showLabel = true, className }: LevelBadgeProps) => {
  const config = LEVEL_CONFIG[level];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className={cn(
          'rounded-full flex items-center justify-center border',
          sizeClasses[size],
          bgClasses[level],
          glowClasses[level]
        )}
      >
        {config.emoji}
      </motion.div>
      {showLabel && (
        <div>
          <p className={cn('font-bold text-sm', config.color)}>{config.label}</p>
        </div>
      )}
    </div>
  );
};
