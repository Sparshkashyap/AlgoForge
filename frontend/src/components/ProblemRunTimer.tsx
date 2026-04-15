import { useEffect, useMemo, useState } from "react";
import { TimerReset, Play, Pause } from "lucide-react";
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
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-2 py-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onStartToggle}
        className="h-8 w-8 rounded-lg"
        title={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <div className="min-w-[84px] text-center text-sm font-medium tabular-nums">
        {formatted}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onReset}
        className="h-8 w-8 rounded-lg"
        title="Reset timer"
      >
        <TimerReset className="h-4 w-4" />
      </Button>
    </div>
  );
}