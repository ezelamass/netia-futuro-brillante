import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Trophy, Flame, Star, Target, Zap, Heart, 
  Droplets, Moon, TrendingUp, Award, Medal,
  ChevronRight
} from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useWellnessStatus, INDICATORS, calculateStatus } from '@/hooks/useWellnessStatus';
import { Sparkline } from '@/components/dashboard/Sparkline';

// Achievement definitions
const ACHIEVEMENTS = [
  { 
    id: 'streak-7', 
    title: 'Una semana constante', 
    description: '7 días seguidos registrando', 
    icon: Flame, 
    requirement: 7, 
    type: 'streak',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  { 
    id: 'streak-30', 
    title: 'Mes de hierro', 
    description: '30 días seguidos registrando', 
    icon: Trophy, 
    requirement: 30, 
    type: 'streak',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  { 
    id: 'xp-500', 
    title: 'Primeros pasos', 
    description: 'Alcanzar 500 XP', 
    icon: Star, 
    requirement: 500, 
    type: 'xp',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  { 
    id: 'xp-1000', 
    title: 'En camino', 
    description: 'Alcanzar 1000 XP', 
    icon: Zap, 
    requirement: 1000, 
    type: 'xp',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    id: 'xp-2500', 
    title: 'Atleta dedicado', 
    description: 'Alcanzar 2500 XP', 
    icon: Award, 
    requirement: 2500, 
    type: 'xp',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    id: 'green-5', 
    title: 'Semáforo verde', 
    description: '5 días con todos los indicadores en verde', 
    icon: Heart, 
    requirement: 5, 
    type: 'green',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  { 
    id: 'sleep-master', 
    title: 'Dormilón pro', 
    description: '7 días con 8+ horas de sueño', 
    icon: Moon, 
    requirement: 7, 
    type: 'sleep',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10'
  },
  { 
    id: 'hydration-hero', 
    title: 'Héroe de la hidratación', 
    description: '7 días con 2L+ de agua', 
    icon: Droplets, 
    requirement: 7, 
    type: 'hydration',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10'
  },
];

const Achievements = () => {
  const { logs, getStreak, getXP, getLogsForDays } = useDailyLog();
  
  const streak = getStreak();
  const xp = getXP();
  const recentLogs = getLogsForDays(28);

  // Calculate achievement progress
  const achievementProgress = useMemo(() => {
    const greenDays = recentLogs.filter(log => calculateStatus(log) === 'green').length;
    const goodSleepDays = recentLogs.filter(log => log.sleep >= 8).length;
    const goodHydrationDays = recentLogs.filter(log => log.hydration >= 2).length;

    return ACHIEVEMENTS.map(achievement => {
      let current = 0;
      switch (achievement.type) {
        case 'streak':
          current = streak;
          break;
        case 'xp':
          current = xp;
          break;
        case 'green':
          current = greenDays;
          break;
        case 'sleep':
          current = goodSleepDays;
          break;
        case 'hydration':
          current = goodHydrationDays;
          break;
      }
      
      return {
        ...achievement,
        current,
        progress: Math.min((current / achievement.requirement) * 100, 100),
        isUnlocked: current >= achievement.requirement,
      };
    });
  }, [streak, xp, recentLogs]);

  // Historical data for charts
  const historicalData = useMemo(() => {
    const last7Days = getLogsForDays(7);
    return {
      sleep: last7Days.map(l => l.sleep),
      hydration: last7Days.map(l => l.hydration),
      energy: last7Days.map(l => l.energy),
      pain: last7Days.map(l => 10 - l.pain),
    };
  }, [getLogsForDays]);

  // Weekly averages
  const weeklyAverages = useMemo(() => {
    const last7Days = getLogsForDays(7);
    if (last7Days.length === 0) return { sleep: 0, hydration: 0, energy: 0, pain: 0 };
    
    return {
      sleep: last7Days.reduce((sum, l) => sum + l.sleep, 0) / last7Days.length,
      hydration: last7Days.reduce((sum, l) => sum + l.hydration, 0) / last7Days.length,
      energy: last7Days.reduce((sum, l) => sum + l.energy, 0) / last7Days.length,
      pain: last7Days.reduce((sum, l) => sum + l.pain, 0) / last7Days.length,
    };
  }, [getLogsForDays]);

  // Activity heatmap for last 28 days
  const heatmapData = useMemo(() => {
    const today = new Date();
    const days: { date: Date; status: 'green' | 'yellow' | 'red' | 'none' }[] = [];
    
    for (let i = 27; i >= 0; i--) {
      const date = subDays(today, i);
      const log = logs.find(l => 
        format(l.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      days.push({
        date,
        status: log ? calculateStatus(log) : 'none',
      });
    }
    
    return days;
  }, [logs]);

  const unlockedCount = achievementProgress.filter(a => a.isUnlocked).length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-xs text-muted-foreground">Días de racha</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-3xl font-bold">{xp.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">XP total</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-3xl font-bold">{unlockedCount}/{ACHIEVEMENTS.length}</p>
              <p className="text-xs text-muted-foreground">Logros</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Actividad de los últimos 28 días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1.5">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div key={i} className="text-center text-xs text-muted-foreground mb-1">
                    {day}
                  </div>
                ))}
                {heatmapData.map((day, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn(
                      "aspect-square rounded-sm",
                      day.status === 'green' && "bg-emerald-500",
                      day.status === 'yellow' && "bg-yellow-500",
                      day.status === 'red' && "bg-red-500",
                      day.status === 'none' && "bg-muted"
                    )}
                    title={format(day.date, 'd MMM', { locale: es })}
                  />
                ))}
              </div>
              <div className="flex items-center justify-end gap-3 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <span>Sin datos</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span>Verde</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-yellow-500" />
                  <span>Atención</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-red-500" />
                  <span>Alerta</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Promedios semanales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {INDICATORS.map((indicator, index) => {
                  const key = indicator.key as keyof typeof weeklyAverages;
                  const avg = weeklyAverages[key];
                  const data = historicalData[key];
                  
                  return (
                    <div key={indicator.key} className="p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{indicator.emoji}</span>
                        <span className="text-sm font-medium">{indicator.label}</span>
                      </div>
                      <p className="text-2xl font-bold mb-2">
                        {indicator.key === 'pain' 
                          ? avg.toFixed(1) 
                          : indicator.key === 'energy' 
                            ? avg.toFixed(1) 
                            : avg.toFixed(1)
                        }
                        <span className="text-sm font-normal text-muted-foreground">
                          {indicator.unit}
                        </span>
                      </p>
                      <Sparkline 
                        data={data} 
                        color={
                          indicator.key === 'sleep' && avg >= 7 ? '#22C55E' :
                          indicator.key === 'hydration' && avg >= 1.5 ? '#22C55E' :
                          indicator.key === 'energy' && avg >= 4 ? '#22C55E' :
                          indicator.key === 'pain' && avg <= 2 ? '#22C55E' :
                          '#EAB308'
                        }
                        width={80}
                        height={24}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Medal className="w-5 h-5" />
                Logros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievementProgress.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border transition-all",
                    achievement.isUnlocked 
                      ? `${achievement.bgColor} border-transparent` 
                      : "bg-muted/30 border-border/50 opacity-70"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    achievement.isUnlocked ? achievement.bgColor : "bg-muted"
                  )}>
                    <achievement.icon className={cn(
                      "w-6 h-6",
                      achievement.isUnlocked ? achievement.color : "text-muted-foreground"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={cn(
                        "font-semibold text-sm",
                        achievement.isUnlocked && achievement.color
                      )}>
                        {achievement.title}
                      </h4>
                      {achievement.isUnlocked && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full">
                          ✓ Desbloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    
                    {!achievement.isUnlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{achievement.current} / {achievement.requirement}</span>
                          <span>{Math.round(achievement.progress)}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1.5" />
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* History Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Historial reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentLogs.slice().reverse().slice(0, 14).map((log, index) => {
                  const status = calculateStatus(log);
                  return (
                    <div 
                      key={log.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={cn(
                        "w-3 h-3 rounded-full shrink-0",
                        status === 'green' && "bg-emerald-500",
                        status === 'yellow' && "bg-yellow-500",
                        status === 'red' && "bg-red-500"
                      )} />
                      <span className="text-sm text-muted-foreground w-24">
                        {format(log.date, "d MMM", { locale: es })}
                      </span>
                      <div className="flex-1 flex items-center gap-3 text-xs">
                        <span>😴 {log.sleep.toFixed(1)}h</span>
                        <span>💧 {log.hydration.toFixed(1)}L</span>
                        <span>⚡ {log.energy}/5</span>
                        <span>🦵 {log.pain}/10</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Achievements;
