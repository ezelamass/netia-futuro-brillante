import { motion } from 'framer-motion';
import { Flame, Star, Trophy } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface ProfileStatsProps {
  profile: UserProfile;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = [
    {
      icon: Flame,
      value: profile.streak,
      label: 'Racha',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Star,
      value: profile.totalXP >= 1000 ? `${(profile.totalXP / 1000).toFixed(1)}K` : profile.totalXP,
      label: 'XP',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Trophy,
      value: profile.achievementsCount,
      label: 'Logros',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className={`flex flex-col items-center p-4 rounded-xl border border-border/50 ${stat.bgColor}`}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
          <span className={`text-xl font-bold ${stat.color}`}>
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
