import { Home, Dumbbell, Calendar, MessageCircle, Trophy, Building2, Users, FileText, Bell, Shield, UserCog, BarChart3, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

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
  const { open } = useSidebar();

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
    <SidebarUI className="hidden lg:flex border-r border-border" collapsible="icon">
      <SidebarContent className="bg-background/95 backdrop-blur-lg">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
          <img src="/logo.png" alt="NETIA" className="w-10 h-10 rounded-lg shrink-0" />
          {open && (
            <div>
              <h1 className="text-xl font-bold font-heading">NETIA</h1>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          )}
        </div>

        {/* Student Navigation */}
        <SidebarGroup>
          {open && <SidebarGroupLabel>Navegación</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {studentNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
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
                      {open && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Club Navigation */}
        {hasRole(['coach', 'admin']) && (
          <SidebarGroup>
            {open && <SidebarGroupLabel>Club</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {clubNav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="w-5 h-5" />
                        {open && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Navigation */}
        {hasRole('admin') && (
          <SidebarGroup>
            {open && <SidebarGroupLabel>Administración</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink
                        to={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="w-5 h-5" />
                        {open && <span>{item.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </SidebarUI>
  );
};
