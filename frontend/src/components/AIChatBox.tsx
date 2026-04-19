import { Clock, Trophy, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Contest = {
  id: string | number;
  title: string;
  startTime: string;
  durationMinutes: number;
  participants?: number;
  isLive?: boolean;
};

export default function ContestCard({
  contest,
  onJoin,
}: {
  contest: Contest;
  onJoin?: () => void;
}) {
  const start = new Date(contest.startTime);

  const formatTime = () => {
    return start.toLocaleString();
  };

  const formatDuration = () => {
    const hrs = Math.floor(contest.durationMinutes / 60);
    const mins = contest.durationMinutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/30">

      {contest.isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 border border-red-500/20">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Live
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
          <Trophy className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <h3 className="font-heading text-xl font-bold leading-tight">
            {contest.title}
          </h3>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime()}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration: {formatDuration()}
            </div>

            {contest.participants !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {contest.participants} participants
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {contest.isLive ? "Ongoing Contest" : "Upcoming"}
        </div>

        <Button
          onClick={onJoin}
          className="rounded-xl h-10 px-4 text-sm font-semibold"
        >
          {contest.isLive ? "Join Now" : "Register"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}