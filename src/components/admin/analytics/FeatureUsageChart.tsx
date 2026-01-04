import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureUsage {
  feature: string;
  percentage: number;
}

interface FeatureUsageChartProps {
  data: FeatureUsage[];
}

export const FeatureUsageChart = ({ data }: FeatureUsageChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Funciones Más Usadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-4">
                {index + 1}.
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.feature}</span>
                  <span className="text-sm font-medium">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
