import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface DataPoint {
  month: string;
  series1: number;
  series2: number;
}

interface ActivityCardProps {
  title: string;
  data: DataPoint[];
  selectedPeriod?: string;
  periods?: string[];
  onPeriodChange?: (period: string) => void;
  delay?: number;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white px-4 py-3 rounded-xl shadow-xl border border-border/50"
      >
        <p className="text-primary font-bold text-sm">
          {payload[0].value} hrs
        </p>
      </motion.div>
    );
  }
  return null;
};

export const ActivityCard = ({
  title,
  data,
  selectedPeriod = '3er Semestre',
  periods = ['1er Semestre', '2do Semestre', '3er Semestre'],
  onPeriodChange,
  delay = 0,
}: ActivityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display font-bold text-2xl text-foreground">
          {title}
        </h3>

        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange?.(e.target.value)}
            className="appearance-none px-5 py-2.5 pr-10 rounded-xl bg-secondary text-foreground border-none font-semibold text-sm cursor-pointer hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              style={{
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
              }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{
                fontSize: '13px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
              }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#8B5CF6', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Line
              type="monotone"
              dataKey="series1"
              stroke="#8B5CF6"
              strokeWidth={4}
              dot={{
                fill: '#8B5CF6',
                r: 5,
                strokeWidth: 0,
              }}
              activeDot={{
                r: 7,
                fill: '#8B5CF6',
                strokeWidth: 3,
                stroke: '#fff',
              }}
            />
            <Line
              type="monotone"
              dataKey="series2"
              stroke="#EC4899"
              strokeWidth={4}
              dot={{
                fill: '#EC4899',
                r: 5,
                strokeWidth: 0,
              }}
              activeDot={{
                r: 7,
                fill: '#EC4899',
                strokeWidth: 3,
                stroke: '#fff',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3 }}
        className="flex justify-center mt-6"
      >
        <div className="bg-primary/10 backdrop-blur-sm px-5 py-2.5 rounded-xl border border-primary/20">
          <p className="text-primary font-bold text-sm">
            65 hrs en {data[3]?.month || 'Abr'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
