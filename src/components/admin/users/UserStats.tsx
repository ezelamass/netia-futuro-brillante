import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface UserStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    newThisWeek: number;
    roleDistribution: {
      player: number;
      family: number;
      coach: number;
      other: number;
    };
  };
}

export function UserStats({ stats }: UserStatsProps) {
  const activePercentage = ((stats.active / stats.total) * 100).toFixed(1);
  const inactivePercentage = ((stats.inactive / stats.total) * 100).toFixed(1);

  const statCards = [
    {
      title: 'Total',
      value: stats.total.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Activos',
      value: stats.active.toLocaleString(),
      subtitle: `${activePercentage}%`,
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Inactivos',
      value: stats.inactive.toLocaleString(),
      subtitle: `${inactivePercentage}%`,
      icon: UserX,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: 'Nuevos',
      value: stats.newThisWeek.toLocaleString(),
      subtitle: 'esta semana',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
  ];

  const roleData = [
    { label: 'Jugadores', value: stats.roleDistribution.player, color: 'bg-primary' },
    { label: 'Familias', value: stats.roleDistribution.family, color: 'bg-purple-500' },
    { label: 'Entrenadores', value: stats.roleDistribution.coach, color: 'bg-green-500' },
    { label: 'Otros', value: stats.roleDistribution.other, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">Distribución por Rol</h4>
          <div className="space-y-3">
            {roleData.map(role => {
              const percentage = (role.value / stats.total) * 100;
              return (
                <div key={role.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{role.label}</span>
                    <span className="font-medium">{role.value} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <Progress value={percentage} className={`h-2 [&>div]:${role.color}`} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
