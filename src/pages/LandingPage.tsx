import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <LandingNavbar />
        <HeroSection />
        <StatsSection />
        <VisionSection />
        <CampusSection />
        <AvatarsSection />
        <ParentalControlSection />
        <CtaBanner />
        <LandingFooter />
      </div>
    </PageTransition>
  );
};

export default LandingPage;
