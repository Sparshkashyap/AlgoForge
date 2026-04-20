import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Trophy } from "lucide-react";
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
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading contests...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-4 text-base font-medium">
                No contests available
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((contest) => (
                <div
                  key={contest.id}
                  className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-bold">
                        {contest.title}
                      </h2>

                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {contest.description || "No description"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>
                          Starts:{" "}
                          {new Date(contest.startAt).toLocaleString()}
                        </span>
                        <span>
                          Ends:{" "}
                          {new Date(contest.endAt).toLocaleString()}
                        </span>
                        <span>
                          Problems: {contest.problems?.length || 0}
                        </span>
                        <span>
                          Registrations:{" "}
                          {contest.registrations?.length || 0}
                        </span>
                      </div>
                    </div>

                    <Button asChild className="rounded-xl">
                      <Link to={`/contests/${contest.id}`}>
                        Open contest
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}