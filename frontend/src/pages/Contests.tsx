import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import ContestCard from "@/components/ContestCard";

export default function Contests() {
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState<any[]>([]);

  useEffect(() => {
    // Replace with real API
    const mock = [
      {
        id: "c1",
        title: "Weekly Coding Contest",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
        durationMinutes: 120,
        participants: 284,
        isLive: false,
      },
      {
        id: "c2",
        title: "Beginner Sprint",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        durationMinutes: 90,
        participants: 146,
        isLive: false,
      },
      {
        id: "c3",
        title: "Night Contest Arena",
        startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        durationMinutes: 150,
        participants: 322,
        isLive: true,
      },
    ];

    setContests(mock);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-10"
      >
        {/* HEADER */}
        <div className="spotlight-card p-6 md:p-8">
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              Contests
            </div>

            <h1 className="mt-6 font-heading text-4xl font-black md:text-5xl">
              Compete. Repeat. Improve.
            </h1>

            <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
              Timed contests designed to simulate real pressure. Track performance,
              compare rankings, and build consistency through repetition.
            </p>
          </div>
        </div>

        {/* LIST */}
        <div className="mt-10">
          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading contests...
            </div>
          ) : contests.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No contests available right now.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {contests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          )}
        </div>

        {/* CTA BLOCK */}
        <div className="mt-10 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-heading text-2xl font-bold">
                Want more competitive pressure?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Regular contests help build real problem-solving speed.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Stay consistent
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}