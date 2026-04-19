import { Sparkles, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type RoadmapItem = {
  title: string;
  description: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  completed?: boolean;
};

export default function AIRoadmapSuggestions({
  title = "AI Roadmap Suggestions",
  subtitle = "A guided path based on your current progress and likely next best moves.",
  items = [],
  onAction,
  actionLabel = "View Full Roadmap",
}: {
  title?: string;
  subtitle?: string;
  items?: RoadmapItem[];
  onAction?: () => void;
  actionLabel?: string;
}) {
  const hasItems = items.length > 0;

  const getLevelClasses = (level?: string) => {
    if (level === "Beginner") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }
    if (level === "Intermediate") {
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }
    if (level === "Advanced") {
      return "border-rose-500/20 bg-rose-500/10 text-rose-400";
    }
    return "border-border/70 bg-background/60 text-muted-foreground";
  };

  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI guided path
          </div>

          <h3 className="mt-4 font-heading text-2xl font-black">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {onAction ? (
          <Button
            type="button"
            onClick={onAction}
            variant="outline"
            className="rounded-xl border-border/70 bg-background/55"
          >
            {actionLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {hasItems ? (
          items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4 transition hover:border-primary/25"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.completed ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        <Target className="h-3.5 w-3.5" />
                        Next step
                      </span>
                    )}

                    {item.level ? (
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getLevelClasses(
                          item.level
                        )}`}
                      >
                        {item.level}
                      </span>
                    ) : null}
                  </div>

                  <h4 className="mt-4 text-lg font-semibold leading-tight text-foreground">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-5 text-sm text-muted-foreground">
            No roadmap suggestions available yet.
          </div>
        )}
      </div>
    </div>
  );
}