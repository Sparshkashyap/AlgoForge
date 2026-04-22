import { Link, useLocation } from "react-router-dom";
import { FileText, LayoutDashboard, PlusSquare, Sparkles } from "lucide-react";

const links = [
  { label: "Creator Dashboard", href: "/creator-dashboard", icon: LayoutDashboard },
  { label: "Create Problem", href: "/create-problem", icon: PlusSquare },
  { label: "Manage Problems", href: "/manage-problems", icon: FileText },
];

export default function CreatorSidebar() {
  const location = useLocation();

  return (
    <aside className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/90 p-4 backdrop-blur-2xl">
      <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>

        <p className="mt-4 font-heading text-xl font-black">Creator Panel</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Create problems, improve quality, and manage your authored content.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Content tools
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