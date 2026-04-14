import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  FileText, Users, Heart, Dumbbell, TrendingUp, Download, Loader2,
  Moon, Droplets, Zap, AlertTriangle, Trophy, Flame,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  BarChart, Bar, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend, CartesianGrid,
} from 'recharts';
import { useClubReports, type ReportPeriod } from '@/hooks/useClubReports';
import { cn } from '@/lib/utils';

const CHART_COLORS = {
  primary: 'hsl(211, 100%, 50%)',
  secondary: 'hsl(18, 100%, 61%)',
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
  blue: '#3b82f6',
  purple: '#8b5cf6',
};

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

const Reports = () => {
  const { isLoading, period, setPeriod, players, weeklyTrends, trafficDist, sessionData } = useClubReports();

  const handleExport = () => toast.success('Exportando reporte...');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const totalPlayers = players.length;

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
              <FileText className="h-6 w-6 text-primary" />
              Informes y Reportes
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Análisis del rendimiento de tu equipo
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">Última semana</SelectItem>
                <SelectItem value="2weeks">Últimas 2 semanas</SelectItem>
                <SelectItem value="4weeks">Último mes</SelectItem>
                <SelectItem value="8weeks">Últimos 2 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="attendance">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance" className="gap-1.5 text-xs sm:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Asistencia</span>
            </TabsTrigger>
            <TabsTrigger value="wellness" className="gap-1.5 text-xs sm:text-sm">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Bienestar</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-1.5 text-xs sm:text-sm">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Carga</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-1.5 text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Progreso</span>
            </TabsTrigger>
          </TabsList>

          {/* ── ATTENDANCE TAB ── */}
          <TabsContent value="attendance" className="space-y-6 mt-4">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{sessionData.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Sesiones</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{sessionData.attendanceRate}%</p>
                  <p className="text-xs text-muted-foreground">Asistencia</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{totalPlayers}</p>
                  <p className="text-xs text-muted-foreground">Jugadores</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{Math.round(sessionData.totalMinutes / 60)}h</p>
                  <p className="text-xs text-muted-foreground">Total horas</p>
                </CardContent>
              </Card>
            </div>

            {/* Sessions per week chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sesiones por Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="sessions" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} name="Sesiones" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Player attendance table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Asistencia por Jugador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Jugador</th>
                        <th className="text-center py-2 font-medium">Sesiones</th>
                        <th className="text-center py-2 font-medium">Asistencia</th>
                        <th className="text-right py-2 font-medium w-32">Barra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.sort((a, b) => b.attendanceRate - a.attendanceRate).map(p => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="py-2 font-medium">{p.name}</td>
                          <td className="py-2 text-center">{p.totalSessions}</td>
                          <td className="py-2 text-center">
                            <Badge variant={p.attendanceRate >= 80 ? 'default' : p.attendanceRate >= 50 ? 'secondary' : 'destructive'}>
                              {p.attendanceRate}%
                            </Badge>
                          </td>
                          <td className="py-2">
                            <Progress value={p.attendanceRate} className="h-2" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── WELLNESS TAB ── */}
          <TabsContent value="wellness" className="space-y-6 mt-4">
            {/* Traffic light distribution */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{trafficDist.green}</p>
                  <p className="text-xs text-muted-foreground">Óptimo</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{trafficDist.yellow}</p>
                  <p className="text-xs text-muted-foreground">Precaución</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{trafficDist.red}</p>
                  <p className="text-xs text-muted-foreground">Riesgo</p>
                </CardContent>
              </Card>
            </div>

            {/* Wellness trends chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tendencia de Bienestar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                      <Area type="monotone" dataKey="avgSleep" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} name="Sueño (h)" />
                      <Area type="monotone" dataKey="avgHydration" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.1} name="Hidratación (L)" />
                      <Area type="monotone" dataKey="avgEnergy" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} name="Energía" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar chart: team average wellness */}
            {totalPlayers > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Promedio del Equipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { axis: 'Sueño', value: Math.round(players.reduce((s, p) => s + p.avgSleep, 0) / totalPlayers * 10) / 10, max: 10 },
                          { axis: 'Hidratación', value: Math.round(players.reduce((s, p) => s + p.avgHydration, 0) / totalPlayers * 10) / 10, max: 4 },
                          { axis: 'Energía', value: Math.round(players.reduce((s, p) => s + p.avgEnergy, 0) / totalPlayers * 10) / 10, max: 5 },
                          { axis: 'Sin dolor', value: Math.round(10 - players.reduce((s, p) => s + p.avgPain, 0) / totalPlayers), max: 10 },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis tick={{ fontSize: 10 }} />
                        <Radar dataKey="value" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── TRAINING LOAD TAB ── */}
          <TabsContent value="training" className="space-y-6 mt-4">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{sessionData.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Sesiones</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{Math.round(sessionData.totalMinutes / 60)}h</p>
                  <p className="text-xs text-muted-foreground">Volumen total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{sessionData.avgRPE}</p>
                  <p className="text-xs text-muted-foreground">RPE promedio</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">{sessionData.byCategory.length}</p>
                  <p className="text-xs text-muted-foreground">Categorías</p>
                </CardContent>
              </Card>
            </div>

            {/* Load by category */}
            {sessionData.byCategory.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Carga por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sessionData.byCategory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar dataKey="sessions" fill={CHART_COLORS.primary} name="Sesiones" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="minutes" fill={CHART_COLORS.secondary} name="Minutos" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weekly volume trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Evolución de Volumen Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="totalMinutes" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.2} name="Minutos" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── PROGRESS TAB ── */}
          <TabsContent value="progress" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progreso Individual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Jugador</th>
                        <th className="text-center py-2 font-medium">Cat.</th>
                        <th className="text-center py-2 font-medium">
                          <Moon className="h-3.5 w-3.5 mx-auto" />
                        </th>
                        <th className="text-center py-2 font-medium">
                          <Droplets className="h-3.5 w-3.5 mx-auto" />
                        </th>
                        <th className="text-center py-2 font-medium">
                          <Zap className="h-3.5 w-3.5 mx-auto" />
                        </th>
                        <th className="text-center py-2 font-medium">
                          <AlertTriangle className="h-3.5 w-3.5 mx-auto" />
                        </th>
                        <th className="text-center py-2 font-medium">
                          <Trophy className="h-3.5 w-3.5 mx-auto" />
                        </th>
                        <th className="text-center py-2 font-medium">
                          <Flame className="h-3.5 w-3.5 mx-auto" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.sort((a, b) => b.xp - a.xp).map(p => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-2.5 font-medium">{p.name}</td>
                          <td className="py-2.5 text-center">
                            <Badge variant="outline" className="text-xs">{p.category}</Badge>
                          </td>
                          <td className={cn("py-2.5 text-center", p.avgSleep >= 7 ? 'text-green-600' : p.avgSleep >= 6 ? 'text-yellow-600' : 'text-red-600')}>
                            {p.avgSleep}h
                          </td>
                          <td className={cn("py-2.5 text-center", p.avgHydration >= 1.5 ? 'text-green-600' : p.avgHydration >= 1 ? 'text-yellow-600' : 'text-red-600')}>
                            {p.avgHydration}L
                          </td>
                          <td className={cn("py-2.5 text-center", p.avgEnergy >= 3 ? 'text-green-600' : p.avgEnergy >= 2 ? 'text-yellow-600' : 'text-red-600')}>
                            {p.avgEnergy}
                          </td>
                          <td className={cn("py-2.5 text-center", p.avgPain <= 3 ? 'text-green-600' : p.avgPain <= 5 ? 'text-yellow-600' : 'text-red-600')}>
                            {p.avgPain}
                          </td>
                          <td className="py-2.5 text-center font-medium">{p.xp} XP</td>
                          <td className="py-2.5 text-center">
                            {p.streak > 0 ? (
                              <span className="text-orange-500 font-medium">{p.streak}d</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {players.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No hay jugadores en tu club
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Reports;
