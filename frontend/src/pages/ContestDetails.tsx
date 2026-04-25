import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getContestByIdApi, registerForContestApi } from "@/api/contest.api";
import { useAuth } from "@/context/AuthContext";
import ContestLeaderboard from "@/components/ContestLeaderboard"; // add at top

type ContestDetailsType = {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  isRegistered: boolean;
  problems: Array<{
    id: string;
    sortOrder: number;
    problem: {
      id: string;
      title: string;
      slug: string;
      difficulty: string;
      tags: string[];
    };
  }>;
};

const getContestStatus = (startAt: string, endAt: string) => {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (now < start) return "Upcoming";
  if (now >= start && now <= end) return "Live";
  return "Ended";
};

export default function ContestDetails() {
  const { contestId = "" } = useParams();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState<ContestDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getContestByIdApi(contestId);
      setItem(res?.data || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load contest");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [contestId]);

  const status = useMemo(() => {
    if (!item) return "Upcoming";
    return getContestStatus(item.startAt, item.endAt);
  }, [item]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await registerForContestApi(contestId);
      toast.success("Registered successfully");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 md:py-16">
        {loading ? (
          <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading contest...
          </div>
        ) : !item ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            Contest not found
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.8rem] border border-border/70 bg-card/60 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black">{item.title}</h1>
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

              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                {item.description || "No description"}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Starts: {new Date(item.startAt).toLocaleString()}</span>
                <span>Ends: {new Date(item.endAt).toLocaleString()}</span>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold">Problems</h2>

                  <Button asChild variant="outline" className="rounded-xl">
                    <Link to={`/contests/${item.id}/ranking`}>View ranking</Link>
                  </Button>
                </div>

                <div className="mt-4 grid gap-3">
                  {item.problems.map((cp, index) => (
                    <div
                      key={cp.id}
                      className="rounded-2xl border border-border/70 bg-background/50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Problem {index + 1}
                          </p>
                          <p className="mt-1 text-lg font-semibold">
                            {cp.problem.title}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                              {cp.problem.difficulty}
                            </span>

                            {cp.problem.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button asChild variant="outline" className="rounded-xl">
                          <Link to={`/problems/${cp.problem.slug}`}>Open</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-border/70 bg-card/60 p-6">
              <h3 className="text-xl font-bold">Your status</h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {item.isRegistered
                  ? "You are already registered for this contest."
                  : "Register now to receive reminders and participate."}
              </p>

              {isAuthenticated && !item.isRegistered && status !== "Ended" && (
                <Button
                  className="mt-6 w-full rounded-xl"
                  onClick={handleRegister}
                  disabled={registering}
                >
                  {registering ? "Registering..." : "Register"}
                </Button>
              )}

              {item.isRegistered && (
                <Button className="mt-6 w-full rounded-xl" disabled>
                  Registered
                </Button>
              )}

              {!isAuthenticated && (
                <p className="mt-6 text-sm text-muted-foreground">
                  Login to register for this contest.
                </p>
              )}

              <div className="mt-8 rounded-xl border border-border/70 bg-background/50 p-4">
                <p className="font-medium">Contest note</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Contests should expose schedule, ranking, registration, and
                  problem list without making users guess where anything is.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10">
  <ContestLeaderboard contestId={contestId} />
</div>
    </div>

    
  );
}