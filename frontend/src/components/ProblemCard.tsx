import { Link } from "react-router-dom";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";
import type { Problem } from "@/types/problem.types";

const difficultyClasses: Record<string, string> = {
  Easy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Medium: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Hard: "border-rose-500/20 bg-rose-500/10 text-rose-400",
};

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="group relative block overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/70 p-5 backdrop-blur-2xl transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
    >
      {/* subtle glow */}
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(124,92,255,0.12),transparent_40%)]" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* TOP */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-bold leading-snug transition group-hover:text-primary">
                {problem.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {problem.description}
              </p>
            </div>

            <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
          </div>

          {/* TAG ROW */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                difficultyClasses[problem.difficulty] ||
                "border-border bg-muted text-foreground"
              }`}
            >
              {problem.difficulty}
            </span>

            {problem.isPremium ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-yellow-400">
                <Lock className="h-3 w-3" />
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3 w-3" />
                Public
              </span>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {problem.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}