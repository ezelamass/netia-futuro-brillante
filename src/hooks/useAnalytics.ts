import { useState, useMemo } from 'react';

export type PeriodFilter = 'today' | '7days' | '30days' | 'month' | 'quarter' | 'year';
export type RegionFilter = 'all' | string;
export type SportFilter = 'all' | 'tennis' | 'football' | 'skating' | 'golf' | 'other';
export type CategoryFilter = 'all' | 'U10' | 'U12' | 'U14' | 'U16';

interface AnalyticsFilters {
  period: PeriodFilter;
  region: RegionFilter;
  sport: SportFilter;
  category: CategoryFilter;
}

interface KPI {
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: string;
}

interface TimeSeriesData {
  date: string;
  totalUsers: number;
  activeUsers: number;
  dau: number;
  dailyLogs: number;
}

interface FeatureUsage {
  feature: string;
  percentage: number;
}

interface RetentionData {
  period: string;
  percentage: number;
}

interface AlertDistribution {
  type: string;
  count: number;
  percentage: number;
}

interface SportMetric {
  sport: string;
  users: number;
  sessionsPerWeek: number;
  avgRPE: number;
  healthScore: number;
  healthStatus: 'green' | 'yellow' | 'red';
}

interface CategoryMetric {
  category: string;
  users: number;
  sessionsPerWeek: number;
  avgSleep: number;
  healthScore: number;
  healthStatus: 'green' | 'yellow' | 'red';
}

interface ClubMetric {
  id: string;
  name: string;
  users: number;
  sessionsPerWeek: number;
  healthStatus: 'green' | 'yellow' | 'red';
}

interface WellnessTrend {
  week: string;
  percentage: number;
}

interface NewRegistrations {
  day: string;
  count: number;
}

interface RoleDistribution {
  role: string;
  percentage: number;
  count: number;
}

// Generate mock time series data
const generateTimeSeriesData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const baseDate = new Date('2025-10-01');
  let totalUsers = 600;
  
  for (let i = 0; i < 120; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    totalUsers += Math.floor(Math.random() * 15) + 5;
    const activeUsers = Math.floor(totalUsers * (0.7 + Math.random() * 0.2));
    const dau = Math.floor(activeUsers * (0.25 + Math.random() * 0.15));
    const dailyLogs = Math.floor(dau * (0.6 + Math.random() * 0.3));
    
    data.push({
      date: date.toISOString().split('T')[0],
      totalUsers,
      activeUsers,
      dau,
      dailyLogs,
    });
  }
  
  return data;
};

const mockTimeSeriesData = generateTimeSeriesData();

const mockKPIs: KPI[] = [
  { label: 'Usuarios Activos', value: 1180, change: 12, changeLabel: 'vs mes anterior', icon: 'users' },
  { label: 'DAU', value: 342, change: 8, changeLabel: 'vs semana anterior', icon: 'activity' },
  { label: 'Retención 7d', value: '78%', change: 3, changeLabel: 'vs mes anterior', icon: 'flame' },
  { label: 'Sesiones/Semana', value: 4.2, change: -2.3, changeLabel: 'vs semana anterior', icon: 'clock' },
  { label: 'Salud Promedio', value: '82%', change: 5, changeLabel: 'vs mes anterior', icon: 'heart' },
];

const mockFeatureUsage: FeatureUsage[] = [
  { feature: 'Registro diario', percentage: 78 },
  { feature: 'Chat con avatares', percentage: 65 },
  { feature: 'Calendario', percentage: 52 },
  { feature: 'Ver logros', percentage: 41 },
  { feature: 'Perfil', percentage: 38 },
];

const mockRetentionData: RetentionData[] = [
  { period: 'Semana 1', percentage: 95 },
  { period: 'Semana 2', percentage: 85 },
  { period: 'Semana 4', percentage: 78 },
  { period: 'Mes 1', percentage: 65 },
  { period: 'Mes 3', percentage: 48 },
];

const mockAlertDistribution: AlertDistribution[] = [
  { type: 'Sueño bajo', count: 55, percentage: 35 },
  { type: 'Hidratación', count: 44, percentage: 28 },
  { type: 'Dolor alto', count: 28, percentage: 18 },
  { type: 'Inactividad', count: 23, percentage: 15 },
  { type: 'Otro', count: 6, percentage: 4 },
];

const mockSportMetrics: SportMetric[] = [
  { sport: 'Tenis', users: 520, sessionsPerWeek: 4.5, avgRPE: 6.2, healthScore: 85, healthStatus: 'green' },
  { sport: 'Fútbol', users: 380, sessionsPerWeek: 3.8, avgRPE: 6.8, healthScore: 82, healthStatus: 'green' },
  { sport: 'Patín', users: 150, sessionsPerWeek: 4.2, avgRPE: 5.9, healthScore: 75, healthStatus: 'yellow' },
  { sport: 'Golf', users: 80, sessionsPerWeek: 3.0, avgRPE: 4.5, healthScore: 88, healthStatus: 'green' },
  { sport: 'Otros', users: 50, sessionsPerWeek: 3.5, avgRPE: 6.1, healthScore: 80, healthStatus: 'green' },
];

