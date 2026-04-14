import { ReactNode } from 'react';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { PageTransition } from './PageTransition';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { useDemo } from '@/contexts/DemoContext';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isDemoMode } = useDemo();

  return (
    <SidebarProvider defaultOpen={true}>
      {isDemoMode && <DemoBanner />}
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30 flex w-full",
        isDemoMode && "pt-10"
      )}>
        {/* Desktop Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 pb-20 lg:pb-8 px-4 lg:px-8 pt-6">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </SidebarProvider>
  );
};
