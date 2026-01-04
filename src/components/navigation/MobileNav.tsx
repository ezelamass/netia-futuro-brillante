import { Home, Dumbbell, Calendar, MessageCircle, Award, Building2, Users, BarChart3, Shield, UserCog } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

// Navigation items for PLAYER role only
const playerNavItems: NavItem[] = [
  { label: 'Inicio', icon: Home, href: '/dashboard' },
  { label: 'Entrenar', icon: Dumbbell, href: '/training' },
  { label: 'Calendario', icon: Calendar, href: '/calendar' },
  { label: 'Chat IA', icon: MessageCircle, href: '/chat', badge: 3 },
  { label: 'Logros', icon: Award, href: '/achievements' },
];

// Navigation items for CLUB role (coach) only
const clubNavItems: NavItem[] = [
  { label: 'Panel', icon: Building2, href: '/club/dashboard' },
  { label: 'Jugadores', icon: Users, href: '/club/roster' },
  { label: 'Carga', icon: BarChart3, href: '/club/training-load' },
  { label: 'Informes', icon: Dumbbell, href: '/club/reports' },
  { label: 'Comunic.', icon: MessageCircle, href: '/club/communication' },
];

// Navigation items for ADMIN role only
const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: Shield, href: '/admin/dashboard' },
  { label: 'Usuarios', icon: UserCog, href: '/admin/users' },
  { label: 'Analíticas', icon: BarChart3, href: '/admin/analytics' },
];

export const MobileNav = () => {
  const { hasRole } = useAuth();

  // Get navigation items based on EXCLUSIVE role
  const getNavItems = (): NavItem[] => {
    if (hasRole('admin')) {
      return adminNavItems;
    }
    if (hasRole('coach')) {
      return clubNavItems;
    }
    // Default: student/player
    return playerNavItems;
  };

  const visibleItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-16 px-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-[60px] hover:bg-primary/10"
            activeClassName="text-primary"
          >
            <div className="relative">
              <item.icon className="w-6 h-6 transition-all duration-300" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-medium transition-all duration-300">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
