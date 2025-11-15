import { Bell, ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-5xl font-display font-bold text-foreground">
        Dashboard
      </h1>
      
      <div className="flex items-center gap-4">
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        
        <button className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-10 h-10 rounded-full bg-gradient-purple-blue flex items-center justify-center text-white font-bold">
            U
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};
