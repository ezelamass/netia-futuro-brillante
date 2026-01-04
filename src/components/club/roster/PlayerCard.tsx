import { Player, TrafficLightStatus } from '@/types/player';
import { TrafficLight } from './TrafficLight';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PlayerCardProps {
  player: Player & { trafficLight: TrafficLightStatus };
  onClick: () => void;
}

export function PlayerCard({ player, onClick }: PlayerCardProps) {
  const lastSession = formatDistanceToNow(new Date(player.lastSessionDate), { 
    addSuffix: true, 
    locale: es 
  });

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border bg-card cursor-pointer transition-all',
        'hover:shadow-md hover:border-primary/30',
        'active:scale-[0.99]',
        player.trafficLight === 'red' && 'border-l-4 border-l-red-500',
        player.trafficLight === 'yellow' && 'border-l-4 border-l-yellow-500',
        player.trafficLight === 'green' && 'border-l-4 border-l-emerald-500'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <TrafficLight status={player.trafficLight} size="md" />
          <div>
            <h3 className="font-semibold text-foreground">{player.name}</h3>
            <p className="text-sm text-muted-foreground">
              {player.category} · Última sesión: {lastSession.replace('hace ', '')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{player.age} años</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <span>😴</span>
          <span className={cn(
            player.currentStatus.sleep < 7 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
          )}>
            {player.currentStatus.sleep.toFixed(1)}h
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>💧</span>
          <span className={cn(
            player.currentStatus.hydration < 1.2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
          )}>
            {player.currentStatus.hydration.toFixed(1)}L
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🦵</span>
          <span className={cn(
            player.currentStatus.pain >= 4 ? 'text-red-600 dark:text-red-400' : 'text-foreground'
          )}>
            {player.currentStatus.pain}/10
          </span>
        </div>
      </div>
    </div>
  );
}
