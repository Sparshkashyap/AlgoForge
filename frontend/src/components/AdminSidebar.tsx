import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusSquare } from "lucide-react";

const links = [
  { label: "Admin Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Create Problem", href: "/create-problem", icon: PlusSquare },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-4">
      <div className="mb-4">
        <p className="font-heading text-lg font-semibold">Admin Panel</p>
        <p className="text-sm text-muted-foreground">
          Create, preview, and publish problems
        </p>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.href;

          return (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}