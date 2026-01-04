import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AlertDistribution {
  type: string;
  count: number;
  percentage: number;
}

interface AlertsDistributionProps {
  data: AlertDistribution[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const AlertsDistribution = ({ data }: AlertsDistributionProps) => {
  const total = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Distribución de Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm">{item.type}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Total: <span className="font-semibold text-foreground">{total}</span> alertas/semana
        </p>
      </CardContent>
    </Card>
  );
};
