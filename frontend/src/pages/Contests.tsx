import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Trophy, Users, Clock3 } from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { listContestsApi } from "@/api/contest.api";
import { Button } from "@/components/ui/button";

type Contest = {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  problems: Array<{
    id: string;
    problem: {
      id: string;
      title: string;
      slug: string;
      difficulty: string;
    };
  }>;
  registrations: Array<{ id: string }>;
};

const getContestStatus = (startAt: string, endAt: string) => {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Live";
  return "Ended";
};

export default function Contests() {
  const [items, setItems] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await listContestsApi();
        setItems(res?.data || []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load contests"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const grouped = useMemo(() => {
    return {
      live: items.filter(
        (contest) => getContestStatus(contest.startAt, contest.endAt) === "Live"
      ),
      upcoming: items.filter(
        (contest) =>
          getContestStatus(contest.startAt, contest.endAt) === "Upcoming"
      ),
      ended: items.filter(
        (contest) => getContestStatus(contest.startAt, contest.endAt) === "Ended"
      ),
    };
  }, [items]);

  const renderList = (list: Contest[]) => {
    if (list.length === 0) {
      return (
        <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          Nothing here.
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {list.map((contest) => {
          const status = getContestStatus(contest.startAt, contest.endAt);

          return (
            <div
              key={contest.id}
              className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold">{contest.title}</h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em] ${
                        status === "Live"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : status === "Upcoming"
                          ? "border border-primary/30 bg-primary/10 text-primary"
                          : "border border-border/70 text-muted-foreground"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {contest.description || "No description"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      Starts: {new Date(contest.startAt).toLocaleString()}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Ends: {new Date(contest.endAt).toLocaleString()}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Problems: {contest.problems?.length || 0}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Registrations: {contest.registrations?.length || 0}
                    </span>
                  </div>
                </div>

                <Button asChild className="rounded-xl">
                  <Link to={`/contests/${contest.id}`}>Open contest</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 md:py-16">
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            Contests
          </div>

          <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-5xl">
            Compete with a clear schedule.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground">
            Contest pages should immediately show what is live, what is upcoming,
            and what is already done. Hidden state is bad product.
          </p>
        </div>

        <div className="mt-8 space-y-10">
          <section>
            <h2 className="text-2xl font-black">Live</h2>
            <div className="mt-4">
              {loading ? (
                <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  Loading contests...
                </div>
              ) : (
                renderList(grouped.live)
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black">Upcoming</h2>
            <div className="mt-4">{renderList(grouped.upcoming)}</div>
          </section>

          <section>
            <h2 className="text-2xl font-black">Ended</h2>
            <div className="mt-4">{renderList(grouped.ended)}</div>
          </section>
        </div>
      </div>
    </div>
  );
}