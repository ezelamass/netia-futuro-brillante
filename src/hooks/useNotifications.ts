import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Notification, 
  MOCK_NOTIFICATIONS, 
  getTimeGroup, 
  TimeGroup,
  TIME_GROUP_LABELS,
  NotificationGroup 
} from '@/types/notification';

const STORAGE_KEY = 'netia_notifications';
const MAX_NOTIFICATIONS = 50;

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  groupedNotifications: NotificationGroup[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const withDates = parsed.map((n: Notification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(withDates);
      } else {
        // Initialize with mock data
        setNotifications(MOCK_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications(MOCK_NOTIFICATIONS);
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Group notifications by time
  const groupedNotifications = useMemo(() => {
    const groups: Record<TimeGroup, Notification[]> = {
      today: [],
      yesterday: [],
      this_week: [],
      this_month: [],
      older: [],
    };

    // Sort by timestamp (newest first) then group
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    sorted.forEach(notification => {
      const group = getTimeGroup(new Date(notification.timestamp));
      groups[group].push(notification);
    });

    // Convert to array format, filtering out empty groups
    const groupOrder: TimeGroup[] = ['today', 'yesterday', 'this_week', 'this_month', 'older'];
    
    return groupOrder
      .filter(group => groups[group].length > 0)
      .map(group => ({
        group,
        label: TIME_GROUP_LABELS[group],
        notifications: groups[group],
      }));
  }, [notifications]);

  // Mark single notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  // Delete single notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all read notifications
  const clearAllRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.isRead));
  }, []);

  // Add new notification
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        isRead: false,
      };

      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        // Keep only last MAX_NOTIFICATIONS
        return updated.slice(0, MAX_NOTIFICATIONS);
      });
    },
    []
  );

  return {
    notifications,
    unreadCount,
    groupedNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllRead,
    addNotification,
  };
};
