import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

export default function Notifications() {
  const { notifications, unreadCount, loading, markOneRead, markAllRead } =
    useNotifications();

  const [markingAll, setMarkingAll] = useState(false);

  const sortedItems = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [notifications]);

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      await markAllRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await markOneRead(id);
    } catch {
      toast.error("Failed to update notification");
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
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary/80">
              Unread {unreadCount}
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleMarkAll}
            disabled={loading || markingAll || sortedItems.length === 0}
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
          ) : sortedItems.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-4 text-base font-medium">No notifications</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedItems.map((item) => (
                <div
                  key={item.id || `${item.title}-${item.createdAt}`}
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

                        {item.type ? (
                          <span className="rounded-full border border-border/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            {item.type}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.message}
                      </p>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    {!item.isRead && item.id ? (
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleMarkOne(item.id!)}
                      >
                        Mark read
                      </Button>
                    ) : null}
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