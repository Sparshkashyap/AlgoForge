import { Link } from "react-router-dom";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Problem } from "@/types/problem.types";

const difficultyClasses: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link
      to={`/problems/${problem.slug}`}
      className="group block rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-5 transition hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
            {problem.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {problem.description}
          </p>
        </div>

        <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            difficultyClasses[problem.difficulty] || "bg-muted text-foreground"
          }`}
        >
          {problem.difficulty}
        </span>

        {problem.isPremium ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
            <Lock className="h-3 w-3" />
            Premium
          </span>
        ) : null}

        {problem.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}