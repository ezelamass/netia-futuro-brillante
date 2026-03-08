import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamification } from '@/hooks/useGamification';
import { LevelBadge, XPProgressBar, StreakDisplay, BadgeCard } from '@/components/gamification';

interface GamificationWidgetProps {
  delay?: number;
}

export const GamificationWidget = ({ delay = 0 }: GamificationWidgetProps) => {
  const navigate = useNavigate();
  const {
    currentLevel, currentXP, nextLevelXP, levelProgress,
    badgeProgress, unlockedCount, totalBadges, isLoading,
  } = useGamification();

  const recentBadges = badgeProgress.filter(b => b.isUnlocked).slice(0, 6);
  const streak = badgeProgress.find(b => b.id === 'streak-7')?.current ?? 0;

  if (isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/achievements')}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Progreso
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <LevelBadge level={currentLevel} size="sm" />
            <StreakDisplay streak={streak} compact />
          </div>

          <XPProgressBar
            currentXP={currentXP}
            levelProgress={levelProgress}
            currentLevel={currentLevel}
            nextLevelXP={nextLevelXP}
          />

          {recentBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recentBadges.map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} index={i} compact />
              ))}
              {unlockedCount < totalBadges && (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  +{totalBadges - unlockedCount}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
