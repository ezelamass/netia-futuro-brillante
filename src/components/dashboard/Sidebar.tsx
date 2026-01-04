import { Home, Dumbbell, Calendar, MessageCircle, Trophy, Building2, Users, FileText, Bell, Shield, UserCog, BarChart3, ChevronLeft, Award, LucideIcon } from 'lucide-react';
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
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

// Navigation items for PLAYER role only
const playerNav: NavItem[] = [
  { label: 'Inicio', icon: Home, href: '/dashboard' },
  { label: 'Entrenar', icon: Dumbbell, href: '/training' },
  { label: 'Calendario', icon: Calendar, href: '/calendar' },
  { label: 'Chat IA', icon: MessageCircle, href: '/chat', badge: 3 },
  { label: 'Logros', icon: Award, href: '/achievements' },
  { label: 'Ranking', icon: Trophy, href: '/leaderboard' },
];

// Navigation items for CLUB role (coach) only
const clubNav: NavItem[] = [
  { label: 'Panel Club', icon: Building2, href: '/club/dashboard' },
  { label: 'Mis Jugadores', icon: Users, href: '/club/roster' },
  { label: 'Carga de Entreno', icon: BarChart3, href: '/club/training-load' },
  { label: 'Informes', icon: FileText, href: '/club/reports' },
  { label: 'Comunicación', icon: Bell, href: '/club/communication' },
];

// Navigation items for ADMIN role only
const adminNav: NavItem[] = [
  { label: 'Dashboard', icon: Shield, href: '/admin/dashboard' },
  { label: 'Usuarios', icon: UserCog, href: '/admin/users' },
  { label: 'Analíticas', icon: BarChart3, href: '/admin/analytics' },
];

export const Sidebar = () => {
  const { user, hasRole } = useAuth();
  const { open, toggleSidebar } = useSidebar();

  // Get navigation items based on EXCLUSIVE role
  const getNavigationItems = () => {
    if (hasRole('admin')) {
      return { items: adminNav, label: 'Administración' };
    }
    if (hasRole('coach')) {
      return { items: clubNav, label: 'Club' };
    }
    // Default: student/player
    return { items: playerNav, label: 'Navegación' };
  };

  const { items: navItems, label: navLabel } = getNavigationItems();

  return (
    <SidebarUI className="hidden lg:flex border-r border-border" collapsible="icon">
      <SidebarContent className="bg-background/95 backdrop-blur-lg">
        {/* Header with Logo and Toggle */}
        <SidebarHeader>
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src="/logo.png" 
                alt="NETIA" 
                className="w-10 h-10 rounded-lg shrink-0 object-contain" 
              />
              {open && (
                <div className="min-w-0">
                  <h1 className="text-xl font-bold font-heading truncate">NETIA</h1>
                  <p className="text-xs text-muted-foreground capitalize truncate">{user?.role}</p>
                </div>
              )}
            </div>
            
            {/* Toggle button inside sidebar */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8"
                    onClick={toggleSidebar}
                  >
                    <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${!open ? 'rotate-180' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{open ? 'Contraer sidebar' : 'Expandir sidebar'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SidebarHeader>

        {/* Role-specific Navigation */}
        <SidebarGroup>
          {open && <SidebarGroupLabel>{navLabel}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
                            activeClassName="bg-primary/10 text-primary font-medium"
                          >
                            <div className="relative shrink-0">
                              <item.icon className="w-5 h-5" />
                              {'badge' in item && item.badge && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {open && <span className="truncate">{item.label}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {!open && (
                        <TooltipContent side="right" className="font-medium">
                          <p>{item.label}</p>
                          {'badge' in item && item.badge && <p className="text-xs text-muted-foreground">{item.badge} nuevos</p>}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  );
};
