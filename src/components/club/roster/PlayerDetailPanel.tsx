import { useState } from 'react';
import { Player, TrafficLightStatus, LEVEL_LABELS, HANDEDNESS_LABELS } from '@/types/player';
import { TrafficLight } from './TrafficLight';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, MessageCircle, History, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { INDICATOR_STATUS_COLORS } from '@/hooks/useWellnessStatus';

interface PlayerDetailPanelProps {
  player: (Player & { trafficLight: TrafficLightStatus }) | null;
  onClose: () => void;
  onAddNote: (playerId: string, content: string) => void;
  isMobile?: boolean;
}

export function PlayerDetailPanel({ player, onClose, onAddNote, isMobile = false }: PlayerDetailPanelProps) {
  const [noteContent, setNoteContent] = useState('');

  if (!player) return null;

  const handleSubmitNote = () => {
    if (noteContent.trim()) {
      onAddNote(player.id, noteContent.trim());
      setNoteContent('');
    }
  };

  const getStatusColor = (value: number, thresholds: { ok: number; warning: number }, isLowerBetter = false) => {
    if (isLowerBetter) {
      if (value <= thresholds.ok) return 'ok';
      if (value <= thresholds.warning) return 'warning';
      return 'critical';
    }
    if (value >= thresholds.ok) return 'ok';
    if (value >= thresholds.warning) return 'warning';
    return 'critical';
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
            {player.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{player.name}</h2>
            <p className="text-sm text-muted-foreground">
              {player.age} años · {player.category} · {player.sport}
            </p>
            <p className="text-xs text-muted-foreground">
              {HANDEDNESS_LABELS[player.handedness]} · {LEVEL_LABELS[player.level]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrafficLight status={player.trafficLight} size="lg" />
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Current Status */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">ESTADO ACTUAL</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { emoji: '😴', value: `${player.currentStatus.sleep.toFixed(1)}h`, status: getStatusColor(player.currentStatus.sleep, { ok: 7, warning: 6 }) },
                { emoji: '💧', value: `${player.currentStatus.hydration.toFixed(1)}L`, status: getStatusColor(player.currentStatus.hydration, { ok: 1.5, warning: 1.2 }) },
                { emoji: '⚡', value: `${player.currentStatus.energy}/5`, status: getStatusColor(player.currentStatus.energy, { ok: 4, warning: 3 }) },
                { emoji: '🦵', value: `${player.currentStatus.pain}`, status: getStatusColor(player.currentStatus.pain, { ok: 2, warning: 6 }, true) },
              ].map((item, i) => (
                <div key={i} className={cn(
                  'flex flex-col items-center p-3 rounded-lg',
                  INDICATOR_STATUS_COLORS[item.status].bg
                )}>
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-semibold text-foreground">{item.value}</span>
                  <span className={cn('text-xs', INDICATOR_STATUS_COLORS[item.status].icon)}>
                    {item.status === 'ok' ? '✓' : item.status === 'warning' ? '!' : '✗'}
                  </span>
                </div>
              ))}
            </div>
            {player.currentStatus.painLocation && (
              <p className="text-sm text-muted-foreground mt-2">
                📍 Dolor en: {player.currentStatus.painLocation}
              </p>
            )}
          </section>

          {/* Weekly Stats */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">ESTA SEMANA</h3>
            <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sesiones</span>
                <span className="font-medium">{player.weeklyStats.sessions}/{player.weeklyStats.targetSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minutos</span>
                <span className="font-medium">{player.weeklyStats.minutes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RPE promedio</span>
                <span className="font-medium">{player.weeklyStats.rpeAvg.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warmup</span>
                <span className="font-medium">{Math.round(player.weeklyStats.warmupCompliance * 100)}%</span>
              </div>
              {player.weeklyStats.streak > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Racha</span>
                  <span className="font-medium flex items-center gap-1">
                    {player.weeklyStats.streak} días <Flame className="h-4 w-4 text-orange-500" />
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Alerts */}
          {player.alerts.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">ALERTAS RECIENTES</h3>
              <div className="space-y-2">
                {player.alerts.map((alert) => (
                  <div key={alert.id} className={cn(
                    'p-3 rounded-lg border-l-4',
                    alert.severity === 'critical' ? 'bg-red-500/10 border-l-red-500' : 'bg-yellow-500/10 border-l-yellow-500'
                  )}>
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.date), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Coach Notes */}
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">NOTAS DEL ENTRENADOR</h3>
            
            {/* Add note form */}
            <div className="mb-4">
              <Textarea
                placeholder="Agregar nota..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="mb-2 min-h-[80px]"
              />
              <Button 
                onClick={handleSubmitNote} 
                disabled={!noteContent.trim()}
                size="sm"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Agregar nota
              </Button>
            </div>

            {/* Notes list */}
            {player.coachNotes.length > 0 ? (
              <div className="space-y-2">
                {player.coachNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-muted/30">
                    <p className="text-sm text-foreground">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(note.date), 'dd/MM/yy', { locale: es })} · {note.coachName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Sin notas aún
              </p>
            )}
          </section>

          {/* Actions */}
          <section className="space-y-2 pb-4">
            <Button variant="outline" className="w-full" disabled>
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar mensaje a familia
            </Button>
            <Button variant="outline" className="w-full" disabled>
              <History className="h-4 w-4 mr-2" />
              Ver historial completo
            </Button>
          </section>
        </div>
      </ScrollArea>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={!!player} onOpenChange={() => onClose()}>
        <SheetContent side="bottom" className="h-[85vh] p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-[400px] border-l bg-card h-full overflow-hidden">
      {content}
    </div>
  );
}
