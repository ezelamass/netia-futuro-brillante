import { z } from 'zod';

// Enums and constants
export const SPORTS = [
  { value: 'tennis', label: 'Tenis' },
  { value: 'football', label: 'Fútbol' },
  { value: 'basketball', label: 'Básquet' },
  { value: 'swimming', label: 'Natación' },
  { value: 'athletics', label: 'Atletismo' },
  { value: 'sailing', label: 'Vela' },
  { value: 'hockey', label: 'Hockey' },
  { value: 'volleyball', label: 'Vóley' },
  { value: 'rugby', label: 'Rugby' },
  { value: 'other', label: 'Otro' },
] as const;

export const LEVELS = [
  { value: 'initiation', label: 'Iniciación' },
  { value: 'development', label: 'Desarrollo' },
  { value: 'training', label: 'Entrenamiento' },
  { value: 'competition', label: 'Competencia' },
] as const;

export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lun' },
  { value: 'tuesday', label: 'Mar' },
  { value: 'wednesday', label: 'Mié' },
  { value: 'thursday', label: 'Jue' },
  { value: 'friday', label: 'Vie' },
  { value: 'saturday', label: 'Sáb' },
  { value: 'sunday', label: 'Dom' },
] as const;

export const GOALS = [
  { value: 'technique', label: 'Mejorar técnica' },
  { value: 'compete', label: 'Competir más' },
  { value: 'recovery', label: 'Recuperación de lesión' },
  { value: 'active', label: 'Mantenerme activo' },
  { value: 'other', label: 'Otro' },
] as const;

export const AREAS_TO_IMPROVE = [
  'Resistencia',
  'Velocidad',
  'Fuerza',
  'Flexibilidad',
  'Técnica',
  'Táctica',
  'Concentración',
  'Control emocional',
] as const;

export const DIETARY_RESTRICTIONS = [
  'Sin gluten',
  'Sin lactosa',
  'Vegetariano',
  'Vegano',
  'Sin frutos secos',
  'Kosher',
  'Halal',
] as const;

export const FOCUS_TECHNIQUES = [
  'Respiración',
  'Visualización',
  'Música',
  'Rutina pre-partido',
  'Meditación',
  'Ninguna',
] as const;

export const COUNTRIES = [
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'MX', label: 'México' },
  { value: 'CO', label: 'Colombia' },
  { value: 'ES', label: 'España' },
  { value: 'US', label: 'Estados Unidos' },
] as const;

// Zod schema for validation
export const profileSchema = z.object({
  // Personal
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  birthDate: z.string(),
  country: z.string().min(1, 'Seleccioná un país'),
  city: z.string().min(1, 'Ingresá tu ciudad'),
  language: z.enum(['es', 'en']),
  avatarUrl: z.string().optional(),

  // Deportivo
  sport: z.string().min(1, 'Seleccioná un deporte'),
  level: z.enum(['initiation', 'development', 'training', 'competition']),
  handedness: z.enum(['right', 'left', 'ambidextrous']),
  hasCoach: z.boolean(),
  coachName: z.string().optional(),
  trainingDays: z.array(z.string()).min(1, 'Seleccioná al menos un día'),
  sessionDuration: z.number().min(30).max(180),

  // Objetivos
  mainGoal: z.enum(['technique', 'compete', 'recovery', 'active', 'other']),
  areasToImprove: z.array(z.string()),
  championModeReminders: z.boolean(),

  // Físico
  height: z.number().min(50, 'Altura mínima 50cm').max(250, 'Altura máxima 250cm'),
  heightUnit: z.enum(['cm', 'ft']),
  weight: z.number().min(15, 'Peso mínimo 15kg').max(200, 'Peso máximo 200kg'),
  weightUnit: z.enum(['kg', 'lb']),
  injuries: z.string().optional(),
  doesPhysicalPrep: z.enum(['yes', 'no', 'sometimes']),
  hasSmartwatch: z.boolean(),
  smartwatchType: z.string().optional(),

  // Nutrición
  breakfastBeforeTraining: z.enum(['always', 'sometimes', 'never']),
  mealsPerDay: z.number().min(2).max(8),
  dietaryRestrictions: z.array(z.string()),
  zahiaPlanActive: z.boolean(),

  // Mental
  preCompetitionFeeling: z.enum(['nervous', 'calm', 'motivated', 'distracted']),
  focusTechniques: z.array(z.string()),
  relaxationExercises: z.boolean(),
  romaGoalsActive: z.boolean(),

  // Familia
  tutorName: z.string().min(2, 'El nombre del tutor debe tener al menos 2 caracteres'),
  tutorEmail: z.string().email('Email inválido'),
  tutorPhone: z.string().optional(),
  weeklyReports: z.boolean(),

  // Preferencias
  preferredAvatar: z.enum(['TINO', 'ZAHIA', 'ROMA']),
  avatarNickname: z.string().optional(),
  communicationMode: z.enum(['text', 'voice']),
  championModeChallenges: z.boolean(),

  // Stats (readonly)
  streak: z.number(),
  totalXP: z.number(),
  achievementsCount: z.number(),
  memberSince: z.string(),
});

export type UserProfile = z.infer<typeof profileSchema>;

// Default profile data
export const DEFAULT_PROFILE: UserProfile = {
  // Personal
  fullName: 'Mateo García López',
  birthDate: '2012-05-15',
  country: 'AR',
  city: 'Buenos Aires',
  language: 'es',
  avatarUrl: undefined,

  // Deportivo
  sport: 'tennis',
  level: 'competition',
  handedness: 'right',
  hasCoach: true,
  coachName: 'Academia Wilson',
  trainingDays: ['monday', 'wednesday', 'friday'],
  sessionDuration: 90,

  // Objetivos
  mainGoal: 'technique',
  areasToImprove: ['Resistencia', 'Concentración'],
  championModeReminders: true,

  // Físico
  height: 155,
  heightUnit: 'cm',
  weight: 45,
  weightUnit: 'kg',
  injuries: '',
  doesPhysicalPrep: 'sometimes',
  hasSmartwatch: false,
  smartwatchType: '',

  // Nutrición
  breakfastBeforeTraining: 'always',
  mealsPerDay: 4,
  dietaryRestrictions: [],
  zahiaPlanActive: true,

  // Mental
  preCompetitionFeeling: 'motivated',
  focusTechniques: ['Respiración', 'Música'],
  relaxationExercises: true,
  romaGoalsActive: true,

  // Familia
  tutorName: 'María López',
  tutorEmail: 'maria.lopez@email.com',
  tutorPhone: '+54 11 1234-5678',
  weeklyReports: true,

  // Preferencias
  preferredAvatar: 'TINO',
  avatarNickname: 'Campeón',
  communicationMode: 'text',
  championModeChallenges: true,

  // Stats
  streak: 12,
  totalXP: 2450,
  achievementsCount: 8,
  memberSince: '2024-01-15',
};
