import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Clock3, Users, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import ContestTimer from "@/components/ContestTimer";
import LeaderboardTable from "@/components/LeaderboardTable";
import ContestCard from "@/components/ContestCard";

export default function ContestDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [relatedContests, setRelatedContests] = useState<any[]>([]);

  useEffect(() => {
    // Replace this block with your real API call later
    const mockContest = {
      id,
      title: "Weekly Coding Contest",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      durationMinutes: 120,
      participants: 284,
      isLive: false,
      description:
        "Solve a curated set of interview-style problems under timed pressure and compete on the live leaderboard.",
    };

    const mockLeaderboard = [
      { id: 1, name: "Aman Sethi", score: 980, solved: 4, rank: 1 },
      { id: 2, name: "Priya Kulkarni", score: 940, solved: 4, rank: 2 },
      { id: 3, name: "Rohan Verma", score: 890, solved: 3, rank: 3 },
      { id: 4, name: "Sparsh", score: 840, solved: 3, rank: 4 },
    ];

    const mockRelated = [
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
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
        durationMinutes: 150,
        participants: 322,
        isLive: false,
      },
    ];

    setContest(mockContest);
    setLeaderboard(mockLeaderboard);
    setRelatedContests(mockRelated);
    setLoading(false);
  }, [id]);

  const summary = useMemo(() => {
    return {
      participants: contest?.participants ?? 0,
      duration: contest?.durationMinutes
        ? `${Math.floor(contest.durationMinutes / 60)}h ${
            contest.durationMinutes % 60
          }m`
        : "-",
      status: contest?.isLive ? "Live" : "Upcoming",
    };
  }, [contest]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8 md:py-10"
      >
        {loading ? (
          <div className="rounded-[1.8rem] border border-border/70 bg-card/70 p-8 text-sm text-muted-foreground backdrop-blur-xl">
            Loading contest details...
          </div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="spotlight-card overflow-hidden p-6 md:p-8">
                <div className="feature-glow absolute inset-0 opacity-80" />
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                    Contest details
                  </div>

                  <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-6xl">
                    {contest.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                    {contest.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Players
                    </span>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Participants
                  </p>
                  <p className="mt-2 font-heading text-3xl font-black">
                    {summary.participants}
                  </p>
                </div>

                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <Clock3 className="h-5 w-5 text-accent" />
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Format
                    </span>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Duration
                  </p>
                  <p className="mt-2 font-heading text-3xl font-black">
                    {summary.duration}
                  </p>
                </div>

                <div className="metric-card">
                  <div className="flex items-center justify-between">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Status
                    </span>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    State
                  </p>
                  <p className="mt-2 font-heading text-3xl font-black">
                    {summary.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <ContestTimer
                targetTime={contest.startTime}
                label="Contest starts in"
                completedLabel="Contest is live"
              />

              <div className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl">
                <h3 className="font-heading text-2xl font-black">
                  Contest Overview
                </h3>
                <p className="mt-4 text-sm leading-8 text-muted-foreground">
                  Compete under pressure, compare your score on the leaderboard,
                  and use contests to sharpen repeatable performance rather than
                  one-off effort.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <LeaderboardTable
                users={leaderboard}
                title="Contest Leaderboard"
              />
            </div>

            {relatedContests.length > 0 && (
              <div className="mt-8">
                <h2 className="font-heading text-3xl font-black">
                  More contests
                </h2>

                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {relatedContests.map((item) => (
                    <ContestCard
                      key={item.id}
                      contest={item}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}