import { AppLayout } from '@/layouts/AppLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  KPICards,
  NewRegistrationsChart,
  RoleDistributionChart,
  AlertsDistribution,
  HealthMetricsPanel,
} from '@/components/admin/analytics';
import {
  Shield,
  ArrowRight,
  Users,
  Building2,
  MessageSquare,
  Calendar,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const {
    isLoading,
    kpis,
    newRegistrations,
    roleDistribution,
    alertDistribution,
    healthMetrics,
    clubMetrics,
  } = useAnalytics();

  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('id, title, description, type, avatar, created_at')
        .order('created_at', { ascending: false })
        .limit(8);
      if (data) setRecentNotifications(data);
    };
    fetchRecent();
  }, []);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Panel de Administración
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Resumen general del sistema NETIA
            </p>
          </div>
          <Link to="/admin/analytics">
            <Button variant="outline" className="gap-2">
              Ver Analíticas Completas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        {/* KPI Cards */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <KPICards kpis={kpis} />
        </motion.section>

        {/* Two-column grid: Registrations + Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <NewRegistrationsChart data={newRegistrations} />
          <RoleDistributionChart data={roleDistribution} />
        </motion.div>

        {/* Health Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <HealthMetricsPanel metrics={healthMetrics} />
        </motion.section>

        {/* Two-column grid: Alerts + Top Clubs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <AlertsDistribution data={alertDistribution} />

          {/* Top Clubs Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Clubes Principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {clubMetrics.length > 0 ? (
                clubMetrics.slice(0, 5).map((club, i) => (
                  <div key={club.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground w-5">
                        {i + 1}.
                      </span>
                      <span className="text-sm font-medium">{club.name}</span>
                    </div>
                    <Badge variant="secondary">{club.users} jugadores</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay clubes registrados
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              {recentNotifications.length > 0 ? (
                <div className="space-y-3">
                  {recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {n.type === 'ai_message' ? (
                          <MessageSquare className="h-4 w-4 text-primary" />
                        ) : n.type === 'session_complete' ? (
                          <Calendar className="h-4 w-4 text-primary" />
                        ) : (
                          <Users className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {n.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(n.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No hay actividad reciente
                </p>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Link to="/admin/users">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Gestionar Usuarios</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/analytics">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Ver Analíticas</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link to="/admin/settings">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="font-medium text-sm">Configuración</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
