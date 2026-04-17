import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { getProblemsApi } from "@/api/problem.api";
import type { Problem } from "@/types/problem.types";
import ProblemCard from "@/components/ProblemCard";

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

const DIFFICULTIES: DifficultyFilter[] = ["All", "Easy", "Medium", "Hard"];

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");

  useEffect(() => {
    getProblemsApi()
      .then((data) => setProblems(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredProblems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return problems.filter((problem) => {
      const searchMatch =
        !q ||
        problem.title.toLowerCase().includes(q) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        problem.difficulty.toLowerCase().includes(q);

      const difficultyMatch =
        difficulty === "All" || problem.difficulty === difficulty;

      return searchMatch && difficultyMatch;
    });
  }, [problems, search, difficulty]);

  const counts = useMemo(() => {
    return {
      total: problems.length,
      easy: problems.filter((p) => p.difficulty === "Easy").length,
      medium: problems.filter((p) => p.difficulty === "Medium").length,
      hard: problems.filter((p) => p.difficulty === "Hard").length,
    };
  }, [problems]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 md:py-10">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="spotlight-card overflow-hidden p-6 md:p-8"
          >
            <div className="feature-glow absolute inset-0 opacity-80" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Public problem bank
              </div>

              <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-6xl">
                Browse problems with better signal, not noise.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                Browse published problems freely. Login is required only when you
                want to run submissions, track progress, and keep your workflow
                connected across sessions.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {["Search by title", "Filter by difficulty", "Open any problem"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/70 bg-background/55 px-4 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
          >
            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Total published
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {counts.total}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Easy / Medium / Hard
              </p>
              <p className="mt-3 text-lg font-semibold">
                {counts.easy} / {counts.medium} / {counts.hard}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Search state
              </p>
              <p className="mt-3 text-lg font-semibold">
                {search.trim() ? "Filtered" : "All visible"}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Active difficulty
              </p>
              <p className="mt-3 text-lg font-semibold">{difficulty}</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 rounded-[1.7rem] border border-border/70 bg-card/65 p-4 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, tag, or difficulty"
                className="h-12 rounded-2xl border-border/70 bg-background/55 pl-11"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((item) => (
                <button
                  key={item}
                  onClick={() => setDifficulty(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    difficulty === item
                      ? item === "Easy"
                        ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-400"
                        : item === "Medium"
                        ? "border-amber-500/30 bg-amber-500/12 text-amber-400"
                        : item === "Hard"
                        ? "border-rose-500/30 bg-rose-500/12 text-rose-400"
                        : "border-primary/30 bg-primary/10 text-primary"
                      : "border-border/70 bg-background/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[1.8rem] border border-border/70 bg-card/65 p-8 text-sm text-muted-foreground backdrop-blur-xl">
            Loading problems...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="mt-8 rounded-[1.8rem] border border-border/70 bg-card/65 p-8 text-muted-foreground backdrop-blur-xl">
            No published problems found for this search/filter.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: index * 0.02 }}
              >
                <ProblemCard problem={problem} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}