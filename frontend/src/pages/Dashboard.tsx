import { format } from "date-fns";
import { Navigate, Link } from "react-router-dom";
import {
  CalendarClock,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  ArrowRight,
  BookOpen,
  BrainCircuit,
} from "lucide-react";
import { motion } from "framer-motion";
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
    accent: "text-amber-400",
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 md:py-10">
        {/* HERO */}
        <motion.div
          className="spotlight-card overflow-hidden p-6 md:p-8"
          {...fade()}
        >
          <div className="feature-glow absolute inset-0 opacity-80" />

          <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Authenticated workspace
              </div>

              <p className="mt-6 text-xs uppercase tracking-[0.32em] text-primary/80">
                Personal Dashboard
              </p>

              <h1 className="mt-3 font-heading text-4xl font-black tracking-tight md:text-6xl">
                {user?.name || "Coder"}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                This is your command center for solving, tracking progress, and
                keeping your practice consistent. Less noise. Better momentum.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:min-w-[280px]">
              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Problems solved
                </p>
                <p className="mt-3 font-heading text-4xl font-black">
                  {user?.solvedCount ?? 0}
                </p>
              </div>

              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Streak
                </p>
                <p className="mt-3 font-heading text-4xl font-black">
                  {user?.streak ?? 0}d
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
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
                className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
                {...fade(index * 0.08)}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`h-5 w-5 ${card.accent}`} />
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="mt-4 font-heading text-3xl font-black">
                  {value}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {card.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* MAIN GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.15)}
          >
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-xl font-bold">
                What matters right now
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.3rem] border border-border/70 bg-background/55 p-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <p className="font-medium">Problem bank is live</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Browse and read problems freely, then solve the ones that match
                  your current prep target.
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-border/70 bg-background/55 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="font-medium">Submissions stay protected</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Reading is open. Real attempts and progress stay tied to your
                  authenticated account.
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-border/70 bg-background/55 p-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <p className="font-medium">Use AI only when it helps thinking</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Hints and reviews should move you forward, not become a crutch.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.22)}
          >
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold">
                Quick actions
              </h2>
            </div>

            <div className="space-y-3">
              <Link to="/problems">
                <Button className="w-full rounded-xl border-0 bg-primary text-primary-foreground">
                  Open Problems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/daily-question">
                <Button variant="outline" className="w-full rounded-xl">
                  Daily Question
                </Button>
              </Link>

              <Link to="/bookmarks">
                <Button variant="outline" className="w-full rounded-xl">
                  View Bookmarks
                </Button>
              </Link>

              <Link to="/profile">
                <Button variant="outline" className="w-full rounded-xl">
                  Manage Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM NOTE */}
        <motion.div
          className="mt-6 rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl"
          {...fade(0.28)}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary/80">
            <Sparkles className="h-3.5 w-3.5" />
            Practice note
          </div>

          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            Don’t chase random difficulty for the sake of ego. Build consistent
            reps, review mistakes properly, and let momentum compound.
          </p>
        </motion.div>
      </div>
    </div>
  );
}