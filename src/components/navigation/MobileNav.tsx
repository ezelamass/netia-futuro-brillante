import { Home, Dumbbell, Calendar, MessageCircle, Trophy } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Inicio',
    icon: Home,
    href: '/dashboard',
    roles: ['student', 'coach', 'admin'],
  },
  {
    label: 'Entrenar',
    icon: Dumbbell,
    href: '/training',
    roles: ['student', 'coach', 'admin'],
  },
  {
    label: 'Calendario',
    icon: Calendar,
    href: '/calendar',
    roles: ['student', 'coach', 'admin'],
  },
  {
    label: 'Chat IA',
    icon: MessageCircle,
    href: '/chat',
    roles: ['student', 'coach', 'admin'],
    badge: 3,
  },
  {
    label: 'Ranking',
    icon: Trophy,
    href: '/leaderboard',
    roles: ['student', 'coach', 'admin'],
  },
];

export const MobileNav = () => {
  const { hasRole } = useAuth();

  const visibleItems = navItems.filter(item => 
    item.roles.some(role => hasRole(role as any))
  );

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
