import { format } from "date-fns";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarClock,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const nextSteps = [
  {
    title: "Solve today’s next problem",
    copy: "Stay in motion instead of waiting for the perfect time to restart.",
    href: "/problems",
    cta: "Open problems",
  },
  {
    title: "Review your profile and streak",
    copy: "Keep your identity, plan, and momentum visible in one place.",
    href: "/profile",
    cta: "View profile",
  },
  {
    title: "Check bookmarks and saved work",
    copy: "Go back to the problems worth revisiting instead of starting cold.",
    href: "/bookmarks",
    cta: "Open bookmarks",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const role = String(user?.role ?? "USER");

  if (role === "ADMIN") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role === "CREATOR") {
    return <Navigate to="/creator-dashboard" replace />;
  }

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "dd MMM yyyy")
    : "Recently joined";

  const solvedCount = user?.solvedCount ?? 0;
  const streak = user?.streak ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 md:py-10">
        <motion.div className="spotlight-card overflow-hidden p-6 md:p-8" {...fade()}>
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Active practice workspace
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                  Personal dashboard
                </p>
                <h1 className="mt-4 font-heading text-4xl font-black leading-tight md:text-6xl">
                  {user?.name || "Coder"}, keep the momentum visible.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  This should feel like your prep command center, not a placeholder page.
                  Progress, plan, identity, and next actions all belong here.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {role}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {user?.plan || "FREE"} Plan
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Member since {memberSince}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Target className="h-5 w-5 text-primary" />
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Problems solved
                </p>
                <p className="mt-2 font-heading text-4xl font-black">{solvedCount}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Clear proof that progress is happening.
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Flame className="h-5 w-5 text-warning" />
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Current streak
                </p>
                <p className="mt-2 font-heading text-4xl font-black">{streak} days</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Consistency gets easier when the signal is visible.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div className="spotlight-card p-6 md:p-7" {...fade(0.08)}>
            <div className="feature-glow absolute inset-0 opacity-75" />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                <h2 className="font-heading text-2xl font-black">What matters now</h2>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Practice depth",
                    copy: "Solve intentionally, not randomly.",
                    icon: BookOpen,
                  },
                  {
                    title: "Progress visibility",
                    copy: "See what has moved, not what you forgot.",
                    icon: BarChart3,
                  },
                  {
                    title: "Next action clarity",
                    copy: "A good dashboard removes choice overload.",
                    icon: CalendarClock,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-lg font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {item.copy}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div className="spotlight-card p-6 md:p-7" {...fade(0.14)}>
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                Quick actions
              </p>
              <h2 className="mt-3 font-heading text-2xl font-black">
                Keep the next move obvious.
              </h2>

              <div className="mt-6 space-y-4">
                {nextSteps.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="block rounded-[1.5rem] border border-border/70 bg-background/45 p-5 transition hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">
                          {item.copy}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-primary">{item.cta}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-6 spotlight-card p-6 md:p-7" {...fade(0.2)}>
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                Consistency matters more than hype
              </p>
              <h2 className="mt-3 font-heading text-3xl font-black leading-tight">
                A serious dashboard should push action, not just show numbers.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                Homepage polish is nice, but this is where product trust actually forms.
                Users need a surface that feels usable, focused, and worth coming back to.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/problems">
                <Button className="rounded-full px-6">Solve Problems</Button>
              </Link>
              <Link to="/roadmap">
                <Button variant="outline" className="rounded-full px-6">
                  View Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}