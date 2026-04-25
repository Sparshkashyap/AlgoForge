import { useEffect, useState } from "react";
import { Trophy, Users, CheckCircle2, Send, Medal } from "lucide-react";
import { toast } from "react-toastify";
import { getContestRankingApi } from "@/api/contest.api";

type LeaderboardRow = {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  solved: number;
  score: number;
  attempts: number;
  penalty: number;
  solvedProblems: Array<{
    problemId: string;
    title: string;
    difficulty: string;
    score: number;
    wrongAttempts: number;
    penalty: number;
    acceptedAt: string;
  }>;
};

export default function ContestLeaderboard({
  contestId,
}: {
  contestId: string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getContestRankingApi(contestId);
      setData(res?.data || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contestId) void load();
  }, [contestId]);

  const rows: LeaderboardRow[] = data?.rows || [];

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </div>

          <h2 className="mt-4 text-2xl font-black">
            {data?.contest?.title || "Contest Rankings"}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
            <Users className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-lg font-black">
              {data?.summary?.participants || 0}
            </p>
            <p className="text-[10px] uppercase text-muted-foreground">
              Players
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
            <Send className="mx-auto h-4 w-4 text-blue-400" />
            <p className="mt-1 text-lg font-black">
              {data?.summary?.totalSubmissions || 0}
            </p>
            <p className="text-[10px] uppercase text-muted-foreground">
              Submits
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" />
            <p className="mt-1 text-lg font-black">
              {data?.summary?.acceptedSubmissions || 0}
            </p>
            <p className="text-[10px] uppercase text-muted-foreground">
              Accepted
            </p>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-background/50 p-6 text-sm text-muted-foreground">
          No participants yet.
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-[70px_1fr_90px_90px_90px] bg-background/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <div>Rank</div>
            <div>User</div>
            <div>Score</div>
            <div>Solved</div>
            <div>Penalty</div>
          </div>

          {rows.map((row) => (
            <div
              key={row.userId}
              className="grid grid-cols-[70px_1fr_90px_90px_90px] items-center border-t border-border px-4 py-4 text-sm"
            >
              <div className="flex items-center gap-2 font-bold">
                {row.rank <= 3 ? (
                  <Medal className="h-4 w-4 text-amber-400" />
                ) : null}
                #{row.rank}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold">{row.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.email}
                </p>
              </div>

              <div className="font-black">{row.score}</div>
              <div>{row.solved}</div>
              <div>{row.penalty}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}