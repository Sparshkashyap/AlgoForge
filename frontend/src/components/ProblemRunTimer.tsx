import { useMemo } from "react";
import { Pause, Play, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isRunning: boolean;
  onStartToggle: () => void;
  onReset: () => void;
  seconds: number;
};

export default function ProblemRunTimer({
  isRunning,
  onStartToggle,
  onReset,
  seconds,
}: Props) {
  const formatted = useMemo(() => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }, [seconds]);

  return (
    <div className="flex items-center gap-2 rounded-[1rem] border border-border/70 bg-background/70 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onStartToggle}
        className="h-9 w-9 rounded-xl border border-border/60 bg-card/70 text-foreground hover:bg-primary/10 hover:text-primary"
        title={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <div className="min-w-[98px] rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Session
        </p>
        <div className="mt-1 text-sm font-semibold tabular-nums text-foreground">
          {formatted}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="h-9 w-9 rounded-xl border border-border/60 bg-card/70 text-foreground hover:bg-rose-500/10 hover:text-rose-400"
        title="Reset timer"
      >
        <TimerReset className="h-4 w-4" />
      </Button>
    </div>
  );
}