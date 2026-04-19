import { Award, Sparkles, Trophy } from "lucide-react";

export default function UserBadgeCard({
  title,
  description,
  awardedAt,
}: {
  title: string;
  description: string;
  awardedAt: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.7rem] border border-border/70 bg-card/80 p-5 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,255,0.18),transparent_60%)]" />

      <div className="relative z-10">
        {/* top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-heading text-lg font-bold leading-tight">
                {title}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Achievement unlocked
              </p>
            </div>
          </div>

          <div className="rounded-full border border-border/70 bg-background/60 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Badge
          </div>
        </div>

        {/* description */}
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        {/* bottom */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Award className="h-3.5 w-3.5" />
            Awarded on{" "}
            <span className="font-medium text-foreground/90">
              {new Date(awardedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="h-3 w-3" />
            Earned
          </div>
        </div>
      </div>
    </div>
  );
}