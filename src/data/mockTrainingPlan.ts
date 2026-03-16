import type {
  TrainingPlan,
  TrainingStage,
  StageInfo,
  DiagnosticAxis,
  DaySession,
  ExerciseBlock,
  CycleObjective,
  ComplianceData,
  LoadRecoveryData,
} from '@/hooks/useTrainingPlan';
import { TRAINING_STAGES } from '@/hooks/useTrainingPlan';

// Re-export types for backwards compatibility
export type {
  TrainingStage,
  StageInfo,
  DiagnosticAxis,
  DaySession,
  ExerciseBlock,
  CycleObjective,
  ComplianceData,
  LoadRecoveryData,
  TrainingPlan,
};
export { TRAINING_STAGES };

// ---- Mock Data ----

export const mockTrainingPlan: TrainingPlan = {
  id: 'plan-001',
  cycleName: 'Mesociclo 3 – Competición',
  cycleNumber: 3,
  startDate: '2026-02-09',
  endDate: '2026-03-15',
  currentStage: 'implementation',
  currentWeek: 4,
  totalWeeks: 5,
  sport: 'Tenis',
  category: 'U14',

  diagnostic: [
    { axis: 'Físico', score: 7.2, maxScore: 10, detail: 'Resistencia y velocidad lateral buenas. Mejorar fuerza explosiva.' },
    { axis: 'Técnico', score: 6.8, maxScore: 10, detail: 'Buen drive. Revés en progresión. Volea necesita trabajo.' },
    { axis: 'Táctico', score: 5.5, maxScore: 10, detail: 'Lectura de juego básica. Falta variación de patrones.' },
    { axis: 'Mental', score: 7.0, maxScore: 10, detail: 'Buena concentración. Trabajar gestión de presión en puntos clave.' },
  ],

  objective: {
    main: 'Preparación competitiva: mejorar rendimiento en torneos regionales',
    secondary: [
      'Aumentar potencia del saque (+10 km/h)',
      'Mejorar toma de decisiones en red',
      'Reducir errores no forzados en sets largos',
    ],
    progress: 62,
  },

  weekSessions: [
    {
      dayIndex: 0,
      dayLabel: 'Lun',
      type: 'physical',
      title: 'Fuerza y acondicionamiento',
      duration: 60,
      targetRPE: 7,
      status: 'completed',
      rpeLogged: 7,
      exercises: [
        { phase: 'warmup', name: 'Movilidad articular dinámica', duration: '8 min' },
        { phase: 'warmup', name: 'Activación con banda elástica', sets: '2x12' },
        { phase: 'main', name: 'Sentadilla búlgara', sets: '3x10 cada pierna' },
        { phase: 'main', name: 'Press con mancuernas', sets: '3x12' },
        { phase: 'main', name: 'Plancha lateral', sets: '3x30s cada lado' },
        { phase: 'main', name: 'Saltos al cajón', sets: '4x6' },
        { phase: 'cooldown', name: 'Estiramientos estáticos', duration: '10 min' },
      ],
    },
    {
      dayIndex: 1,
      dayLabel: 'Mar',
      type: 'technical',
      title: 'Técnica de saque y volea',
      duration: 90,
      targetRPE: 6,
      status: 'completed',
      rpeLogged: 6,
      exercises: [
        { phase: 'warmup', name: 'Mini-tenis progresivo', duration: '10 min' },
        { phase: 'main', name: 'Servicio plano – zona de precisión', sets: '4x15 saques' },
        { phase: 'main', name: 'Saque con efecto (kick)', sets: '3x12 saques' },
        { phase: 'main', name: 'Approach + volea cerrada', sets: '3x10 repeticiones' },
        { phase: 'main', name: 'Puntos con servicio y red', duration: '20 min' },
        { phase: 'cooldown', name: 'Recuperación activa + hidratación', duration: '8 min' },
      ],
    },
    {
      dayIndex: 2,
      dayLabel: 'Mié',
      type: 'rest',
      title: 'Descanso activo',
      duration: 0,
      targetRPE: 2,
      status: 'completed',
      exercises: [
        { phase: 'main', name: 'Caminata suave o natación libre', duration: '30 min', notes: 'Opcional' },
        { phase: 'cooldown', name: 'Foam rolling', duration: '15 min' },
      ],
    },
    {
      dayIndex: 3,
      dayLabel: 'Jue',
      type: 'tactical',
      title: 'Patrones tácticos de juego',
      duration: 90,
      targetRPE: 7,
      status: 'today',
      exercises: [
        { phase: 'warmup', name: 'Rally de calentamiento cruzado', duration: '10 min' },
        { phase: 'main', name: 'Drill: construir punto desde fondo', sets: '4x5 min' },
        { phase: 'main', name: 'Situación: 2do saque + punto', sets: '3 sets de 10 puntos' },
        { phase: 'main', name: 'Lectura de patrones con vídeo', duration: '15 min' },
        { phase: 'main', name: 'Puntos con restricción táctica', duration: '20 min', notes: 'Solo golpes a zona abierta' },
        { phase: 'cooldown', name: 'Estiramientos + reflexión táctica', duration: '10 min' },
      ],
    },
    {
      dayIndex: 4,
      dayLabel: 'Vie',
      type: 'physical',
      title: 'Velocidad y agilidad',
      duration: 60,
      targetRPE: 8,
      status: 'upcoming',
      exercises: [
        { phase: 'warmup', name: 'Trote + skipping', duration: '8 min' },
        { phase: 'main', name: 'Sprints laterales 5-10-5', sets: '6x' },
        { phase: 'main', name: 'Escalera de agilidad', sets: '4 patrones x3' },
        { phase: 'main', name: 'Carrera con cambio de dirección', sets: '6x' },
        { phase: 'main', name: 'Reacción al estímulo visual', sets: '3x8' },
        { phase: 'cooldown', name: 'Recuperación + hidratación', duration: '10 min' },
      ],
    },
    {
      dayIndex: 5,
      dayLabel: 'Sáb',
      type: 'match',
      title: 'Partido de práctica',
      duration: 120,
      targetRPE: 8,
      status: 'upcoming',
      exercises: [
        { phase: 'warmup', name: 'Peloteo libre + puntos cortos', duration: '15 min' },
        { phase: 'main', name: 'Set completo con análisis táctico', duration: '45 min' },
        { phase: 'main', name: 'Tie-break simulado bajo presión', sets: '3 tie-breaks' },
        { phase: 'main', name: 'Puntos de oro (decisivos)', duration: '20 min' },
        { phase: 'cooldown', name: 'Análisis post-partido + estiramiento', duration: '15 min' },
      ],
    },
    {
      dayIndex: 6,
      dayLabel: 'Dom',
      type: 'rest',
      title: 'Descanso completo',
      duration: 0,
      targetRPE: 1,
      status: 'upcoming',
      exercises: [
        { phase: 'main', name: 'Descanso total', notes: 'Priorizar sueño y nutrición' },
      ],
    },
  ],

  compliance: {
    completedSessions: 14,
    totalSessions: 18,
    currentStreak: 5,
    longestStreak: 12,
    weeklyTrend: [72, 80, 85, 78],
  },

  loadRecovery: {
    acuteLoad: 2850,
    chronicLoad: 2400,
    ratio: 1.19,
    status: 'green',
    fatigueLevel: 5,
    energyLevel: 7,
  },
};
