import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
import { SkillCard } from '@/components/dashboard/SkillCard';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { BookOpen, Lightbulb, Brain } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      <Sidebar />
      
      <main className="ml-20 p-8">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <WelcomeCard />
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-display font-bold text-xl text-foreground mb-4">
              Tus tareas
            </h3>
            <div className="space-y-4">
              <ProgressCard
                subject="Matemáticas"
                topic="Práctica de Conteo 1"
                progress={70}
                daysLeft={2}
                color="teal"
                delay={0.1}
              />
              <ProgressCard
                subject="Arte"
                topic="Práctica de Colorear 2"
                progress={60}
                daysLeft={3}
                color="purple"
                delay={0.2}
              />
              <ProgressCard
                subject="Química"
                topic="Introducción de elementos"
                progress={43}
                daysLeft={2}
                color="orange"
                delay={0.3}
              />
              <ProgressCard
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SkillCard
            icon={BookOpen}
            title="Nivel de Disciplina"
            rating={5}
            iconBg="bg-primary"
            delay={0.1}
          />
          <SkillCard
            icon={Brain}
            title="Pensamiento Crítico"
            rating={4}
            iconBg="gradient-pink"
            delay={0.2}
          />
          <SkillCard
            icon={Lightbulb}
            title="Resolución de Problemas"
            rating={4}
            iconBg="gradient-teal"
            delay={0.3}
          />
        </div>
        
        <ActivityChart />
      </main>
    </div>
  );
};

export default Index;
