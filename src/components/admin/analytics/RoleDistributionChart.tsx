import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RoleDistribution {
  role: string;
  percentage: number;
  count: number;
}

interface RoleDistributionChartProps {
  data: RoleDistribution[];
}

export const RoleDistributionChart = ({ data }: RoleDistributionChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribución por Rol</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{item.role}</span>
              <span className="text-muted-foreground">{item.percentage}%</span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
