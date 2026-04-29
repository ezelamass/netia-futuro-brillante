import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { PageTransition } from '@/layouts/PageTransition';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import VisionSection from '@/components/landing/VisionSection';
import CampusSection from '@/components/landing/CampusSection';
import AvatarsSection from '@/components/landing/AvatarsSection';
import ParentalControlSection from '@/components/landing/ParentalControlSection';
import CtaBanner from '@/components/landing/CtaBanner';
import LandingFooter from '@/components/landing/LandingFooter';
import { DemoRolePickerDialog } from '@/components/demo/DemoRolePickerDialog';
import { TourProvider, useTour } from '@/components/tour/TourProvider';

function LandingContent() {
  const { isAuthenticated } = useAuth();
  const { isDemoMode } = useDemo();
  const { startTour, isActive: tourActive, stopTour } = useTour();
  const navigate = useNavigate();
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isDemoMode) {
      // If the tour is active when an auth event fires (e.g. login in another
      // tab), close it first so its overlay doesn't get orphaned in the DOM
      // after this component unmounts.
      if (tourActive) stopTour();
      navigate('/dashboard');
    }
  }, [isAuthenticated, isDemoMode, navigate, tourActive, stopTour]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <LandingNavbar onDemoClick={() => setDemoDialogOpen(true)} onTourClick={startTour} />
        <HeroSection onDemoClick={() => setDemoDialogOpen(true)} />
        <StatsSection />
        <VisionSection />
        <CampusSection />
        <AvatarsSection />
        <ParentalControlSection />
        <CtaBanner onDemoClick={() => setDemoDialogOpen(true)} />
        <LandingFooter />
      </div>

      <DemoRolePickerDialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen} />
    </>
  );
}

const LandingPage = () => {
  return (
    <PageTransition>
      <TourProvider>
        <LandingContent />
      </TourProvider>
    </PageTransition>
  );
};

export default LandingPage;
