export type UserRole = 
  | 'player' 
  | 'parent' 
  | 'coach' 
  | 'club_admin' 
  | 'federation' 
  | 'government' 
  | 'admin';

export type UserStatus = 'active' | 'inactive' | 'pending';

export interface UserMetrics {
  totalSessions: number;
  activeDays: number;
  currentStreak: number;
  totalXP: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  clubId?: string;
  clubName?: string;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  metrics?: UserMetrics;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface UserFilters {
  search: string;
  role: UserRole | 'all';
  status: UserStatus | 'all';
  club: string;
  dateFilter: 'all' | 'this_week' | 'this_month' | 'inactive_30';
}

export const ROLE_OPTIONS: { value: UserRole | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Todos los roles', icon: '👥' },
  { value: 'player', label: 'Jugador', icon: '🎾' },
  { value: 'parent', label: 'Familia', icon: '👨‍👩‍👧' },
  { value: 'coach', label: 'Entrenador', icon: '🏫' },
  { value: 'club_admin', label: 'Admin Club', icon: '🏢' },
  { value: 'federation', label: 'Federación', icon: '🏛' },
  { value: 'government', label: 'Gobierno', icon: '🏛' },
  { value: 'admin', label: 'Administrador', icon: '🔑' },
];

export const STATUS_OPTIONS: { value: UserStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
  { value: 'pending', label: 'Pendientes' },
];

export const ROLE_LABELS: Record<UserRole, { label: string; icon: string }> = {
  player: { label: 'Jugador', icon: '🎾' },
  parent: { label: 'Familia', icon: '👨‍👩‍👧' },
  coach: { label: 'Entrenador', icon: '🏫' },
  club_admin: { label: 'Admin Club', icon: '🏢' },
  federation: { label: 'Federación', icon: '🏛' },
  government: { label: 'Gobierno', icon: '🏛' },
  admin: { label: 'Administrador', icon: '🔑' },
};
