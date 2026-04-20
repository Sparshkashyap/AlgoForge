import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import {
  getMyNotificationSummaryApi,
  getMyNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "@/api/user.api";

export type LiveNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isRead?: boolean;
  readAt?: string | null;
  createdAt?: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadInitialNotifications = async () => {
    try {
      setLoading(true);

      const [notificationsRes, summaryRes] = await Promise.all([
        getMyNotificationsApi(),
        getMyNotificationSummaryApi(),
      ]);

      setNotifications(notificationsRes.data || []);
      setUnreadCount(summaryRes.data?.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInitialNotifications();
  }, []);

  useEffect(() => {
    const handleNotification = (incoming: LiveNotification) => {
      setNotifications((prev) => [incoming, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, []);

  const markOneRead = async (notificationId: string) => {
    try {
      await markNotificationReadApi(notificationId);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? {
                ...item,
                isRead: true,
                readAt: new Date().toISOString(),
              }
            : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {
      // noop
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsReadApi();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch {
      // noop
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    reload: loadInitialNotifications,
    markOneRead,
    markAllRead,
  };
};