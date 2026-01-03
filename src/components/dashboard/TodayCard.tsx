import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useWellnessStatus, INDICATORS, STATUS_COLORS } from '@/hooks/useWellnessStatus';
import { WellnessIndicator } from './WellnessIndicator';
import { TodayActionCard } from './TodayActionCard';
import { StreakBadge } from './StreakBadge';
import { DailyLogSheet } from './DailyLogSheet';

export const TodayCard = () => {
  const [showLogSheet, setShowLogSheet] = useState(false);
  const [initialStep, setInitialStep] = useState(0);
  
  const {
    todayLog,
    hasLoggedToday,
    todayAction,
    addLog,
    completeTodayAction,
    getLogsForDays,
    getStreak,
    getXP,
  } = useDailyLog();

  const {
    status,
    statusMessage,
    statusColors,
    getIndicatorStatus,
    getIndicatorValue,
  } = useWellnessStatus(todayLog);

  const historicalData = useMemo(() => {
    const logs = getLogsForDays(7);
    return {
      sleep: logs.map(l => l.sleep),
      hydration: logs.map(l => l.hydration),
      energy: logs.map(l => l.energy),
      pain: logs.map(l => 10 - l.pain), // Invert for visualization (higher = better)
    };
  }, [getLogsForDays]);

  const streak = getStreak();
  const xp = getXP();

  const handleIndicatorClick = (index: number) => {
    setInitialStep(index);
    setShowLogSheet(true);
  };

  const handleLogSave = (data: Parameters<typeof addLog>[0]) => {
    addLog(data);
  };

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: es });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 p-5",
          "bg-background/80 backdrop-blur-md",
          "shadow-lg",
          statusColors.border,
          statusColors.glow,
          status === 'green' && "shadow-emerald-500/10",
          status === 'yellow' && "shadow-yellow-500/10",
          status === 'red' && "shadow-red-500/10"
        )}
      >
        {/* Status glow effect */}
        <div className={cn(
          "absolute inset-0 opacity-20 pointer-events-none",
          status === 'green' && "bg-gradient-to-br from-emerald-500/30 to-transparent",
          status === 'yellow' && "bg-gradient-to-br from-yellow-500/30 to-transparent",
          status === 'red' && "bg-gradient-to-br from-red-500/30 to-transparent"
        )} />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Semáforo */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={cn(
                "w-4 h-4 rounded-full",
                status === 'green' && "bg-emerald-500",
                status === 'yellow' && "bg-yellow-500",
                status === 'red' && "bg-red-500"
              )}
            />
            <div>
              <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
              <h3 className={cn("font-semibold", statusColors.text)}>{statusMessage}</h3>
            </div>
          </div>

          {!hasLoggedToday && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLogSheet(true)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Registrar
            </Button>
          )}
        </div>

        {/* Wellness Indicators */}
        <div className="relative grid grid-cols-4 gap-2 mb-4">
          {INDICATORS.map((indicator, index) => (
            <WellnessIndicator
              key={indicator.key}
              indicator={indicator}
              value={getIndicatorValue(indicator)}
              status={getIndicatorStatus(indicator)}
              historicalData={historicalData[indicator.key]}
              onClick={() => handleIndicatorClick(index)}
              delay={0.1 + index * 0.05}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground px-2">📋 ACCIÓN DEL DÍA</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Today's Action */}
        <TodayActionCard
          action={todayAction}
          onComplete={completeTodayAction}
        />

        {/* Streak and XP */}
        <StreakBadge streak={streak} xp={xp} />
      </motion.div>

      {/* Daily Log Sheet */}
      <DailyLogSheet
        open={showLogSheet}
        onClose={() => setShowLogSheet(false)}
        onSave={handleLogSave}
        initialStep={initialStep}
      />
    </>
  );
};
