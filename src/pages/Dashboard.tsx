import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { SailingCalendarWidget } from '@/components/dashboard/SailingCalendarWidget';
import { HealthWidget } from '@/components/dashboard/HealthWidget';
import { TechniqueWidget } from '@/components/dashboard/TechniqueWidget';
import { PhysicalTrainingWidget } from '@/components/dashboard/PhysicalTrainingWidget';
import { EvolutionWidget } from '@/components/dashboard/EvolutionWidget';
import { PageTransition } from '@/layouts/PageTransition';

const Dashboard = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
        <Sidebar />
        
        <main className="ml-20 p-8">
          <Header />
          
          {/* First Row - Progress and Sailing Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ProgressWidget
              userName="Mateo"
              sport="Fútbol"
              age={12}
              streak={8}
              weeklyCompliance={88}
              delay={0.1}
            />
            
            <SailingCalendarWidget
              hoursNavigated={6.5}
              averageSpeed={4.3}
              windDirection="NW"
              windSpeed={12}
              successfulManeuvers={8}
              delay={0.2}
            />
          </div>

          {/* Second Row - Health and Technique */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <HealthWidget
              hydration={2.4}
              sleep="8h 10m"
              recovery="optimal"
              delay={0.3}
            />
            
            <TechniqueWidget
              correctDecisions={76}
              concentration={8.5}
              reactionTime={0.58}
              delay={0.4}
            />
          </div>

          {/* Third Row - Physical Training and Evolution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <PhysicalTrainingWidget
              maxSpeed={27}
              resistance={3}
              attendance={{ completed: 3, total: 3 }}
              delay={0.5}
            />
            
            <EvolutionWidget
              physical={8}
              technique={5}
              mental={3}
              delay={0.6}
            />
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
