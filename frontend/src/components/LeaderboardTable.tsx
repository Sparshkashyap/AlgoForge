import { Crown, Medal, Trophy } from "lucide-react";

type LeaderboardUser = {
  id: string | number;
  name: string;
  score: number;
  solved?: number;
  rank?: number;
};

type Props = {
  users: LeaderboardUser[];
  currentUserId?: string | number;
  title?: string;
};

function getRankIcon(rank: number) {
  if (rank === 1) {
    return <Crown className="h-4 w-4 text-yellow-400" />;
  }

  if (rank === 2) {
    return <Medal className="h-4 w-4 text-slate-300" />;
  }

  if (rank === 3) {
    return <Trophy className="h-4 w-4 text-amber-500" />;
  }

  return null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LeaderboardTable({
  users,
  currentUserId,
  title = "Leaderboard",
}: Props) {
  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/80 p-5 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl font-black">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Track rankings, compare progress, and keep competitive momentum visible.
          </p>
        </div>

        <div className="rounded-full border border-border/70 bg-background/55 px-4 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {users.length} ranked
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-border/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-background/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Rank
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  User
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Score
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Solved
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    No leaderboard data yet.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const rank = user.rank || index + 1;
                  const isCurrentUser = currentUserId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-border/60 transition ${
                        isCurrentUser
                          ? "bg-primary/8"
                          : "bg-card/45 hover:bg-background/35"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full border border-border/70 bg-background/60 px-2 text-sm">
                            #{rank}
                          </span>
                          {getRankIcon(rank)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-border/70 bg-gradient-to-br from-primary/15 to-accent/10 text-sm font-semibold text-primary">
                            {getInitials(user.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">
                              {user.name}
                              {isCurrentUser ? (
                                <span className="ml-2 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-primary">
                                  You
                                </span>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-lg font-bold">{user.score}</p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-muted-foreground">
                          {user.solved ?? "-"}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}