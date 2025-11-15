import { Home, Dumbbell, Calendar, MessageCircle, Trophy, Building2, Users, FileText, Bell, Shield, UserCog, BarChart3, Settings, Waves } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const studentNav = [
  { label: 'Inicio', icon: Home, href: '/dashboard' },
  { label: 'Entrenar', icon: Dumbbell, href: '/training' },
  { label: 'Calendario', icon: Calendar, href: '/calendar' },
  { label: 'Chat IA', icon: MessageCircle, href: '/chat', badge: 3 },
  { label: 'Ranking', icon: Trophy, href: '/leaderboard' },
];

const clubNav = [
  { label: 'Panel Club', icon: Building2, href: '/club/dashboard' },
  { label: 'Plantilla', icon: Users, href: '/club/roster' },
  { label: 'Informes', icon: FileText, href: '/club/reports' },
  { label: 'Comunicación', icon: Bell, href: '/club/communication' },
];

const adminNav = [
  { label: 'Admin', icon: Shield, href: '/admin/dashboard' },
  { label: 'Usuarios', icon: UserCog, href: '/admin/users' },
  { label: 'Analíticas', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Ajustes', icon: Settings, href: '/admin/settings' },
];

export const Sidebar = () => {
  const { user, hasRole } = useAuth();

  const getNavigationItems = () => {
    const items = [...studentNav];
    
    if (hasRole(['coach', 'admin'])) {
      items.push(...clubNav);
    }
    
    if (hasRole('admin')) {
      items.push(...adminNav);
    }
    
    return items;
  };

  const navItems = getNavigationItems();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-background/95 backdrop-blur-lg border-r border-border flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <Waves className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">NETIA</h1>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};
