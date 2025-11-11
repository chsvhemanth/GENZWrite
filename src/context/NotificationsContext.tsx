import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Notification } from '@/types';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timerRef = useRef<number | null>(null);

  // Simulate realtime: randomly push a like/comment/follow for current user
  useEffect(() => {
    if (!user) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      const types: Notification['type'][] = ['like', 'comment', 'follow'];
      const type = types[Math.floor(Math.random() * types.length)];
      const generated: Notification = {
        id: crypto.randomUUID(),
        userId: user.id,
        type,
        referenceId: String(Math.floor(Math.random() * 1000)),
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [generated, ...prev].slice(0, 50));
    }, 15000); // every 15s
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [user]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => {
    setNotifications((prev) => [
      { ...n, id: crypto.randomUUID(), isRead: false, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const value: NotificationsContextType = { notifications, unreadCount, markAllRead, addNotification };
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};


