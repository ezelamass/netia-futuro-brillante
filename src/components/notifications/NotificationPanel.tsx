import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NotificationGroup } from './NotificationGroup';
import { NotificationEmpty } from './NotificationEmpty';
import { NotificationGroup as NotificationGroupType } from '@/types/notification';

interface NotificationPanelProps {
  groupedNotifications: NotificationGroupType[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAllRead: () => void;
  onClose?: () => void;
}

export const NotificationPanel = ({
  groupedNotifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAllRead,
  onClose,
}: NotificationPanelProps) => {
  const hasNotifications = groupedNotifications.length > 0;
  const hasReadNotifications = groupedNotifications.some(g => 
    g.notifications.some(n => n.isRead)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full max-h-[70vh]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold">Notificaciones</h3>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="h-8 text-xs gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Marcar leídas</span>
            </Button>
          )}
          {hasReadNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllRead}
              className="h-8 text-xs gap-1 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-4 py-3">
        <AnimatePresence mode="popLayout">
          {hasNotifications ? (
            <div className="space-y-4">
              {groupedNotifications.map((group) => (
                <NotificationGroup
                  key={group.group}
                  group={group}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onClose={onClose}
                />
              ))}
            </div>
          ) : (
            <NotificationEmpty />
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer */}
      {hasNotifications && (
        <>
          <Separator />
          <div className="p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-primary hover:text-primary"
              onClick={onClose}
            >
              Ver todas →
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};
