import { BarChart3, CheckCircle2, Flame, Target } from "lucide-react";

type Props = {
  title: string;
  solved: number;
  total: number;
  difficulty?: "Easy" | "Medium" | "Hard";
};

function getDifficultyClasses(difficulty?: string) {
  if (difficulty === "Easy") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  }
  if (difficulty === "Medium") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }
  if (difficulty === "Hard") {
    return "border-rose-500/20 bg-rose-500/10 text-rose-400";
  }
  return "border-border/70 bg-background/60 text-muted-foreground";
}

export default function TopicProgressCard({
  title,
  solved,
  total,
  difficulty,
}: Props) {
  const percentage =
    total > 0 ? Math.min(100, Math.round((solved / total) * 100)) : 0;

  return (
    <div className="group relative overflow-hidden rounded-[1.7rem] border border-border/70 bg-card/75 p-5 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.18),transparent_60%)]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold">{title}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Topic progress
              </p>
            </div>
          </div>

          {difficulty ? (
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getDifficultyClasses(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
          ) : null}
        </div>

        {/* Progress numbers */}
        <div className="mt-5 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {solved} / {total} solved
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-foreground">
            <Target className="h-4 w-4 text-primary" />
            {percentage}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Footer motivation */}
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            Keep pushing consistency
          </span>

          {percentage === 100 ? (
            <span className="font-semibold text-emerald-400">
              Completed
            </span>
          ) : percentage > 60 ? (
            <span className="font-semibold text-primary">
              Strong progress
            </span>
          ) : percentage > 30 ? (
            <span>In progress</span>
          ) : (
            <span>Just started</span>
          )}
        </div>
      </div>
    </div>
  );
}