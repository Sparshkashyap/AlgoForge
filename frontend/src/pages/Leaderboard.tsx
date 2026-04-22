import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { getGlobalLeaderboardApi } from "@/api/leaderboard.api";

type LeaderboardItem = {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string | null;
  solvedCount: number;
  score: number;
};

export default function Leaderboard() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await getGlobalLeaderboardApi();
        setItems(res?.data || []);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    void loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <h1 className="text-4xl font-black">Global Leaderboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Real users, real solved counts, real ranking signal.
        </p>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Loading leaderboard...
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                No leaderboard data available.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.userId}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">
                          {item.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Rank #{item.rank}
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">
                          {item.name}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Solved {item.solvedCount}
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        Score {item.score}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}