import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Flame, Moon } from 'lucide-react';
import { useFamilyLinks } from '@/hooks/useFamilyLinks';
import { supabase } from '@/integrations/supabase/client';
import { FamilyLinksList } from '@/components/family/FamilyLinksList';
import { LinkChildModal } from '@/components/family/LinkChildModal';

interface ChildStats {
  currentStreak: number;
  totalLogs: number;
  lastMood: string | null;
  lastSleep: number | null;
}

const ParentChild = () => {
  const { childId: childIdParam } = useParams<{ childId: string }>();
  const { links, fetchLinks } = useFamilyLinks();
  const [stats, setStats] = useState<ChildStats | null>(null);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  // Use URL param if available, otherwise fall back to first linked child
  const activeChildId = childIdParam || (links.length > 0 ? links[0].childId : null);
  const activeChild = links.find(l => l.childId === activeChildId);

  useEffect(() => {
    if (!activeChildId) return;
    const childId = activeChildId;

    const loadStats = async () => {
      const [{ data: playerStats }, { data: lastLog }] = await Promise.all([
        supabase.from('player_stats').select('current_streak, total_logs').eq('user_id', childId).maybeSingle(),
        supabase.from('daily_logs').select('mood, sleep_hours').eq('user_id', childId).order('log_date', { ascending: false }).limit(1).maybeSingle(),
      ]);

      setStats({
        currentStreak: playerStats?.current_streak ?? 0,
        totalLogs: playerStats?.total_logs ?? 0,
        lastMood: lastLog?.mood ?? null,
        lastSleep: lastLog?.sleep_hours ?? null,
      });
    };
    loadStats();
  }, [activeChildId]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-heading">{activeChild?.childName || 'Mi Hijo/a'}</h1>
            <p className="text-muted-foreground">Actividad, bienestar y progreso</p>
          </div>
          <LinkChildModal />
        </div>

        {links.length > 0 && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Flame className="h-4 w-4 text-orange-500" /> Racha
                </CardTitle>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.currentStreak} días</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Activity className="h-4 w-4 text-primary" /> Registros
                </CardTitle>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.totalLogs}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Moon className="h-4 w-4 text-indigo-500" /> Último sueño
                </CardTitle>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.lastSleep ? `${stats.lastSleep}h` : '—'}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Último ánimo</CardTitle>
              </CardHeader>
              <CardContent><div className="text-2xl">{stats.lastMood || '—'}</div></CardContent>
            </Card>
          </div>
        )}

        <FamilyLinksList />

        {links.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin hijos vinculados</h3>
              <p className="text-muted-foreground max-w-md">
                Usá el botón "Vincular hijo/a" para conectar a tu hijo/a y ver su actividad deportiva.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ParentChild;
