import { NotificationGroup as NotificationGroupType } from '@/types/notification';
import { NotificationItem } from './NotificationItem';

interface NotificationGroupProps {
  group: NotificationGroupType;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}

export const NotificationGroup = ({
  group,
  onMarkAsRead,
  onDelete,
  onClose,
}: NotificationGroupProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
        {group.label}
      </h4>
      <div className="space-y-2">
        {group.notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};
