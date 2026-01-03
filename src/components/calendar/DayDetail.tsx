import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { EventCard } from './EventCard';

interface DayDetailProps {
  date: Date | null;
  events: CalendarEvent[];
  open: boolean;
  onClose: () => void;
  onAddEvent: () => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const DayDetail = ({ 
  date, 
  events, 
  open, 
  onClose, 
  onAddEvent,
  onEventClick 
}: DayDetailProps) => {
  if (!date) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="text-left pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="capitalize">
              {format(date, "EEEE d 'de' MMMM", { locale: es })}
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="py-4 space-y-3 overflow-y-auto max-h-[calc(70vh-140px)]">
          <AnimatePresence mode="popLayout">
            {events.length > 0 ? (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EventCard 
                    event={event} 
                    onClick={() => onEventClick?.(event)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground mb-4">
                  No hay eventos para este día
                </p>
                <Button onClick={onAddEvent} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar evento
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {events.length > 0 && (
          <div className="absolute bottom-6 left-0 right-0 px-6">
            <Button 
              onClick={onAddEvent} 
              className="w-full gradient-netia text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar evento
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
