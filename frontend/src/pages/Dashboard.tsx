import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigate, Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  Map,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  XCircle,
  UserCircle2,
  Medal,
} from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import API from "@/api/axios";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

type SubmissionItem = {
  id?: string;
  problemTitle?: string;
  title?: string;
  status?: string;
  language?: string;
  createdAt?: string;
  slug?: string;
};

type RecommendationItem = {
  id?: string;
  title: string;
  difficulty?: string;
  tags?: string[];
  slug?: string;
};

const getInitials = (name?: string) => {
  if (!name) return "AF";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [gamification, setGamification] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);

  const role = String(user?.role ?? "USER");

  const usernameLabel = user?.username ? `@${user.username}` : null;

  const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/urban-monster-fusion-street-culture-fantasy_1230457-40156.jpg";

const avatarSrc =
  user?.avatarUrl && user.avatarUrl.trim() !== ""
    ? user.avatarUrl
    : DEFAULT_AVATAR;

  useEffect(() => {
    if (!user) return;

    Promise.allSettled([
      API.get("/submissions/analytics/me"),
      API.get("/gamification/me"),
      API.get("/users/dashboard"),
    ]).then(([analyticsRes, gamificationRes, dashboardRes]) => {
      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value.data.data);
      }

      if (gamificationRes.status === "fulfilled") {
        setGamification(gamificationRes.value.data.data);
      }

      if (dashboardRes.status === "fulfilled") {
        setDashboard(dashboardRes.value.data.data);
      }
    });
  }, [user]);


  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "dd MMM yyyy")
    : "Recently joined";

 const recentSubmissions = useMemo<SubmissionItem[]>(() => {
  return (
    dashboard?.recentActivity ||
    analytics?.recentSubmissions ||
    analytics?.recent ||
    []
  );
}, [dashboard?.recentActivity, analytics?.recentSubmissions, analytics?.recent]);

  const acceptedCount =
    analytics?.totals?.accepted ??
    analytics?.accepted ??
    recentSubmissions.filter((item) =>
      String(item?.status || "").toLowerCase().includes("accept")
    ).length ??
    0;

  const totalSubmissions =
    analytics?.totals?.submissions ??
    analytics?.totals?.totalSubmissions ??
    analytics?.submissions ??
    recentSubmissions.length ??
    0;

  const accuracy =
    totalSubmissions > 0
      ? Math.round((acceptedCount / totalSubmissions) * 100)
      : 0;

  const solvedCount =
    gamification?.solvedCount ??
    dashboard?.stats?.totalSolved ??
    user?.solvedCount ??
    0;



    const easySolved = dashboard?.stats?.easySolved ?? gamification?.easySolved ?? 0;
const mediumSolved = dashboard?.stats?.mediumSolved ?? gamification?.mediumSolved ?? 0;
const hardSolved = dashboard?.stats?.hardSolved ?? gamification?.hardSolved ?? 0;

const easyTotal = dashboard?.stats?.easyTotal ?? 0;
const mediumTotal = dashboard?.stats?.mediumTotal ?? 0;
const hardTotal = dashboard?.stats?.hardTotal ?? 0;

