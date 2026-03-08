import { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Heart, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ClubKPIs {
  totalPlayers: number;
  activePlayers: number;
  pendingEnrollments: number;
  expiredClearances: number;
  avgStreak: number;
}

const ClubDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<ClubKPIs>({ totalPlayers: 0, activePlayers: 0, pendingEnrollments: 0, expiredClearances: 0, avgStreak: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchKPIs = useCallback(async () => {
    if (!user) return;

    // Get clubs where user is enrolled as coach/club_admin
    const { data: myEnrollments } = await supabase
      .from('enrollments')
      .select('club_id')
      .eq('user_id', user.id);

    const clubIds = myEnrollments?.map(e => e.club_id) || [];
    if (clubIds.length === 0) { setIsLoading(false); return; }

    // Get all enrollments for those clubs
    const { data: allEnrollments } = await supabase
      .from('enrollments')
      .select('user_id, status')
      .in('club_id', clubIds);

    const playerIds = allEnrollments?.map(e => e.user_id) || [];
    const totalPlayers = new Set(playerIds).size;
    const activePlayers = allEnrollments?.filter(e => e.status === 'active').length || 0;
    const pendingEnrollments = allEnrollments?.filter(e => e.status === 'pending').length || 0;

    // Get expired medical clearances
    let expiredClearances = 0;
    if (playerIds.length > 0) {
      const { count } = await supabase
        .from('medical_clearances')
        .select('id', { count: 'exact', head: true })
        .in('user_id', playerIds)
        .lt('expiry_date', new Date().toISOString().split('T')[0]);
      expiredClearances = count || 0;
    }

    // Get avg streak from player_stats
    let avgStreak = 0;
    if (playerIds.length > 0) {
      const { data: stats } = await supabase
        .from('player_stats')
        .select('current_streak')
        .in('user_id', playerIds);
      if (stats && stats.length > 0) {
        avgStreak = Math.round(stats.reduce((sum, s) => sum + s.current_streak, 0) / stats.length);
      }
    }

    setKpis({ totalPlayers, activePlayers, pendingEnrollments, expiredClearances, avgStreak });
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchKPIs(); }, [fetchKPIs]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-2">
            <Building2 className="w-8 h-8" /> Panel del Club
          </h1>
          <p className="text-muted-foreground">Gestión y seguimiento del equipo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Jugadores totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpis.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">{kpis.activePlayers} activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inscripciones pendientes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{kpis.pendingEnrollments}</div>
              <p className="text-xs text-muted-foreground">Requieren aprobación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aptos vencidos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${kpis.expiredClearances > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                {kpis.expiredClearances}
              </div>
              <p className="text-xs text-muted-foreground">
                {kpis.expiredClearances > 0 ? 'Requieren atención' : 'Todo en orden'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Racha promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpis.avgStreak}</div>
              <p className="text-xs text-muted-foreground">Días de constancia promedio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Apto Médico</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {kpis.totalPlayers > 0 ? Math.round(((kpis.totalPlayers - kpis.expiredClearances) / kpis.totalPlayers) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Cobertura de aptos vigentes</p>
            </CardContent>
          </Card>
        </div>

        {kpis.totalPlayers === 0 && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin jugadores aún</h3>
              <p className="text-muted-foreground max-w-md">
                Comparte el código de invitación de tu club para que los jugadores se inscriban.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ClubDashboard;
