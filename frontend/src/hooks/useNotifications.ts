import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSocket, attachSocketUser } from "@/lib/socket";
import {
  listMyNotificationsApi,
  getMyNotificationSummaryApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "@/api/notification.api";

export type LiveNotification = {
  id?: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isRead?: boolean;
  readAt?: string | null;
  createdAt?: string;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadInitialNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [notificationsRes, summaryRes] = await Promise.all([
        listMyNotificationsApi(),
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
  }, [user?.id]);

  useEffect(() => {
    void loadInitialNotifications();
  }, [loadInitialNotifications]);

  useEffect(() => {
    if (!user?.id) return;

    attachSocketUser(user.id);
    const socket = getSocket();

    const handleNotification = (incoming: LiveNotification) => {
      setNotifications((prev) => [incoming, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      getMyNotificationSummaryApi()
        .then((res) => {
          const next = res.data?.unreadCount ?? 0;
          setUnreadCount(next);
        })
        .catch(() => {
          // noop
        });
    }, 15000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const markOneRead = async (notificationId: string) => {
    try {
      await markNotificationReadApi(notificationId);

      let wasUnread = false;

      setNotifications((prev) =>
        prev.map((item) => {
          if (item.id === notificationId) {
            if (!item.isRead) {
              wasUnread = true;
            }

            return {
              ...item,
              isRead: true,
              readAt: new Date().toISOString(),
            };
          }

          return item;
        })
      );

      if (wasUnread) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
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