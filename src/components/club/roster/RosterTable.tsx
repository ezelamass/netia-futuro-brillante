import { Player, TrafficLightStatus } from '@/types/player';
import { TrafficLight } from './TrafficLight';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RosterTableProps {
  players: (Player & { trafficLight: TrafficLightStatus })[];
  onSelectPlayer: (player: Player) => void;
}

export function RosterTable({ players, onSelectPlayer }: RosterTableProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No se encontraron jugadores con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[50px]">🚦</TableHead>
            <TableHead>Jugador</TableHead>
            <TableHead className="text-center">Edad</TableHead>
            <TableHead className="text-center">Nivel</TableHead>
            <TableHead className="text-center">Sueño</TableHead>
            <TableHead className="text-center">Hidrat.</TableHead>
            <TableHead className="text-center">Dolor</TableHead>
            <TableHead className="text-right">Última Sesión</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const lastSession = formatDistanceToNow(new Date(player.lastSessionDate), { 
              addSuffix: false, 
              locale: es 
            });

            return (
              <TableRow
                key={player.id}
                className={cn(
                  'cursor-pointer transition-colors',
                  'hover:bg-muted/50',
                  player.trafficLight === 'red' && 'border-l-4 border-l-red-500',
                  player.trafficLight === 'yellow' && 'border-l-4 border-l-yellow-500',
                  player.trafficLight === 'green' && 'border-l-4 border-l-emerald-500'
                )}
                onClick={() => onSelectPlayer(player)}
              >
                <TableCell>
                  <TrafficLight status={player.trafficLight} size="sm" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.sport}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">{player.age} años</TableCell>
                <TableCell className="text-center">
                  <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">
                    {player.category}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    player.currentStatus.sleep < 6 && 'text-red-600 dark:text-red-400 font-medium',
                    player.currentStatus.sleep < 7 && player.currentStatus.sleep >= 6 && 'text-yellow-600 dark:text-yellow-400'
                  )}>
                    {player.currentStatus.sleep.toFixed(1)}h
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    player.currentStatus.hydration < 1.0 && 'text-red-600 dark:text-red-400 font-medium',
                    player.currentStatus.hydration < 1.2 && player.currentStatus.hydration >= 1.0 && 'text-yellow-600 dark:text-yellow-400'
                  )}>
                    {player.currentStatus.hydration.toFixed(1)}L
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn(
                    player.currentStatus.pain >= 7 && 'text-red-600 dark:text-red-400 font-medium',
                    player.currentStatus.pain >= 4 && player.currentStatus.pain < 7 && 'text-yellow-600 dark:text-yellow-400'
                  )}>
                    {player.currentStatus.pain}/10
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {lastSession === 'menos de un minuto' ? 'Hoy' : lastSession}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