const mockCategoryMetrics: CategoryMetric[] = [
  { category: 'U10', users: 180, sessionsPerWeek: 3.2, avgSleep: 8.5, healthScore: 90, healthStatus: 'green' },
  { category: 'U12', users: 290, sessionsPerWeek: 3.8, avgSleep: 7.8, healthScore: 85, healthStatus: 'green' },
  { category: 'U14', users: 350, sessionsPerWeek: 4.5, avgSleep: 7.1, healthScore: 78, healthStatus: 'yellow' },
  { category: 'U16', users: 280, sessionsPerWeek: 4.8, avgSleep: 6.8, healthScore: 72, healthStatus: 'yellow' },
];

const mockClubMetrics: ClubMetric[] = [
  { id: '1', name: 'Club Tenis Norte', users: 185, sessionsPerWeek: 4.8, healthStatus: 'green' },
  { id: '2', name: 'Escuela Fútbol Sur', users: 142, sessionsPerWeek: 4.2, healthStatus: 'green' },
  { id: '3', name: 'Academia Patín Este', users: 89, sessionsPerWeek: 4.5, healthStatus: 'yellow' },
  { id: '4', name: 'Club Deportivo Centro', users: 76, sessionsPerWeek: 3.9, healthStatus: 'green' },
  { id: '5', name: 'Escuela Golf West', users: 54, sessionsPerWeek: 3.2, healthStatus: 'green' },
];

const mockWellnessTrend: WellnessTrend[] = [
  { week: 'S1', percentage: 75 },
  { week: 'S2', percentage: 78 },
  { week: 'S3', percentage: 82 },
  { week: 'S4', percentage: 80 },
  { week: 'S5', percentage: 85 },
  { week: 'S6', percentage: 83 },
  { week: 'S7', percentage: 82 },
];

const mockNewRegistrations: NewRegistrations[] = [
  { day: 'Lun', count: 23 },
  { day: 'Mar', count: 18 },
  { day: 'Mié', count: 31 },
  { day: 'Jue', count: 27 },
  { day: 'Vie', count: 22 },
  { day: 'Sáb', count: 35 },
  { day: 'Dom', count: 29 },
];

const mockRoleDistribution: RoleDistribution[] = [
  { role: 'Jugadores', percentage: 69, count: 814 },
  { role: 'Familias', percentage: 23, count: 271 },
  { role: 'Coaches', percentage: 4, count: 47 },
  { role: 'Otros', percentage: 4, count: 48 },
];

const mockHealthMetrics = {
  avgSleep: 7.2,
  sleepChange: 0.3,
  avgHydration: 1.4,
  hydrationChange: 0.2,
  painFreePercentage: 82,
  painFreeChange: -2,
  totalAlerts: 156,
  alertsChange: -12,
};

const regions = [
  'Buenos Aires',
  'Córdoba',
  'Santa Fe',
  'Mendoza',
  'Tucumán',
];

export const useAnalytics = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    period: '7days',
    region: 'all',
    sport: 'all',
    category: 'all',
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateFilter = <K extends keyof AnalyticsFilters>(
    key: K,
    value: AnalyticsFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredTimeSeriesData = useMemo(() => {
    const now = new Date('2026-01-03');
    let daysBack = 7;
    
    switch (filters.period) {
      case 'today':
        daysBack = 1;
        break;
      case '7days':
        daysBack = 7;
        break;
      case '30days':
        daysBack = 30;
        break;
      case 'month':
        daysBack = 30;
        break;
      case 'quarter':
        daysBack = 90;
        break;
      case 'year':
        daysBack = 365;
        break;
    }
    
    return mockTimeSeriesData.slice(-daysBack);
  }, [filters.period]);

  const engagementData = useMemo(() => {
    return filteredTimeSeriesData.map((d) => ({
      date: d.date,
      dau: d.dau,
      dailyLogs: d.dailyLogs,
    }));
  }, [filteredTimeSeriesData]);

  const lastUpdated = new Date('2026-01-03T10:00:00');

  return {
    filters,
    updateFilter,
    isLoading,
    lastUpdated,
    kpis: mockKPIs,
    timeSeriesData: filteredTimeSeriesData,
    engagementData,
    featureUsage: mockFeatureUsage,
    retentionData: mockRetentionData,
    alertDistribution: mockAlertDistribution,
    sportMetrics: mockSportMetrics,
    categoryMetrics: mockCategoryMetrics,
    clubMetrics: mockClubMetrics,
    wellnessTrend: mockWellnessTrend,
    newRegistrations: mockNewRegistrations,
    roleDistribution: mockRoleDistribution,
    healthMetrics: mockHealthMetrics,
    regions,
  };
};
