import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusSquare,
  ShieldCheck,
  Sparkles,
  Users,
  BadgeIndianRupee,
  ClipboardCheck,
  FileSpreadsheet,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { label: "Admin Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Create Problem", href: "/create-problem", icon: PlusSquare },
  { label: "Users", href: "/admin-users", icon: Users },
  { label: "Sales", href: "/admin-sales", icon: BadgeIndianRupee },
  { label: "Review Queue", href: "/admin-problem-review", icon: ClipboardCheck },
  { label: "Exports", href: "/admin-exports", icon: FileSpreadsheet },
  { label: "Subscriptions", href: "/admin-subscriptions", icon: BadgeIndianRupee },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return null;
  }

  return (
    <aside className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/90 p-4 backdrop-blur-2xl">
      <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <p className="mt-4 font-heading text-xl font-black">Admin Panel</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Moderate users, review content, manage pricing, exports, and keep platform quality under control.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Internal tools
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`group flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border border-primary/20 bg-primary/10 text-primary"
                  : "border border-transparent text-muted-foreground hover:border-border/70 hover:bg-background/55 hover:text-foreground"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-border/60 bg-background/60 text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}