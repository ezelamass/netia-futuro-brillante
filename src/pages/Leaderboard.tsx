import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Sparkles, Clock, Gift, TrendingUp, Target } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/skeletons';
import { useNavigate } from 'react-router-dom';
import { PodiumCard, PrizeCard, PrizeDetailModal } from '@/components/leaderboard';
import { mockPrizes, getTimeRemaining, type Prize } from '@/data/mockPrizes';
import confetti from 'canvas-confetti';

// Mock data - in real app this would come from API
const leaderboardData = [
  { rank: 1, name: 'Mateo García', points: 2450, streak: 15 },
  { rank: 2, name: 'Sofia Martínez', points: 2380, streak: 12 },
  { rank: 3, name: 'Lucas Rodríguez', points: 2290, streak: 10 },
  { rank: 4, name: 'Emma López', points: 2150, streak: 8 },
  { rank: 5, name: 'Diego Fernández', points: 2050, streak: 7 },
  { rank: 6, name: 'Valentina Torres', points: 1980, streak: 6 },
  { rank: 7, name: 'Nicolás Ruiz', points: 1920, streak: 5 },
];

// Simulated current user data
const currentUser = { rank: 4, name: 'Emma López', points: 2150, streak: 8 };

const Leaderboard = () => {
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const [hasEnoughUsers] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  const [selectedPrize, setSelectedPrize] = useState<{ prize: Prize; position: 1 | 2 | 3 } | null>(null);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger confetti for top 3 users
  useEffect(() => {
    if (currentUser.rank <= 3 && !hasTriggeredConfetti) {
      setHasTriggeredConfetti(true);
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.3 },
          colors: ['#007BFF', '#FF6F3C', '#FFD700'],
        });
      }, 800);
    }
  }, [hasTriggeredConfetti]);

  const top3 = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);
  const pointsToTop3 = currentUser.rank > 3 
    ? leaderboardData[2].points - currentUser.points + 1 
    : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl gradient-netia p-6 md:p-8"
        >
          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4"
          >
            <Sparkles className="w-6 h-6 text-white/60" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 right-12"
          >
            <Sparkles className="w-4 h-4 text-white/40" />
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-2"
              >
                <Trophy className="w-7 h-7 text-white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Clasificación Semanal</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 text-sm md:text-base"
              >
                Compite y gana premios exclusivos
              </motion.p>
            </div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-2xl px-4 py-3"
            >
              <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Termina en</span>
              </div>
              <div className="flex gap-2 text-white font-bold text-lg">
                <span>{timeRemaining.days}d</span>
                <span>{timeRemaining.hours}h</span>
                <span>{timeRemaining.minutes}m</span>
              </div>
            </motion.div>
          </div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            <div className="glass-dark rounded-xl px-4 py-2">
              <p className="text-white/70 text-xs">Tu posición</p>
              <p className="text-white text-xl font-bold">#{currentUser.rank}</p>
            </div>
            <div className="glass-dark rounded-xl px-4 py-2">
              <p className="text-white/70 text-xs">Tus puntos</p>
              <p className="text-white text-xl font-bold">{currentUser.points.toLocaleString()}</p>
            </div>
            {pointsToTop3 > 0 && (
              <div className="glass-dark rounded-xl px-4 py-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-white/70" />
                <div>
                  <p className="text-white/70 text-xs">Para Top 3</p>
                  <p className="text-white text-sm font-bold">+{pointsToTop3} pts</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <Card>
            <CardContent className="p-6">
              <ListSkeleton rows={5} showAvatar showRank />
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !hasEnoughUsers && (
          <Card>
            <CardContent className="p-6">
              <EmptyState
                variant="no-leaderboard"
                onAction={() => navigate('/training')}
              />
            </CardContent>
          </Card>
        )}

        {/* Data state */}
        {!isLoading && hasEnoughUsers && (
          <>
            {/* Podium */}
            <Card className="overflow-visible bg-transparent border-0 shadow-none">
              <CardContent className="pt-8 pb-0 px-2">
                <div className="grid grid-cols-3 gap-2 md:gap-4 items-end justify-items-center">
                  {/* 2nd Place */}
                  <PodiumCard rank={2} player={top3[1]} delay={0.2} />
                  {/* 1st Place */}
                  <PodiumCard rank={1} player={top3[0]} delay={0.1} />
                  {/* 3rd Place */}
                  <PodiumCard rank={3} player={top3[2]} delay={0.3} />
                </div>
              </CardContent>
            </Card>

            {/* Rest of the List */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Clasificación</span>
                </div>
                <div className="space-y-2">
                  {restOfList.map((athlete, index) => (
                    <motion.div
                      key={athlete.rank}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        athlete.name === currentUser.name
                          ? 'bg-primary/10 border-2 border-primary/30'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="font-bold text-sm text-muted-foreground">
                          {athlete.rank}
                        </span>
                      </div>

                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold text-sm">
                          {athlete.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {athlete.name}
                          {athlete.name === currentUser.name && (
                            <span className="ml-2 text-xs text-primary font-normal">(Tú)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Racha: {athlete.streak} días 🔥
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-bold text-primary">{athlete.points.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">puntos</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prize Zone */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-bold">Premios del Podio</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockPrizes.map((prize, index) => (
                  <PrizeCard
                    key={prize.id}
                    position={(index + 1) as 1 | 2 | 3}
                    prize={prize}
                    delay={0.7 + index * 0.1}
                    onClick={() => setSelectedPrize({ prize, position: (index + 1) as 1 | 2 | 3 })}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Prize Detail Modal */}
        <PrizeDetailModal
          prize={selectedPrize?.prize ?? null}
          position={selectedPrize?.position ?? 1}
          open={!!selectedPrize}
          onClose={() => setSelectedPrize(null)}
        />
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
