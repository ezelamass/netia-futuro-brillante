import { motion } from 'framer-motion';
import { Crown, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface PodiumCardProps {
  rank: 1 | 2 | 3;
  player: { name: string; points: number; streak: number };
  delay?: number;
}

const rankConfig = {
  1: {
    icon: Crown,
    gradient: 'from-yellow-400 via-yellow-500 to-amber-600',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.5)]',
    ringColor: 'ring-yellow-400',
    avatarSize: 'w-20 h-20',
    height: 'h-44',
    labelBg: 'bg-yellow-500',
  },
  2: {
    icon: Medal,
    gradient: 'from-slate-300 via-slate-400 to-slate-500',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.4)]',
    ringColor: 'ring-slate-400',
    avatarSize: 'w-16 h-16',
    height: 'h-36',
    labelBg: 'bg-slate-400',
  },
  3: {
    icon: Award,
    gradient: 'from-amber-600 via-amber-700 to-amber-800',
    glow: 'shadow-[0_0_20px_rgba(180,83,9,0.4)]',
    ringColor: 'ring-amber-600',
    avatarSize: 'w-14 h-14',
    height: 'h-28',
    labelBg: 'bg-amber-600',
  },
};

export const PodiumCard = ({ rank, player, delay = 0 }: PodiumCardProps) => {
  const config = rankConfig[rank];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', bounce: 0.3 }}
      className="flex flex-col items-center"
    >
      {/* Avatar with Icon */}
      <div className="relative mb-3">
        {/* Floating Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.3, duration: 0.5, type: 'spring' }}
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 z-10',
            'p-1.5 rounded-full',
            `bg-gradient-to-br ${config.gradient}`,
            config.glow
          )}
        >
          <Icon className="w-4 h-4 text-white" />
        </motion.div>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            config.avatarSize,
            'rounded-full ring-4',
            config.ringColor,
            rank === 1 && config.glow
          )}
        >
          <Avatar className={cn(config.avatarSize, 'border-2 border-white')}>
            <AvatarFallback
              className={cn(
                'text-white font-bold',
                `bg-gradient-to-br ${config.gradient}`,
                rank === 1 ? 'text-xl' : rank === 2 ? 'text-lg' : 'text-base'
              )}
            >
              {player.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </div>

      {/* Player Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
        className="text-center mb-2"
      >
        <p className={cn(
          'font-semibold truncate max-w-24',
          rank === 1 ? 'text-base' : 'text-sm'
        )}>
          {player.name.split(' ')[0]}
        </p>
        <p className="text-xs text-muted-foreground">
          {player.streak}🔥
        </p>
      </motion.div>

      {/* Podium Block */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.4 }}
        style={{ originY: 1 }}
        className={cn(
          'w-full rounded-t-2xl flex flex-col items-center justify-start pt-3',
          `bg-gradient-to-b ${config.gradient}`,
          config.height,
          rank === 1 && 'min-w-24'
        )}
      >
        <span className={cn(
          'text-white font-bold rounded-full w-8 h-8 flex items-center justify-center',
          'bg-white/20 backdrop-blur-sm'
        )}>
          {rank}
        </span>
        <p className="text-white font-bold text-lg mt-2">{player.points.toLocaleString()}</p>
        <p className="text-white/80 text-xs">pts</p>
      </motion.div>
    </motion.div>
  );
};
