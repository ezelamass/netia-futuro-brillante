import { ReactNode } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { PageTransition } from './PageTransition';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      <div className="lg:ml-64">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="pb-20 lg:pb-8 px-4 lg:px-8 pt-6">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
