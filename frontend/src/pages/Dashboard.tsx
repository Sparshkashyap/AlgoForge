import { format } from "date-fns";
import { Navigate, Link } from "react-router-dom";
import {
  CalendarClock,
  Flame,
  ShieldCheck,
  Sparkles,
  Trophy,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Bookmark,
  Bot,
  Map,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import API from "@/api/axios";
import AIChatBox from "@/components/AIChatBox";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);

  const role = String(user?.role ?? "USER");

  useEffect(() => {
    if (!user) return;

    API.get("/submissions/analytics/me")
      .then((res) => setAnalytics(res.data.data))
      .catch(() => {});

    API.get("/gamification/me")
      .then((res) => setGamification(res.data.data))
      .catch(() => {});
  }, [user]);

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
                Your home base should expose real product depth: roadmap,
                analytics, AI help, bookmarks, contests, and progress signal.
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

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 xl:min-w-[380px]">
              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Problems solved
                </p>
                <p className="mt-3 font-heading text-4xl font-black">
                  {gamification?.solvedCount ?? user?.solvedCount ?? 0}
                </p>
              </div>

              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Streak
                </p>
                <p className="mt-3 font-heading text-4xl font-black">
                  {gamification?.streak ?? user?.streak ?? 0}d
                </p>
              </div>

              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Accepted
                </p>
                <p className="mt-3 font-heading text-4xl font-black">
                  {analytics?.totals?.accepted ?? 0}
                </p>
              </div>

              <div className="metric-card">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Next milestone
                </p>
                <p className="mt-3 font-heading text-4xl font-black">
                  {gamification?.nextMilestone ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.12)}
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
                  Browse, bookmark, solve, discuss, and keep notes instead of
                  treating problem pages as dumb text pages.
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-border/70 bg-background/55 p-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <p className="font-medium">AI should support thinking</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Use AI mentor and AI chat for explanation and direction, not
                  to bypass the work.
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-border/70 bg-background/55 p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <p className="font-medium">Track your actual signal</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Analytics and streaks matter more than random problem count.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.2)}
          >
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold">Quick actions</h2>
            </div>

            <div className="grid gap-3">
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
                  <Bookmark className="mr-2 h-4 w-4" />
                  View Bookmarks
                </Button>
              </Link>

              <Link to="/roadmap">
                <Button variant="outline" className="w-full rounded-xl">
                  <Map className="mr-2 h-4 w-4" />
                  Learning Roadmap
                </Button>
              </Link>

              <Link to="/submission-analytics">
                <Button variant="outline" className="w-full rounded-xl">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Submission Analytics
                </Button>
              </Link>

              <Link to="/ai-chat">
                <Button variant="outline" className="w-full rounded-xl">
                  <Bot className="mr-2 h-4 w-4" />
                  AI Chat
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-6" {...fade(0.26)}>
          <AIChatBox />
        </motion.div>

        <motion.div
          className="mt-6 rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl"
          {...fade(0.28)}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary/80">
            <Sparkles className="h-3.5 w-3.5" />
            Practice note
          </div>

          <p className="mt-4 text-sm leading-8 text-muted-foreground">
            Random hustle is not progress. Use the roadmap, review wrong answers,
            bookmark hard problems, and use the analytics page to spot patterns.
          </p>
        </motion.div>
      </div>
    </div>
  );
}