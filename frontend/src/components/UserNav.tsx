import {
  LogOut,
  LayoutDashboard,
  Settings,
  UserCircle2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DEFAULT_AVATAR_URL =
  "https://img.freepik.com/premium-vector/urban-monster-fusion-street-culture-fantasy_1230457-40156.jpg?semt=ais_hybrid&w=740&q=80";

const getInitials = (name?: string) => {
  if (!name) return "AF";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function UserNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const username = user.username ? `@${user.username}` : "@username-not-set";

  const avatarSrc =
    user.avatarUrl && user.avatarUrl.trim() !== ""
      ? user.avatarUrl
      : DEFAULT_AVATAR_URL;

  const handleCopyUsername = async () => {
    if (!user.username) return;

    await navigator.clipboard.writeText(user.username);
    setCopied(true);
    toast.success("Username copied");
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative rounded-full outline-none ring-0 focus:outline-none focus:ring-0">
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/40 via-fuchsia-400/30 to-accent/40 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />

          <Avatar className="relative h-11 w-11 border border-border/70 shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition duration-300 group-hover:scale-105 group-hover:border-primary/40">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-2 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
      >
        <DropdownMenuLabel className="rounded-2xl bg-gradient-to-br from-primary/10 via-background/60 to-accent/10 px-4 py-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-14 w-14 border border-primary/30 shadow-lg">
              <AvatarImage src={avatarSrc} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-semibold text-foreground">
                  {user.name}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="h-3 w-3" />
                  {user.plan || "FREE"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyUsername}
                className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-primary transition hover:border-primary/40 hover:bg-primary/10"
              >
                <span className="truncate">{username}</span>
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>

              <span className="mt-2 block break-all text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer rounded-2xl px-3 py-3 transition hover:bg-primary/10"
        >
          <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer rounded-2xl px-3 py-3 transition hover:bg-primary/10"
        >
          <UserCircle2 className="mr-3 h-4 w-4 text-primary" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer rounded-2xl px-3 py-3 transition hover:bg-primary/10"
        >
          <Settings className="mr-3 h-4 w-4 text-primary" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-2xl px-3 py-3 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}