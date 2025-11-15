import { Home, BookOpen, Video, Trophy, Settings, Bell } from 'lucide-react';
import netiaLogo from '@/assets/netia-logo.png';

const navItems = [
  { icon: Home, label: 'Inicio', active: true },
  { icon: BookOpen, label: 'Tareas', active: false },
  { icon: Video, label: 'Videos', active: false },
  { icon: Trophy, label: 'Logros', active: false },
  { icon: Settings, label: 'Ajustes', active: false },
  { icon: Bell, label: 'Notificaciones', active: false },
];

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-white/70 backdrop-blur-md border-r border-border/50 flex flex-col items-center py-6 gap-8">
      <div className="w-12 h-12 rounded-xl overflow-hidden">
        <img src={netiaLogo} alt="NETIA" className="w-full h-full object-cover" />
      </div>
      
      <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              item.active
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </div>
  );
};
