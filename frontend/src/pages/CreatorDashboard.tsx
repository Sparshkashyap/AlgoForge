import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import API from "@/api/axios";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Crown,
  DraftingCompass,
  FileText,
  Lightbulb,
  Plus,
  Rocket,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";

type CreatorProblem = {
  id: string;
  title: string;
  slug?: string;
  difficulty?: string;
  tags?: string[];
  isPublished?: boolean;
  reviewStatus?: string | null;
  updatedAt?: string;
  createdAt?: string;
};

const statusMeta = (problem: CreatorProblem) => {
  const status = String(problem.reviewStatus || "").toUpperCase();

  if (problem.isPublished) {
    return {
      label: "Published",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    };
  }

  if (status === "SUBMITTED" || status === "UNDER_REVIEW") {
    return {
      label: "In review",
      className: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    };
  }

  if (status === "REJECTED" || status === "CHANGES_REQUESTED") {
    return {
      label: "Needs changes",
      className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    };
  }

  if (status === "APPROVED") {
    return {
      label: "Approved",
      className:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    };
  }

  return {
    label: "Draft",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  };
};

const difficultyClass = (difficulty?: string) => {
  const value = String(difficulty || "").toLowerCase();

  if (value === "easy") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }

  if (value === "medium") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }

  if (value === "hard") {
    return "border-rose-500/20 bg-rose-500/10 text-rose-400";
  }

  return "border-border/70 bg-background/50 text-muted-foreground";
};

