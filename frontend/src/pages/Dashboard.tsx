import { format } from "date-fns";
import {
  CalendarClock,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  PlusSquare,
  ListChecks,
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

  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "dd MMM yyyy")
    : "Recently joined";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 md:py-10">
        <motion.div
          className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-6 md:p-8 shadow-sm"
          {...fade()}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Authenticated session active
              </div>

              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold">
                  Welcome back, {user?.name || "Coder"} 👋
                </h1>
                <p className="mt-2 text-muted-foreground max-w-2xl">
                  {user?.role === "ADMIN"
                    ? "You are logged in as admin. Create, edit, delete, and publish problems from here."
                    : "Solve problems, submit code, and track your real progress."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {user?.role || "USER"}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {user?.plan || "FREE"} Plan
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  Member since {memberSince}
                </Badge>
              </div>
            </div>

            {user?.role === "ADMIN" ? (
              <div className="flex flex-wrap gap-3">
                <Link to="/create-problem">
                  <Button className="rounded-xl gradient-primary text-primary-foreground border-0">
                    <PlusSquare className="mr-2 h-4 w-4" />
                    Create Problem
                  </Button>
                </Link>

                <Link to="/manage-problems">
                  <Button variant="outline" className="rounded-xl">
                    <ListChecks className="mr-2 h-4 w-4" />
                    Manage Problems
                  </Button>
                </Link>
              </div>
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
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
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
                <p className="font-medium">✅ Public problem viewing</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Anyone can browse and read free published problems without login.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="font-medium">✅ Premium gating</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Premium problems are available only to Pro users and admins.
                </p>
              </div>

              {user?.role === "ADMIN" ? (
                <div className="rounded-2xl border border-border bg-background p-4">
                  <p className="font-medium">✅ Admin CRUD</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create, edit, delete, preview-run, and publish problems.
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
                <Button className="w-full rounded-xl gradient-primary text-primary-foreground border-0">
                  Open Problems
                </Button>
              </Link>

              {user?.role === "ADMIN" ? (
                <>
                  <Link to="/create-problem">
                    <Button variant="outline" className="w-full rounded-xl">
                      Create New Problem
                    </Button>
                  </Link>
                  <Link to="/manage-problems">
                    <Button variant="outline" className="w-full rounded-xl">
                      Manage Problems
                    </Button>
                  </Link>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}