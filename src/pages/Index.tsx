import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { HeroCard } from '@/components/dashboard/HeroCard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { QuickActionBar } from '@/components/dashboard/QuickActionBar';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { BookOpen, Lightbulb, Brain, Beaker } from 'lucide-react';

const chartData = [
  { month: 'Ene', series1: 50, series2: 30 },
  { month: 'Feb', series1: 45, series2: 40 },
  { month: 'Mar', series1: 60, series2: 45 },
  { month: 'Abr', series1: 75, series2: 55 },
  { month: 'May', series1: 55, series2: 50 },
  { month: 'Jun', series1: 65, series2: 45 },
];

const quickActions = [
  {
    icon: BookOpen,
    title: 'Nivel de Disciplina',
    rating: 5,
    gradient: 'purple',
  },
  {
    icon: Brain,
    title: 'Pensamiento Crítico',
    rating: 4,
    gradient: 'pink',
  },
  {
    icon: Lightbulb,
    title: 'Resolución de Problemas',
    rating: 4,
    gradient: 'teal',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      <Sidebar />
      
      <main className="ml-20 p-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hero Card */}
          <div className="lg:col-span-2">
            <HeroCard
              userName="Umar"
              welcomeMessage="Qué bueno tenerte de vuelta"
              badge={{
                icon: <Beaker className="w-7 h-7 text-white" />,
                label: 'Predicado',
                title: 'Científico Boy',
              }}
            />
          </div>
          
          {/* Homework Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-display font-bold text-xl text-foreground mb-5">
              Tus tareas
            </h3>
            <div className="space-y-4">
              <MetricCard
                subject="Matemáticas"
                topic="Práctica de Conteo 1"
                progress={70}
                daysLeft={2}
                color="teal"
                delay={0.1}
              />
              <MetricCard
                subject="Arte"
                topic="Práctica de Colorear 2"
                progress={60}
                daysLeft={3}
                color="purple"
                delay={0.2}
              />
              <MetricCard
                subject="Química"
                topic="Introducción de elementos"
                progress={43}
                daysLeft={2}
                color="orange"
                delay={0.3}
              />
              <MetricCard
                subject="Biología"
                topic="Introducción del cuerpo"
                progress={50}
                daysLeft={2}
                color="blue"
                delay={0.4}
              />
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActionBar actions={quickActions} delay={0.2} />
        </div>
        
        {/* Activity Chart */}
        <ActivityCard
          title="Actividad de Aprendizaje"
          data={chartData}
          delay={0.4}
        />
      </main>
    </div>
  );
};

export default Index;
