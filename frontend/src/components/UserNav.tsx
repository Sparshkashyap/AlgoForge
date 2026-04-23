import { LogOut, LayoutDashboard, Settings, UserCircle2, Sparkles } from "lucide-react";
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!user) return null;

  const avatarSrc =
    user.avatarUrl && user.avatarUrl.trim() !== ""
      ? user.avatarUrl
      : DEFAULT_AVATAR_URL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative rounded-full ring-offset-background transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.18),transparent_72%)] opacity-0 transition group-hover:opacity-100" />

          <Avatar className="relative h-11 w-11 border border-border/70 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
            <AvatarImage src={avatarSrc} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
      >
        <DropdownMenuLabel className="rounded-xl px-3 py-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 border border-border/70">
              <AvatarImage src={avatarSrc} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{user.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="h-3 w-3" />
                  {user.plan || "FREE"}
                </span>
              </div>
              <span className="mt-1 block break-all text-xs font-normal text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer rounded-xl px-3 py-3"
        >
          <LayoutDashboard className="mr-3 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer rounded-xl px-3 py-3"
        >
          <UserCircle2 className="mr-3 h-4 w-4" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer rounded-xl px-3 py-3"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-xl px-3 py-3 text-destructive focus:text-destructive"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}