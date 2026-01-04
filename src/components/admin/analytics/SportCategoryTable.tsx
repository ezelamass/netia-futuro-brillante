import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type HealthStatus = 'green' | 'yellow' | 'red';

interface SportMetric {
  sport: string;
  users: number;
  sessionsPerWeek: number;
  avgRPE: number;
  healthScore: number;
  healthStatus: HealthStatus;
}

interface CategoryMetric {
  category: string;
  users: number;
  sessionsPerWeek: number;
  avgSleep: number;
  healthScore: number;
  healthStatus: HealthStatus;
}

interface SportCategoryTableProps {
  sportData: SportMetric[];
  categoryData: CategoryMetric[];
}

const HealthIndicator = ({ status }: { status: HealthStatus }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-3 h-3 rounded-full",
        status === 'green' && "bg-emerald-500",
        status === 'yellow' && "bg-amber-500",
        status === 'red' && "bg-red-500"
      )} />
    </div>
  );
};

export const SportCategoryTable = ({ sportData, categoryData }: SportCategoryTableProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Métricas por Deporte</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deporte</TableHead>
                <TableHead className="text-right">Usuarios</TableHead>
                <TableHead className="text-right">Ses/sem</TableHead>
                <TableHead className="text-right">RPE</TableHead>
                <TableHead className="text-center">Salud</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sportData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.sport}</TableCell>
                  <TableCell className="text-right">{row.users}</TableCell>
                  <TableCell className="text-right">{row.sessionsPerWeek}</TableCell>
                  <TableCell className="text-right">{row.avgRPE}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <HealthIndicator status={row.healthStatus} />
                      <span className="text-sm">{row.healthScore}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Métricas por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Usuarios</TableHead>
                <TableHead className="text-right">Ses/sem</TableHead>
                <TableHead className="text-right">Sueño</TableHead>
                <TableHead className="text-center">Salud</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell className="text-right">{row.users}</TableCell>
                  <TableCell className="text-right">{row.sessionsPerWeek}</TableCell>
                  <TableCell className="text-right">{row.avgSleep}h</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <HealthIndicator status={row.healthStatus} />
                      <span className="text-sm">{row.healthScore}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
