import { User, UserActivity, UserRole, UserStatus } from '@/types/user';

const CLUBS = [
  { id: 'club_1', name: 'Tenis Norte' },
  { id: 'club_2', name: 'Club Deportivo Central' },
  { id: 'club_3', name: 'Academia Sur' },
  { id: 'club_4', name: 'Fútbol Oeste' },
  { id: 'club_5', name: 'Natación Este' },
];

const FIRST_NAMES = [
  'Ana', 'María', 'Juan', 'Pedro', 'Lucas', 'Sofía', 'Martín', 'Valentina',
  'Diego', 'Camila', 'Santiago', 'Isabella', 'Mateo', 'Emma', 'Nicolás',
  'Lucía', 'Benjamín', 'Mía', 'Alejandro', 'Victoria', 'Daniel', 'Catalina',
  'Gabriel', 'Antonella', 'Samuel', 'Renata', 'Sebastián', 'Emilia', 'Tomás',
  'Julieta', 'Felipe', 'Paula', 'Andrés', 'Mariana', 'David', 'Carolina',
  'José', 'Andrea', 'Carlos', 'Valeria', 'Miguel', 'Florencia', 'Joaquín',
  'Abril', 'Francisco', 'Agustina', 'Pablo', 'Bianca', 'Manuel', 'Candela'
];

const LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández',
  'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez',
  'Díaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Gutiérrez', 'Ramos',
  'Castro', 'Vargas', 'Mendoza', 'Ruiz', 'Jiménez', 'Álvarez', 'Romero',
  'Moreno', 'Fernández', 'Muñoz'
];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockUsers(count: number): User[] {
  const users: User[] = [];
  const roles: UserRole[] = ['player', 'family', 'coach', 'club_admin', 'federation', 'government', 'admin'];
  const statuses: UserStatus[] = ['active', 'inactive', 'pending'];
  
  // Distribution weights: more players and families
  const roleWeights = {
    player: 0.55,
    family: 0.25,
    coach: 0.08,
    club_admin: 0.05,
    federation: 0.03,
    government: 0.02,
    admin: 0.02,
  };

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
    
    // Weighted role selection
    const rand = Math.random();
    let cumulative = 0;
    let role: UserRole = 'player';
    for (const [r, weight] of Object.entries(roleWeights)) {
      cumulative += weight;
      if (rand < cumulative) {
        role = r as UserRole;
        break;
      }
    }
    
    // Status distribution: 90% active, 5% inactive, 5% pending
    const statusRand = Math.random();
    let status: UserStatus = 'active';
    if (statusRand > 0.95) status = 'pending';
    else if (statusRand > 0.90) status = 'inactive';
    
    const club = ['admin', 'federation', 'government'].includes(role) 
      ? null 
      : CLUBS[Math.floor(Math.random() * CLUBS.length)];
    
    const createdAt = randomDate(new Date('2024-01-01'), new Date('2025-12-31'));
    const lastLoginAt = status === 'active' 
      ? randomDate(new Date('2025-12-01'), new Date()) 
      : status === 'inactive'
        ? randomDate(new Date('2025-06-01'), new Date('2025-10-01'))
        : undefined;

    const user: User = {
      id: `usr_${i.toString().padStart(5, '0')}`,
      email,
      fullName,
      phone: Math.random() > 0.3 ? `+54 11 ${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
      role,
      clubId: club?.id,
      clubName: club?.name,
      status,
      emailVerified: status !== 'pending' && Math.random() > 0.1,
      createdAt,
      lastLoginAt,
      metrics: ['player', 'family'].includes(role) ? {
        totalSessions: Math.floor(Math.random() * 200),
        activeDays: Math.floor(Math.random() * 100),
        currentStreak: Math.floor(Math.random() * 30),
        totalXP: Math.floor(Math.random() * 5000),
      } : undefined,
    };

    users.push(user);
  }

  return users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function generateUserActivities(userId: string): UserActivity[] {
  const actions = [
    'Login',
    'Registro diario',
    'Chat con TINO',
    'Chat con ZAHIA',
    'Chat con ROMA',
    'Sesión completada',
    'Perfil actualizado',
    'Objetivo alcanzado',
    'Logro desbloqueado',
  ];

  const activities: UserActivity[] = [];
  const count = Math.floor(Math.random() * 10) + 5;

  for (let i = 0; i < count; i++) {
    activities.push({
      id: `act_${userId}_${i}`,
      userId,
      action: actions[Math.floor(Math.random() * actions.length)],
      timestamp: randomDate(new Date('2025-12-01'), new Date()),
    });
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const mockUsers = generateMockUsers(85);
export const mockClubs = CLUBS;
export const getUserActivities = generateUserActivities;
