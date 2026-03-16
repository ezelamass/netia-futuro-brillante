import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { SessionType } from '@/types/training';

// Types moved from mockTrainingPlan
export type TrainingStage =
  | 'profiling'
  | 'diagnostic'
  | 'objective'
  | 'design'
  | 'validation'
  | 'implementation'
  | 'monitoring';

export interface StageInfo {
  key: TrainingStage;
  label: string;
  shortLabel: string;
  description: string;
}

export const TRAINING_STAGES: StageInfo[] = [
  { key: 'profiling', label: 'Perfilado', shortLabel: '1', description: 'Recopilación de datos del deportista' },
  { key: 'diagnostic', label: 'Diagnóstico', shortLabel: '2', description: 'Evaluación del estado actual' },
  { key: 'objective', label: 'Objetivo', shortLabel: '3', description: 'Definición de metas del ciclo' },
  { key: 'design', label: 'Diseño', shortLabel: '4', description: 'Planificación del mesociclo' },
  { key: 'validation', label: 'Validación', shortLabel: '5', description: 'Revisión del entrenador' },
  { key: 'implementation', label: 'Implementación', shortLabel: '6', description: 'Ejecución del plan' },
  { key: 'monitoring', label: 'Seguimiento', shortLabel: '7', description: 'Control y ajuste continuo' },
];

export interface DiagnosticAxis {
  axis: string;
  score: number;
  maxScore: number;
  detail: string;
}

export interface DaySession {
  dayIndex: number;
  dayLabel: string;
  type: SessionType | 'rest';
  title: string;
  duration: number;
  targetRPE: number;
  status: 'completed' | 'today' | 'upcoming' | 'rest';
  rpeLogged?: number;
  exercises: ExerciseBlock[];
}

export interface ExerciseBlock {
  phase: 'warmup' | 'main' | 'cooldown';
  name: string;
  sets?: string;
  duration?: string;
  notes?: string;
}

export interface CycleObjective {
  main: string;
  secondary: string[];
  progress: number;
}

export interface ComplianceData {
  completedSessions: number;
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  weeklyTrend: number[];
}

export interface LoadRecoveryData {
  acuteLoad: number;
  chronicLoad: number;
  ratio: number;
  status: 'green' | 'yellow' | 'red';
  fatigueLevel: number;
  energyLevel: number;
}

export interface TrainingPlan {
  id: string;
  cycleName: string;
  cycleNumber: number;
  startDate: string;
  endDate: string;
  currentStage: TrainingStage;
  currentWeek: number;
  totalWeeks: number;
  sport: string;
  category: string;
  diagnostic: DiagnosticAxis[];
  objective: CycleObjective;
  weekSessions: DaySession[];
  compliance: ComplianceData;
  loadRecovery: LoadRecoveryData;
}

export function useTrainingPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPlan = async () => {
      setIsLoading(true);

      try {
        // Fetch active training plan
        const { data: planData } = await supabase
          .from('training_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!planData) {
          setPlan(null);
          setIsLoading(false);
          return;
        }

        // Fetch plan sessions for current week
        const { data: sessionsData } = await supabase
          .from('training_plan_sessions')
          .select('*')
          .eq('plan_id', planData.id)
          .eq('week_number', planData.current_week)
          .order('day_index', { ascending: true });

        // Fetch diagnostic history for this user
        const { data: diagnosticData } = await supabase
          .from('diagnostic_history')
          .select('axis, score, detail')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(10);

        // Fetch player stats for compliance
        const { data: statsData } = await supabase
          .from('player_stats')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .single();

        // Build diagnostic axes (deduplicate by axis)
        const axisMap = new Map<string, DiagnosticAxis>();
        for (const d of (diagnosticData || [])) {
          if (!axisMap.has(d.axis)) {
            axisMap.set(d.axis, {
              axis: d.axis,
              score: Number(d.score),
              maxScore: 10,
              detail: d.detail || '',
            });
          }
        }

        // Build week sessions
        const today = new Date().getDay(); // 0=Sun
        const todayIndex = today === 0 ? 6 : today - 1; // Convert to 0=Mon

        const weekSessions: DaySession[] = (sessionsData || []).map(s => {
          const exercises: ExerciseBlock[] = Array.isArray(s.exercises)
            ? (s.exercises as any[]).map(e => ({
                phase: e.phase || 'main',
                name: e.name || '',
                sets: e.sets,
                duration: e.duration,
                notes: e.notes,
              }))
            : [];

          let status: DaySession['status'] = 'upcoming';
          if (s.status === 'completed') status = 'completed';
          else if (s.day_index === todayIndex) status = 'today';
          else if (s.day_index < todayIndex) status = 'completed';
          if (s.session_type === 'rest') status = 'rest';

          return {
            dayIndex: s.day_index,
            dayLabel: s.day_label,
            type: s.session_type as SessionType | 'rest',
            title: s.title,
            duration: s.duration_min,
            targetRPE: s.rpe || 5,
            status,
            rpeLogged: s.status === 'completed' ? (s.rpe || undefined) : undefined,
            exercises,
          };
        });

        // Compliance
        const completedSessions = (sessionsData || []).filter(s => s.status === 'completed').length;
        const totalAllSessions = sessionsData?.length || 0;

        // Calculate total sessions across all weeks for this plan
        const { count: totalPlanSessions } = await supabase
          .from('training_plan_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('plan_id', planData.id);

        const { count: completedPlanSessions } = await supabase
          .from('training_plan_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('plan_id', planData.id)
          .eq('status', 'completed');

        const built: TrainingPlan = {
          id: planData.id,
          cycleName: planData.cycle_name,
          cycleNumber: 1,
          startDate: planData.start_date || '',
          endDate: planData.end_date || '',
          currentStage: planData.current_stage as TrainingStage,
          currentWeek: planData.current_week,
          totalWeeks: planData.total_weeks,
          sport: planData.sport,
          category: planData.category,
          diagnostic: Array.from(axisMap.values()),
          objective: {
            main: planData.objective || '',
            secondary: [],
            progress: totalPlanSessions
              ? Math.round(((completedPlanSessions ?? 0) / totalPlanSessions) * 100)
              : 0,
          },
          weekSessions,
          compliance: {
            completedSessions: completedPlanSessions ?? 0,
            totalSessions: totalPlanSessions ?? 0,
            currentStreak: statsData?.current_streak ?? 0,
            longestStreak: statsData?.longest_streak ?? 0,
            weeklyTrend: [],
          },
          loadRecovery: {
            acuteLoad: 0,
            chronicLoad: 0,
            ratio: 1.0,
            status: 'green',
            fatigueLevel: 5,
            energyLevel: 5,
          },
        };

        setPlan(built);
      } catch (error) {
        console.error('Error fetching training plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [user?.id]);

  return { plan, isLoading };
}
