import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { useTrainingPlan, TRAINING_STAGES } from '@/hooks/useTrainingPlan';
import type { TrainingPlan } from '@/hooks/useTrainingPlan';
import { mockTrainingPlan } from '@/data/mockTrainingPlan';
import {
  StageProgressBar,
  CycleGoalCard,
  DiagnosticRadar,
  WeeklyMicrocycle,
  SessionDetail,
  ComplianceCard,
  LoadRecoveryCard,
} from '@/components/training';
import { Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardSkeleton } from '@/components/skeletons';

const Training = () => {
  const { plan: realPlan, isLoading } = useTrainingPlan();

  // Use real plan if available, otherwise fallback to mock for display
  const plan = realPlan || mockTrainingPlan;

  const todayIndex = plan.weekSessions.find(s => s.status === 'today')?.dayIndex ?? 3;
  const [selectedDay, setSelectedDay] = useState<number>(todayIndex);

  const selectedSession = plan.weekSessions.find(s => s.dayIndex === selectedDay) || plan.weekSessions[0];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 pb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mi Plan de Entrenamiento</h1>
              <p className="text-xs text-muted-foreground">{plan.sport} · {plan.category} · {plan.cycleName}</p>
            </div>
          </div>
        </motion.div>

        {/* Stage Progress */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <StageProgressBar currentStage={plan.currentStage} />
        </motion.div>

        {/* Goal + Diagnostic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CycleGoalCard
            objective={plan.objective}
            cycleName={plan.cycleName}
            currentWeek={plan.currentWeek}
            totalWeeks={plan.totalWeeks}
          />
          <DiagnosticRadar diagnostic={plan.diagnostic} />
        </div>

        {/* Weekly Microcycle */}
        {plan.weekSessions.length > 0 && (
          <>
            <WeeklyMicrocycle
              sessions={plan.weekSessions}
              onSelectDay={setSelectedDay}
              selectedDay={selectedDay}
            />
            {selectedSession && <SessionDetail session={selectedSession} />}
          </>
        )}

        {/* Compliance + Load Recovery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ComplianceCard compliance={plan.compliance} />
          <LoadRecoveryCard data={plan.loadRecovery} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Training;
