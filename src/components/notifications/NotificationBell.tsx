import { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    groupedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
  } = useNotifications();

  const handleClose = () => setIsOpen(false);

  const bellButton = (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative"
      aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
    >
      <Bell className={cn(
        "w-5 h-5 transition-colors",
        unreadCount > 0 ? "text-primary" : "text-muted-foreground"
      )} />
      
      {/* Badge */}
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              "absolute flex items-center justify-center",
              "min-w-[18px] h-[18px] px-1 text-[10px] font-bold",
              "bg-destructive text-destructive-foreground rounded-full",
              "-top-0.5 -right-0.5"
            )}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse animation for new notifications */}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 w-3 h-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-destructive/40 animate-ping" />
        </span>
      )}
    </Button>
  );

  // Mobile: Use Sheet (bottom drawer)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {bellButton}
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] px-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Notificaciones</SheetTitle>
          </SheetHeader>
          <NotificationPanel
            groupedNotifications={groupedNotifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteNotification}
            onClearAllRead={clearAllRead}
            onClose={handleClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Use Popover (dropdown)
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {bellButton}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 p-0 overflow-hidden"
        sideOffset={8}
      >
        <NotificationPanel
          groupedNotifications={groupedNotifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteNotification}
          onClearAllRead={clearAllRead}
          onClose={handleClose}
        />
      </PopoverContent>
    </Popover>
  );
};
