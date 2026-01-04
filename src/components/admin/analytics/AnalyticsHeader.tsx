import { BarChart3, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PeriodFilter, RegionFilter } from '@/hooks/useAnalytics';

interface AnalyticsHeaderProps {
  lastUpdated: Date;
  period: PeriodFilter;
  region: RegionFilter;
  regions: string[];
  onPeriodChange: (value: PeriodFilter) => void;
  onRegionChange: (value: RegionFilter) => void;
  onExport: (format: 'pdf' | 'csv' | 'png') => void;
}

export const AnalyticsHeader = ({
  lastUpdated,
  period,
  region,
  regions,
  onPeriodChange,
  onRegionChange,
  onExport,
}: AnalyticsHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <RefreshCw className="h-3 w-3" />
            Datos actualizados: {format(lastUpdated, "dd/MM/yyyy HH:mm", { locale: es })}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-muted/30 p-4 rounded-lg border">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Período:</span>
            <Select value={period} onValueChange={(v) => onPeriodChange(v as PeriodFilter)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="7days">Últimos 7 días</SelectItem>
                <SelectItem value="30days">Últimos 30 días</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Último trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Región:</span>
            <Select value={region} onValueChange={(v) => onRegionChange(v as RegionFilter)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport('pdf')}>
              Exportar PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('csv')}>
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('png')}>
              Exportar gráficos (PNG)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