const totalTarget = easyTotal + mediumTotal + hardTotal;


  const streakCount =
    gamification?.streak ?? dashboard?.gamification?.streak ?? user?.streak ?? 0;

  const nextMilestone =
    gamification?.nextMilestone ??
    dashboard?.gamification?.nextMilestone ??
    `Reach ${Math.ceil((solvedCount + 1) / 25) * 25} solved`;

  const continueProblem = useMemo(() => {
    const firstRecent = recentSubmissions?.[0];
    if (!firstRecent) return null;

    return {
      title: firstRecent.problemTitle || firstRecent.title || "Resume problem",
      slug: firstRecent.slug || null,
      status: firstRecent.status || "In Progress",
      language: firstRecent.language || "Code",
      time: firstRecent.createdAt || null,
    };
  }, [recentSubmissions]);


      if (role === "ADMIN") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (role === "CREATOR") {
    return <Navigate to="/creator-dashboard" replace />;
  }



  const recommendations: RecommendationItem[] =
    dashboard?.recommendations?.length
      ? dashboard.recommendations
      : [
          {
            id: "rec-1",
            title: "Binary Search Revision",
            difficulty: "Easy",
            tags: ["Binary Search", "Array"],
            slug: null,
          },
          {
            id: "rec-2",
            title: "Two Pointers Progression",
            difficulty: "Medium",
            tags: ["Two Pointers", "Greedy"],
            slug: null,
          },
          {
            id: "rec-3",
            title: "Graph Traversal Warmup",
            difficulty: "Medium",
            tags: ["Graph", "BFS"],
            slug: null,
          },
        ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />



      <div className="container py-8 md:py-10">
        <motion.section
          className="spotlight-card overflow-hidden p-6 md:p-8"
          {...fade()}
        >
          <div className="feature-glow absolute inset-0 opacity-80" />

          <div className="relative z-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">

            <div className="flex flex-col gap-6">

  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

    <div className="relative shrink-0">
  <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-emerald-400/20 blur-xl" />

  <div className="relative rounded-[2rem] border border-white/10 bg-background/70 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
    <Avatar className="h-20 w-20 rounded-[1.5rem] border border-border/70 md:h-24 md:w-24">
      <AvatarImage
        src={avatarSrc}
        alt={user?.name || "User"}
        className="object-cover"
      />
      <AvatarFallback className="rounded-[1.5rem] bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-black text-primary">
        {getInitials(user?.name)}
      </AvatarFallback>
    </Avatar>
  </div>

  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-background bg-emerald-500 shadow-sm" />
</div>
    

    <div>
      
      <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        Personal workspace
      </div>

      <h1 className="mt-4 font-heading text-4xl font-black tracking-tight md:text-6xl pb-4">
        {user?.name || "Coder"}
      </h1>

      {usernameLabel && (
        <p className="mt-1 text-sm font-medium tracking-wide text-primary/80">
          {usernameLabel}
        </p>
      )}
    </div>
  </div>

  <p className="max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
    Focus on the next useful move, not random hustle. Continue solving,
    review recent results, and push your weak areas deliberately.
  </p>

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

    {user?.isBlocked && (
      <Badge className="rounded-full border-red-500/20 bg-red-500/10 px-3 py-1 text-red-500">
        Blocked
      </Badge>
    )}
  </div>

  <div className="flex flex-wrap gap-3">
    <Link to={continueProblem?.slug ? `/problems/${continueProblem.slug}` : "/problems"}>
      <Button className="rounded-xl border-0 bg-primary text-primary-foreground">
        Continue Solving
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>

    <Link to="/submission-analytics">
      <Button variant="outline" className="rounded-xl">
        <BarChart3 className="mr-2 h-4 w-4" />
        View Analytics
      </Button>
    </Link>
  </div>
</div>



<div className="grid gap-4 sm:grid-cols-2">
 <DifficultyProgressRing
  easySolved={easySolved}
  easyTotal={easyTotal}
  mediumSolved={mediumSolved}
  mediumTotal={mediumTotal}
  hardSolved={hardSolved}
  hardTotal={hardTotal}
/>
</div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Personal workspace
              </div>

              <p className="mt-6 text-xs uppercase tracking-[0.32em] text-primary/80">
                User dashboard
              </p>

             
              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                Focus on the next useful move, not random hustle. Continue solving,
                review recent results, and push your weak areas deliberately.
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

                {user?.isBlocked && (
  <Badge className="rounded-full border-red-500/20 bg-red-500/10 px-3 py-1 text-red-500">
    Blocked
  </Badge>
)}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={continueProblem?.slug ? `/problems/${continueProblem.slug}` : "/problems"}>
                  <Button className="rounded-xl border-0 bg-primary text-primary-foreground">
                    Continue Solving
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/submission-analytics">
                  <Button variant="outline" className="rounded-xl">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <MetricCard
                icon={<Trophy className="h-4 w-4 text-accent" />}
                label="Problems solved"
                value={solvedCount}
                hint="Total accepted problem count"
              />
              <MetricCard
                icon={<Flame className="h-4 w-4 text-orange-500" />}
                label="Current streak"
                value={`${streakCount}d`}
                hint="Consecutive active days"
              />
              <MetricCard
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                label="Accepted"
                value={acceptedCount}
                hint="Successful submissions"
              />
              <MetricCard
                icon={<Target className="h-4 w-4 text-primary" />}
                label="Accuracy"
                value={`${accuracy}%`}
                hint="Accepted / total submissions"
              />
            </div>
          </div>
        </motion.section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.08)}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-primary/80">
                  Continue where you left off
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold">
                  Resume momentum
                </h2>
              </div>
              <Clock3 className="h-5 w-5 text-muted-foreground" />
            </div>

            {continueProblem ? (
              <div className="rounded-[1.4rem] border border-border/70 bg-background/55 p-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Last touched problem
                    </p>
                    <h3 className="mt-2 truncate text-xl font-semibold">
                      {continueProblem.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="rounded-full">
                        {continueProblem.status}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        {continueProblem.language}
                      </Badge>
                      {continueProblem.time ? (
                        <Badge variant="outline" className="rounded-full">
                          {format(new Date(continueProblem.time), "dd MMM, hh:mm a")}
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-3">
                    <Link
                      to={
                        continueProblem.slug
                          ? `/problems/${continueProblem.slug}`
                          : "/problems"
                      }
                    >
                      <Button className="rounded-xl">
                        Resume
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyBlock
                title="No recent problem found"
                description="Start solving a problem and your active workspace will appear here."
                ctaLabel="Open Problems"
                ctaHref="/problems"
              />
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MiniStat
                label="Total submissions"
                value={totalSubmissions}
                tone="default"
              />
              <MiniStat
                label="Next milestone"
                value={nextMilestone}
                tone="primary"
              />
              <MiniStat
                label="Bookmarks"
                value={dashboard?.bookmarksCount ?? "Track later"}
                tone="accent"
              />
            </div>
          </motion.section>

          <motion.section
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.14)}
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
            </div>
          </motion.section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <motion.section
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.2)}
          >
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold">
                Recent submissions
              </h2>
            </div>

            {recentSubmissions.length ? (
              <div className="space-y-3">
                {recentSubmissions.slice(0, 6).map((item, index) => {
                  const accepted = String(item?.status || "")
                    .toLowerCase()
                    .includes("accept");

                  return (
                    <div
                      key={item?.id || `${item?.title || item?.problemTitle}-${index}`}
                      className="flex items-center justify-between rounded-[1.2rem] border border-border/70 bg-background/55 px-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {item.problemTitle || item.title || "Problem"}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {item.language ? <span>{item.language}</span> : null}
                          {item.createdAt ? (
                            <span>
                              {format(new Date(item.createdAt), "dd MMM, hh:mm a")}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div
                        className={`ml-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          accepted
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {accepted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {item.status || "Submitted"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyBlock
                title="No submissions yet"
                description="Your latest submissions and verdicts should show here after you start solving."
                ctaLabel="Start Solving"
                ctaHref="/problems"
              />
            )}
          </motion.section>

          <motion.section
            className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl"
            {...fade(0.24)}
          >
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-xl font-bold">
                Recommended next steps
              </h2>
            </div>

            <div className="space-y-3">
              {recommendations.slice(0, 4).map((item, index) => (
                <div
                  key={item.id || `${item.title}-${index}`}
                  className="rounded-[1.2rem] border border-border/70 bg-background/55 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.difficulty ? (
                          <Badge variant="outline" className="rounded-full">
                            {item.difficulty}
                          </Badge>
                        ) : null}
                        {(item.tags || []).slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link to={item.slug ? `/problems/${item.slug}` : "/problems"}>
                      <Button variant="outline" className="rounded-xl">
                        Open
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

    </div>
  );
}

function DifficultyProgressRing({
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal,
}: {
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}) {
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalProblems = easyTotal + mediumTotal + hardTotal;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  const easyPercent = totalProblems > 0 ? easySolved / totalProblems : 0;
  const mediumPercent = totalProblems > 0 ? mediumSolved / totalProblems : 0;
  const hardPercent = totalProblems > 0 ? hardSolved / totalProblems : 0;

  const easyLength = circumference * easyPercent;
  const mediumLength = circumference * mediumPercent;
  const hardLength = circumference * hardPercent;

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-background/60 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.14)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_35%)]" />

      <div className="relative z-10 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="flex justify-center">
          <div className="relative h-[190px] w-[190px]">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted/30"
              />

              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                className="text-emerald-500"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{
                  strokeDasharray: `${easyLength} ${circumference}`,
                  strokeDashoffset: 0,
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />

              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                className="text-amber-500"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{
                  strokeDasharray: `${mediumLength} ${circumference}`,
                  strokeDashoffset: -easyLength,
                }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
              />

              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                className="text-rose-500"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{
                  strokeDasharray: `${hardLength} ${circumference}`,
                  strokeDashoffset: -(easyLength + mediumLength),
                }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-black">{totalSolved}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                solved
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                out of {totalProblems}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <DifficultyRow
            label="Easy"
            solved={easySolved}
            total={easyTotal}
            className="bg-emerald-500"
          />

          <DifficultyRow
            label="Medium"
            solved={mediumSolved}
            total={mediumTotal}
            className="bg-amber-500"
          />

          <DifficultyRow
            label="Hard"
            solved={hardSolved}
            total={hardTotal}
            className="bg-rose-500"
          />
        </div>
      </div>
    </div>
  );
}

function DifficultyRow({
  label,
  solved,
  total,
  className,
}: {
  label: string;
  solved: number;
  total: number;
  className: string;
}) {
  const percent = total > 0 ? Math.min((solved / total) * 100, 100) : 0;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
          <p className="text-sm font-semibold">{label}</p>
        </div>

        <p className="text-sm font-bold">
          {solved}
          <span className="text-muted-foreground">/{total}</span>
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${className}`}
        />
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-3 font-heading text-4xl font-black">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "default" | "primary" | "accent";
}) {
  const toneClass =
    tone === "primary"
      ? "border-primary/20 bg-primary/5"
      : tone === "accent"
      ? "border-accent/20 bg-accent/5"
      : "border-border/70 bg-background/55";

  return (
    <div className={`rounded-[1.2rem] border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

function EmptyBlock({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="rounded-[1.3rem] border border-dashed border-border/70 bg-background/45 p-5">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      <div className="mt-4">
        <Link to={ctaHref}>
          <Button variant="outline" className="rounded-xl">
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}