const formatDate = (value?: string) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problems, setProblems] = useState<CreatorProblem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await API.get("/problems/me");
        setProblems(Array.isArray(response?.data?.data) ? response.data.data : []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load creator problems"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const stats = useMemo(() => {
    const total = problems.length;
    const published = problems.filter((item) => item.isPublished).length;

    const inReview = problems.filter((item) => {
      const status = String(item.reviewStatus || "").toUpperCase();
      return status === "SUBMITTED" || status === "UNDER_REVIEW";
    }).length;

    const needsChanges = problems.filter((item) => {
      const status = String(item.reviewStatus || "").toUpperCase();
      return status === "REJECTED" || status === "CHANGES_REQUESTED";
    }).length;

    const drafts = problems.filter(
      (item) => !item.isPublished && !item.reviewStatus
    ).length;

    const completionRate = total ? Math.round((published / total) * 100) : 0;

    return {
      total,
      published,
      drafts,
      inReview,
      needsChanges,
      completionRate,
    };
  }, [problems]);

  const recentProblems = useMemo(() => {
    return [...problems]
      .sort((a, b) => {
        const left = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const right = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return right - left;
      })
      .slice(0, 5);
  }, [problems]);

  const nextAction = useMemo(() => {
    if (stats.needsChanges > 0) {
      return {
        title: "Fix requested changes",
        description:
          "Some problems need edits before they can go live. Handle those first.",
        icon: AlertTriangle,
        cta: "Review Problems",
        path: "/manage-problems",
        tone: "text-rose-400",
      };
    }

    if (stats.drafts > 0) {
      return {
        title: "Finish your drafts",
        description:
          "Drafts do not help users until they are submitted for review.",
        icon: DraftingCompass,
        cta: "Continue Drafts",
        path: "/manage-problems",
        tone: "text-amber-400",
      };
    }

    if (stats.total === 0) {
      return {
        title: "Create your first problem",
        description:
          "Start with one sharp problem. Clear statement, strong examples, and real edge cases.",
        icon: Rocket,
        cta: "Create Problem",
        path: "/create-problem",
        tone: "text-primary",
      };
    }

    return {
      title: "Create the next quality problem",
      description:
        "You have momentum. Add another problem with better constraints and hidden tests.",
      icon: Plus,
      cta: "Create Problem",
      path: "/create-problem",
      tone: "text-primary",
    };
  }, [stats]);

  const NextIcon = nextAction.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-10"
      >
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur-2xl md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_30%)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Creator Command Center
              </div>

              <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-6xl">
                Build problems users actually want to solve.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                Welcome, {user?.name || "Creator"}. Your job is not to dump
                content. Your job is to ship clear, testable, interview-grade
                problems that improve the platform.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate("/create-problem")}
                  className="h-12 rounded-xl px-5 shadow-[0_14px_34px_rgba(99,102,241,0.25)]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Problem
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate("/manage-problems")}
                  className="h-12 rounded-xl border-border/70 bg-background/50 px-5"
                >
                  Manage Problems
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.12),transparent_36%)]" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <NextIcon className={`h-5 w-5 ${nextAction.tone}`} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Next best action
                  </p>
                  <h2 className="font-heading text-xl font-black">
                    {nextAction.title}
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {nextAction.description}
              </p>

              <Button
                onClick={() => navigate(nextAction.path)}
                className="mt-6 h-11 w-full rounded-xl"
              >
                {nextAction.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-5 rounded-2xl border border-border/70 bg-background/45 p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <p className="text-sm font-semibold">Quality rule</p>
                </div>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  If your problem does not have edge cases, constraints, and a
                  clear explanation, it is not ready.
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Total
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Problems
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : stats.total}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Live
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Published
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : stats.published}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <DraftingCompass className="h-5 w-5 text-amber-400" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Draft
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Drafts
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : stats.drafts}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Clock3 className="h-5 w-5 text-sky-400" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Queue
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              In Review
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : stats.inReview}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Target className="h-5 w-5 text-fuchsia-400" />
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Quality
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Publish Rate
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : `${stats.completionRate}%`}
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  AI creator tools
                </p>
                <h2 className="mt-2 font-heading text-2xl font-black">
                  Improve quality faster
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Wand2 className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={() => navigate("/create-problem")}
                className="group rounded-2xl border border-border/70 bg-background/45 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">AI-assisted problem draft</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Start a problem with better structure, constraints, and
                      examples.
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/manage-problems")}
                className="group rounded-2xl border border-border/70 bg-background/45 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Review existing problems</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Fix drafts and rejected problems before creating more.
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/manage-problems")}
                className="group rounded-2xl border border-border/70 bg-background/45 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Problem health check</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Find weak statements, missing edge cases, and vague
                      constraints.
                    </p>
                  </div>
                  <Zap className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Recent work
                </p>
                <h2 className="mt-2 font-heading text-2xl font-black">
                  Problem pipeline
                </h2>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate("/manage-problems")}
                className="rounded-xl border-border/70 bg-background/50"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="mt-6 grid gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-2xl border border-border/70 bg-background/45"
                  />
                ))}
              </div>
            ) : recentProblems.length ? (
              <div className="mt-6 grid gap-3">
                {recentProblems.map((problem) => {
                  const meta = statusMeta(problem);

                  return (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          problem.slug
                            ? `/problems/${problem.slug}`
                            : `/create-problem/${problem.id}`
                        )
                      }
                      className="group rounded-2xl border border-border/70 bg-background/45 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold transition group-hover:text-primary">
                            {problem.title || "Untitled Problem"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Updated {formatDate(problem.updatedAt || problem.createdAt)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${meta.className}`}
                          >
                            {meta.label}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${difficultyClass(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty || "Unset"}
                          </span>
                        </div>
                      </div>

                      {Array.isArray(problem.tags) && problem.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {problem.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.6rem] border border-dashed border-border bg-background/40 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-heading text-xl font-black">
                  No problems yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                  Start with one strong problem. Bad content hurts trust more
                  than no content.
                </p>

                <Button
                  onClick={() => navigate("/create-problem")}
                  className="mt-5 rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Problem
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Creator reputation
              </p>
              <h2 className="mt-2 font-heading text-2xl font-black">
                Build credibility through quality
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-300">
              <Crown className="h-4 w-4" />
              Rising Creator
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <p className="text-sm font-semibold">Quality score</p>
              <p className="mt-2 text-2xl font-black">
                {stats.total ? Math.max(45, stats.completionRate) : 0}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Based on publish rate and review progress.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <p className="text-sm font-semibold">Focus area</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {stats.needsChanges > 0
                  ? "Fix review feedback first."
                  : stats.drafts > 0
                    ? "Complete drafts before creating more."
                    : "Ship more high-quality problems."}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <p className="text-sm font-semibold">Creator rule</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                One excellent problem is better than ten weak ones.
              </p>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}