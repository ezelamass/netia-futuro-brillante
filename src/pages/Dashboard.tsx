import { AppLayout } from '@/layouts/AppLayout';
import { TodayCard } from '@/components/dashboard/TodayCard';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { SailingCalendarWidget } from '@/components/dashboard/SailingCalendarWidget';
import { HealthWidget } from '@/components/dashboard/HealthWidget';
import { TechniqueWidget } from '@/components/dashboard/TechniqueWidget';
import { PhysicalTrainingWidget } from '@/components/dashboard/PhysicalTrainingWidget';
import { EvolutionWidget } from '@/components/dashboard/EvolutionWidget';
import { GamificationWidget } from '@/components/dashboard/GamificationWidget';
import { JoinClubModal } from '@/components/enrollment/JoinClubModal';
import { EnrollmentsList } from '@/components/enrollment/EnrollmentsList';

const Dashboard = () => {
  return (
    <AppLayout>
      {/* Hero - Today Card */}
      <div className="mb-6">
        <TodayCard />
      </div>

      {/* Club Enrollment */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-end">
          <JoinClubModal />
        </div>
        <EnrollmentsList />
      </div>

      {/* Gamification + Progress Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <GamificationWidget delay={0.05} />
        <ProgressWidget
          userName="Mateo"
          sport="Fútbol"
          age={12}
          streak={8}
          weeklyCompliance={88}
          delay={0.1}
        />
      </div>

      {/* Second Row - Health and Sailing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HealthWidget
          hydration={2.4}
          sleep="8h 10m"
          recovery="optimal"
          delay={0.2}
        />
        <SailingCalendarWidget
          hoursNavigated={6.5}
          averageSpeed={4.3}
          windDirection="NW"
          windSpeed={12}
          successfulManeuvers={8}
          delay={0.25}
        />
      </div>

      {/* Third Row - Technique and Physical */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TechniqueWidget
          correctDecisions={76}
          concentration={8.5}
          reactionTime={0.58}
          delay={0.3}
        />
        <PhysicalTrainingWidget
          maxSpeed={27}
          resistance={3}
          attendance={{ completed: 3, total: 3 }}
          delay={0.35}
        />
      </div>

      {/* Evolution */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <EvolutionWidget
          physical={8}
          technique={5}
          mental={3}
          delay={0.4}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
