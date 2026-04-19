import { useEffect, useMemo, useState } from "react";
import { Clock3, TimerReset } from "lucide-react";

export default function ContestTimer({
  targetTime,
  label = "Contest starts in",
  completedLabel = "Contest is live",
}: {
  targetTime: string;
  label?: string;
  completedLabel?: string;
}) {
  const getRemaining = () => {
    const diff = new Date(targetTime).getTime() - Date.now();
    return Math.max(0, diff);
  };

  const [remaining, setRemaining] = useState(getRemaining());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getRemaining());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  const formatted = useMemo(() => {
    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };
  }, [remaining]);

  const isComplete = remaining <= 0;

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
          {isComplete ? (
            <TimerReset className="h-5 w-5" />
          ) : (
            <Clock3 className="h-5 w-5" />
          )}
        </div>

        <div>
          <p className="font-heading text-xl font-black">
            {isComplete ? completedLabel : label}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(targetTime).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {[
          { value: formatted.days, label: "Days" },
          { value: formatted.hours, label: "Hours" },
          { value: formatted.minutes, label: "Minutes" },
          { value: formatted.seconds, label: "Seconds" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4 text-center"
          >
            <p className="text-2xl font-black tabular-nums">{item.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}