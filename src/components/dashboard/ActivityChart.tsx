import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { month: 'Ene', series1: 50, series2: 30 },
  { month: 'Feb', series1: 45, series2: 40 },
  { month: 'Mar', series1: 60, series2: 45 },
  { month: 'Abr', series1: 75, series2: 55 },
  { month: 'May', series1: 55, series2: 50 },
  { month: 'Jun', series1: 65, series2: 45 },
];

export const ActivityChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-xl text-foreground">
          Actividad de Aprendizaje
        </h3>
        <select className="px-4 py-2 rounded-lg bg-secondary text-foreground border-none font-medium text-sm">
          <option>3er Semestre</option>
          <option>2do Semestre</option>
          <option>1er Semestre</option>
        </select>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="series1"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="series2"
              stroke="#EC4899"
              strokeWidth={3}
              dot={{ fill: '#EC4899', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Tooltip indicator showing on April */}
      <div className="mt-4 flex justify-center">
        <div className="bg-primary/10 px-4 py-2 rounded-lg">
          <p className="text-primary font-semibold text-sm">65 hrs en Abr</p>
        </div>
      </div>
    </motion.div>
  );
};
