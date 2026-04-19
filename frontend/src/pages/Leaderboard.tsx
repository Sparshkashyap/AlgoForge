import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import LeaderboardTable from "@/components/LeaderboardTable";
import { getLeaderboardApi } from "@/api/user.api";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboardApi()
      .then((res) => setData(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-bold">Leaderboard</h1>
          <p className="mt-2 text-muted-foreground">
            Top performers ranked by consistency and problem solving.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-muted-foreground">Loading leaderboard...</div>
        ) : (
          <LeaderboardTable users={data} />
        )}
      </div>
    </div>
  );
}