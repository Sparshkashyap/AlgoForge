import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  listMyNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "@/api/notification.api";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await listMyNotificationsApi();
      setItems(res?.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const handleRead = async (id: string) => {
    try {
      await markNotificationReadApi(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update notification");
    }
  };

  const handleReadAll = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsReadApi();
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black">Notifications</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Read what changed, then clear the noise.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleReadAll}
            disabled={markingAll || items.length === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {markingAll ? "Updating..." : "Mark all read"}
          </Button>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-4 text-base font-medium">No notifications</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-[1.5rem] border p-5 ${
                    item.isRead
                      ? "border-border/70 bg-card/50"
                      : "border-primary/20 bg-primary/5"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        {!item.isRead && (
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-primary">
                            Unread
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.message}
                      </p>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!item.isRead && (
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleRead(item.id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}