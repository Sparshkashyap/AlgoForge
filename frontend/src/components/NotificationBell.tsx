import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatTime(value?: string) {
  if (!value) return "Just now";

  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;

  return date.toLocaleDateString();
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { notifications, unreadCount, loading, markOneRead, markAllRead } =
    useNotifications();

  const visibleNotifications = useMemo(() => {
    return notifications.slice(0, 8);
  }, [notifications]);

  const handleOpenNotification = async (item: {
    id?: string;
    isRead?: boolean;
    data?: Record<string, unknown> | null;
  }) => {
    if (item.id && !item.isRead) {
      await markOneRead(item.id);
    }

    const slug =
      typeof item.data?.slug === "string" ? item.data.slug : null;

    if (slug) {
      navigate(`/problems/${slug}`);
    } else {
      navigate("/notifications");
    }

    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/70 text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition hover:border-primary/30 hover:bg-primary/5"
        >
          <Bell className="h-4 w-4" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] rounded-2xl border border-border/70 bg-card/95 p-0 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifications
          </DropdownMenuLabel>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-lg px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate("/notifications");
                setOpen(false);
              }}
            >
              View all
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-8 rounded-lg px-2 text-xs"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await markAllRead();
              }}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="px-4 py-5 text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : visibleNotifications.length ? (
            visibleNotifications.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => void handleOpenNotification(item)}
                className={`block w-full border-b border-border/60 px-4 py-4 text-left transition hover:bg-background/60 ${
                  item.isRead ? "opacity-75" : "bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.message}
                    </p>
                  </div>

                  {!item.isRead && (
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  )}
                </div>

                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {formatTime(item.createdAt)}
                </p>
              </button>
            ))
          ) : (
            <div className="px-4 py-5 text-sm text-muted-foreground">
              No notifications yet.
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}