import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface EngagementData {
  date: string;
  dau: number;
  dailyLogs: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

export const EngagementChart = ({ data }: EngagementChartProps) => {
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: format(parseISO(d.date), 'EEE', { locale: es }),
  }));

  // Take last 7 days
  const last7Days = formattedData.slice(-7);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Engagement Diario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7Days} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="dau" 
                name="DAU (Daily Active Users)"
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#colorDau)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="dailyLogs" 
                name="Registros diarios"
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1}
                fill="url(#colorLogs)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
