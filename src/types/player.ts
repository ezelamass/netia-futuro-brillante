export type PlayerCategory = 'U10' | 'U12' | 'U14' | 'U16';
export type PlayerLevel = 'initiation' | 'development' | 'training' | 'competition';
export type Handedness = 'right' | 'left' | 'ambidextrous';
export type TrafficLightStatus = 'green' | 'yellow' | 'red';

export interface PlayerStatus {
  sleep: number;
  hydration: number;
  energy: number;
  pain: number;
  painLocation?: string;
  lastUpdated: Date;
}

export interface WeeklyStats {
  sessions: number;
  targetSessions: number;
  minutes: number;
  rpeAvg: number;
  warmupCompliance: number;
  streak: number;
}

export interface CoachNote {
  id: string;
  date: Date;
  content: string;
  coachId: string;
  coachName: string;
}

export interface PlayerAlert {
  id: string;
  type: 'sleep' | 'hydration' | 'pain' | 'inactivity' | 'load';
  message: string;
  date: Date;
  severity: 'warning' | 'critical';
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  birthDate: Date;
  category: PlayerCategory;
  sport: string;
  level: PlayerLevel;
  handedness: Handedness;
  currentStatus: PlayerStatus;
  weeklyStats: WeeklyStats;
  alerts: PlayerAlert[];
  coachNotes: CoachNote[];
  lastSessionDate: Date;
  tutorName: string;
  tutorEmail: string;
}

export interface RosterFilters {
  search: string;
  category: PlayerCategory | 'all';
  status: TrafficLightStatus | 'all';
  sport: string;
}

export type RosterSortField = 'name' | 'status' | 'lastSession' | 'age';
export type SortDirection = 'asc' | 'desc';

export interface RosterSort {
  field: RosterSortField;
  direction: SortDirection;
}

// Traffic light calculation
export function calculateTrafficLight(player: Player): TrafficLightStatus {
  const issues: ('critical' | 'warning')[] = [];
  const { currentStatus, lastSessionDate } = player;
  
  // Sleep check
  if (currentStatus.sleep < 6) issues.push('critical');
  else if (currentStatus.sleep < 7) issues.push('warning');
  
  // Hydration check
  if (currentStatus.hydration < 1.0) issues.push('critical');
  else if (currentStatus.hydration < 1.2) issues.push('warning');
  
  // Pain check
  if (currentStatus.pain >= 7) issues.push('critical');
  else if (currentStatus.pain >= 4) issues.push('warning');
  
  // Inactivity check
  const daysSinceSession = Math.floor(
    (new Date().getTime() - new Date(lastSessionDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceSession > 7) issues.push('critical');
  else if (daysSinceSession > 3) issues.push('warning');
  
  // Warmup compliance
  if (player.weeklyStats.warmupCompliance < 0.5) issues.push('warning');
  
  if (issues.includes('critical')) return 'red';
  if (issues.length >= 2) return 'yellow';
  if (issues.includes('warning')) return 'yellow';
  return 'green';
}

export const CATEGORY_OPTIONS: { value: PlayerCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas las categorías' },
  { value: 'U10', label: 'U10 (8-10 años)' },
  { value: 'U12', label: 'U12 (11-12 años)' },
  { value: 'U14', label: 'U14 (13-14 años)' },
  { value: 'U16', label: 'U16 (15-16 años)' },
];

export const STATUS_OPTIONS: { value: TrafficLightStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'green', label: '🟢 Sin alertas' },
  { value: 'yellow', label: '🟡 Atención' },
  { value: 'red', label: '🔴 Alerta crítica' },
];

export const LEVEL_LABELS: Record<PlayerLevel, string> = {
  initiation: 'Iniciación',
  development: 'Desarrollo',
  training: 'Entrenamiento',
  competition: 'Competición',
};

export const HANDEDNESS_LABELS: Record<Handedness, string> = {
  right: 'Diestro/a',
  left: 'Zurdo/a',
  ambidextrous: 'Ambidiestro/a',
};
