import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RetentionData {
  period: string;
  percentage: number;
}

interface RetentionChartProps {
  data: RetentionData[];
}

export const RetentionChart = ({ data }: RetentionChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Retención por Cohorte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-20">{item.period}:</span>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary/80 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${item.percentage}%` }}
                  >
                    <span className="text-xs font-medium text-primary-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
