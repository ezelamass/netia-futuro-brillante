import { AppLayout } from '@/layouts/AppLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';
import {
  AnalyticsHeader,
  KPICards,
  UserGrowthChart,
  NewRegistrationsChart,
  RoleDistributionChart,
  EngagementChart,
  FeatureUsageChart,
  RetentionChart,
  HealthMetricsPanel,
  AlertsDistribution,
  WellnessTrendChart,
  SportCategoryTable,
  TopClubsTable,
} from '@/components/admin/analytics';

const Analytics = () => {
  const {
    filters,
    updateFilter,
    lastUpdated,
    kpis,
    timeSeriesData,
    engagementData,
    featureUsage,
    retentionData,
    alertDistribution,
    sportMetrics,
    categoryMetrics,
    clubMetrics,
    wellnessTrend,
    newRegistrations,
    roleDistribution,
    healthMetrics,
    regions,
  } = useAnalytics();

  const handleExport = (format: 'pdf' | 'csv' | 'png') => {
    toast.success(`Exportando en formato ${format.toUpperCase()}...`);
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <AnalyticsHeader
          lastUpdated={lastUpdated}
          period={filters.period}
          region={filters.region}
          regions={regions}
          onPeriodChange={(value) => updateFilter('period', value)}
          onRegionChange={(value) => updateFilter('region', value)}
          onExport={handleExport}
        />

        {/* Privacy disclaimer */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border text-sm text-muted-foreground">
          <Shield className="h-4 w-4 shrink-0" />
          <span>
            Todos los datos de salud son agregados y anónimos. Se requiere un mínimo de 10 usuarios para mostrar métricas de grupo.
          </span>
        </div>

        {/* KPI Cards */}
        <section>
          <KPICards kpis={kpis} />
        </section>

        {/* Users & Growth Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Usuarios y Crecimiento</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <UserGrowthChart data={timeSeriesData} />
            <div className="space-y-6">
              <NewRegistrationsChart data={newRegistrations} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RoleDistributionChart data={roleDistribution} />
          </div>
        </section>

        {/* Engagement Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Engagement</h2>
          <EngagementChart data={engagementData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FeatureUsageChart data={featureUsage} />
            <RetentionChart data={retentionData} />
          </div>
        </section>

        {/* Health Metrics Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Salud de Atletas</h2>
          <HealthMetricsPanel metrics={healthMetrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsDistribution data={alertDistribution} />
            <WellnessTrendChart data={wellnessTrend} />
          </div>
        </section>

        {/* Sport & Category Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Por Deporte y Categoría</h2>
          <SportCategoryTable sportData={sportMetrics} categoryData={categoryMetrics} />
        </section>

        {/* Clubs Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Clubes</h2>
          <TopClubsTable data={clubMetrics} />
        </section>
      </div>
    </AppLayout>
  );
};

export default Analytics;
