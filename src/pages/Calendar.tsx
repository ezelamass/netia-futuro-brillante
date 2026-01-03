import { useState, useMemo } from 'react';
import { startOfWeek, addWeeks, addMonths, subWeeks, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/layouts/AppLayout';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { WeekView } from '@/components/calendar/WeekView';
import { MonthView } from '@/components/calendar/MonthView';
import { CalendarSummary } from '@/components/calendar/CalendarSummary';
import { DayDetail } from '@/components/calendar/DayDetail';
import { AddEventModal } from '@/components/calendar/AddEventModal';
import { EmptyState } from '@/components/ui/empty-state';
import { useCalendarEvents, CalendarEvent } from '@/hooks/useCalendarEvents';
import { useIsMobile } from '@/hooks/use-mobile';

const Calendar = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<'week' | 'month'>(isMobile ? 'week' : 'month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  const {
    events,
    addEvent,
    updateEvent,
    getEventsForDate,
    getEventsForWeek,
    getEventsForMonth,
    getNextEvent,
    getWeekStats,
    getStreak,
  } = useCalendarEvents();

  const handleToggleComplete = (eventId: string, completed: boolean) => {
    updateEvent(eventId, { isCompleted: completed });
  };

  const weekStart = useMemo(() => 
    startOfWeek(currentDate, { weekStartsOn: 1 }), 
    [currentDate]
  );

  const displayEvents = useMemo(() => {
    return view === 'week' 
      ? getEventsForWeek(weekStart)
      : getEventsForMonth(currentDate);
  }, [view, weekStart, currentDate, events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDate(selectedDate);
  }, [selectedDate, events]);

  const nextEvent = getNextEvent();
  const weekStats = getWeekStats(weekStart);
  const streak = getStreak();

  const hasEvents = events.length > 0;

  const handlePrev = () => {
    if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayDetail(true);
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    addEvent(event);
  };

  const openAddEvent = () => {
    setShowDayDetail(false);
    setShowAddEvent(true);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Summary widgets */}
        <CalendarSummary 
          nextEvent={nextEvent}
          weekStats={weekStats}
          streak={streak}
        />
        
        {/* Calendar header */}
        <CalendarHeader
          currentDate={view === 'week' ? weekStart : currentDate}
          view={view}
          onViewChange={setView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        
        {/* Empty state when no events */}
        {!hasEvents && (
          <EmptyState
            variant="no-events"
            onAction={() => setShowAddEvent(true)}
            className="my-6"
          />
        )}
        
        {/* Calendar views */}
        {hasEvents && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${view}-${currentDate.toISOString()}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'week' ? (
                <WeekView
                  weekStart={weekStart}
                  events={displayEvents}
                  onDayClick={handleDayClick}
                />
              ) : (
                <MonthView
                  currentDate={currentDate}
                  events={displayEvents}
                  onDayClick={handleDayClick}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
        
        {/* Day detail sheet */}
        <DayDetail
          date={selectedDate}
          events={selectedDayEvents}
          open={showDayDetail}
          onClose={() => setShowDayDetail(false)}
          onAddEvent={openAddEvent}
          onToggleComplete={handleToggleComplete}
        />
        
        {/* Add event modal */}
        <AddEventModal
          open={showAddEvent}
          onClose={() => setShowAddEvent(false)}
          onSave={handleAddEvent}
          initialDate={selectedDate || new Date()}
        />
      </div>
    </AppLayout>
  );
};

export default Calendar;
