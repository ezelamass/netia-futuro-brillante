import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface NewRegistrations {
  day: string;
  count: number;
}

interface NewRegistrationsChartProps {
  data: NewRegistrations[];
}

export const NewRegistrationsChart = ({ data }: NewRegistrationsChartProps) => {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nuevos Registros (7 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value} registros`, '']}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count === maxCount ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Total: <span className="font-semibold text-foreground">{total}</span> nuevos
        </p>
      </CardContent>
    </Card>
  );
};
