// Gamification types for NETIA
export type PlayerLevel = 'bronze' | 'silver' | 'gold' | 'elite';

export interface PlayerStats {
  xp: number;
  level: PlayerLevel;
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  totalTrainingMin: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'xp' | 'wellness' | 'training';
  requirement: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const LEVEL_THRESHOLDS: Record<PlayerLevel, number> = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  elite: 5000,
};

export const LEVEL_CONFIG: Record<PlayerLevel, { label: string; emoji: string; color: string }> = {
  bronze: { label: 'Bronce', emoji: '🥉', color: 'text-amber-700' },
  silver: { label: 'Plata', emoji: '🥈', color: 'text-gray-400' },
  gold: { label: 'Oro', emoji: '🥇', color: 'text-yellow-500' },
  elite: { label: 'Elite', emoji: '💎', color: 'text-cyan-400' },
};

export const BADGES: Omit<Badge, 'isUnlocked' | 'unlockedAt'>[] = [
  { id: 'streak-7', title: 'Una semana constante', description: '7 días seguidos registrando', icon: '🔥', category: 'streak', requirement: 7 },
  { id: 'streak-30', title: 'Mes de hierro', description: '30 días seguidos registrando', icon: '🏆', category: 'streak', requirement: 30 },
  { id: 'streak-100', title: 'Centurión', description: '100 días seguidos', icon: '⚡', category: 'streak', requirement: 100 },
  { id: 'xp-500', title: 'Primeros pasos', description: 'Alcanzar 500 XP', icon: '⭐', category: 'xp', requirement: 500 },
  { id: 'xp-1000', title: 'En camino', description: 'Alcanzar 1000 XP', icon: '💫', category: 'xp', requirement: 1000 },
  { id: 'xp-2500', title: 'Atleta dedicado', description: 'Alcanzar 2500 XP', icon: '🌟', category: 'xp', requirement: 2500 },
  { id: 'green-5', title: 'Semáforo verde', description: '5 días con indicadores en verde', icon: '💚', category: 'wellness', requirement: 5 },
  { id: 'sleep-7', title: 'Dormilón pro', description: '7 días con 8+ horas de sueño', icon: '🌙', category: 'wellness', requirement: 7 },
  { id: 'hydration-7', title: 'Héroe de la hidratación', description: '7 días con 2L+ de agua', icon: '💧', category: 'wellness', requirement: 7 },
  { id: 'training-10', title: 'Atleta en formación', description: '10 entrenamientos registrados', icon: '🏋️', category: 'training', requirement: 10 },
  { id: 'training-50', title: 'Imparable', description: '50 entrenamientos registrados', icon: '🦾', category: 'training', requirement: 50 },
  { id: 'training-100', title: 'Máquina', description: '100 entrenamientos registrados', icon: '🤖', category: 'training', requirement: 100 },
];

export function calculateLevel(xp: number): PlayerLevel {
  if (xp >= LEVEL_THRESHOLDS.elite) return 'elite';
  if (xp >= LEVEL_THRESHOLDS.gold) return 'gold';
  if (xp >= LEVEL_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

export function getNextLevelXP(currentLevel: PlayerLevel): number {
  const levels: PlayerLevel[] = ['bronze', 'silver', 'gold', 'elite'];
  const idx = levels.indexOf(currentLevel);
  if (idx >= levels.length - 1) return LEVEL_THRESHOLDS.elite;
  return LEVEL_THRESHOLDS[levels[idx + 1]];
}
