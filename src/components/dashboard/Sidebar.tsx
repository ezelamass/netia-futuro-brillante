import { Home, Dumbbell, Calendar, MessageCircle, Trophy, Building2, Users, FileText, Bell, Shield, UserCog, BarChart3, Settings, ChevronLeft, Award } from 'lucide-react';
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
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const studentNav = [
  { label: 'Inicio', icon: Home, href: '/dashboard' },
  { label: 'Entrenar', icon: Dumbbell, href: '/training' },
  { label: 'Calendario', icon: Calendar, href: '/calendar' },
  { label: 'Chat IA', icon: MessageCircle, href: '/chat', badge: 3 },
  { label: 'Logros', icon: Award, href: '/achievements' },
  { label: 'Ranking', icon: Trophy, href: '/leaderboard' },
  { label: 'Configuración', icon: Settings, href: '/settings' },
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
  const { open, toggleSidebar } = useSidebar();

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

        {/* Student Navigation */}
        <SidebarGroup>
          {open && <SidebarGroupLabel>Navegación</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {studentNav.map((item) => (
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
                              {item.badge && (
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
                          {item.badge && <p className="text-xs text-muted-foreground">{item.badge} nuevos</p>}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
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
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
                              activeClassName="bg-primary/10 text-primary font-medium"
                            >
                              <item.icon className="w-5 h-5 shrink-0" />
                              {open && <span className="truncate">{item.label}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {!open && (
                          <TooltipContent side="right" className="font-medium">
                            <p>{item.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
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
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10"
                              activeClassName="bg-primary/10 text-primary font-medium"
                            >
                              <item.icon className="w-5 h-5 shrink-0" />
                              {open && <span className="truncate">{item.label}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {!open && (
                          <TooltipContent side="right" className="font-medium">
                            <p>{item.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
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
