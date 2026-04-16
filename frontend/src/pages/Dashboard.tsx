import { format } from "date-fns";
import { Navigate } from "react-router-dom";
import {
  CalendarClock,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  PlusSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const statCards = [
  {
    key: "solvedCount",
    label: "Problems Solved",
    icon: Target,
    accent: "text-primary",
  },
  {
    key: "streak",
    label: "Current Streak",
    icon: Flame,
    accent: "text-warning",
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 md:py-10">
        <motion.div
          className="overflow-hidden rounded-[32px] border border-border bg-card/85 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-8"
          {...fade()}
        >
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_24%),radial-gradient(circle_at_left,rgba(34,211,238,0.08),transparent_22%)]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Authenticated session active
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-primary/80">
                  Dashboard
                </p>
                <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">
                  {user?.name || "Coder"}
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  {role === "ADMIN"
                    ? "You are managing platform operations, problems, and publishing flow."
                    : "This is your command center for solving, tracking progress, and building consistency."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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

            {role === "ADMIN" ? (
              <Link to="/create-problem">
                <Button className="rounded-xl border-0 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(99,102,241,0.25)]">
                  <PlusSquare className="mr-2 h-4 w-4" />
                  Create Problem
                </Button>
              </Link>
            ) : null}
          </div>
        </motion.div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const value =
              card.key === "solvedCount"
                ? user?.solvedCount ?? 0
                : `${user?.streak ?? 0} days`;

            return (
              <motion.div
                key={card.key}
                className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm"
                {...fade(index * 0.08)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-5 w-5 ${card.accent}`} />
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="font-heading text-3xl font-bold">{value}</div>
                <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            {...fade(0.15)}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-xl font-semibold">
                What’s live right now
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="font-medium">Public problem viewing</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Anyone can browse and read problems without login.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="font-medium">Protected submissions</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Users can only submit after authentication.
                </p>
              </div>

              {role === "ADMIN" ? (
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="font-medium">Admin publishing flow</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create problem, preview run against test cases, then publish.
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            {...fade(0.22)}
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-semibold">
                Quick actions
              </h2>
            </div>

            <div className="space-y-3">
              <Link to="/problems">
                <Button className="w-full rounded-xl border-0 bg-primary text-primary-foreground">
                  Open Problems
                </Button>
              </Link>

              {role === "ADMIN" ? (
                <Link to="/create-problem">
                  <Button variant="outline" className="w-full rounded-xl">
                    Create New Problem
                  </Button>
                </Link>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}