import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getContestByIdApi, registerForContestApi } from "@/api/contest.api";
import { useAuth } from "@/context/AuthContext";

type ContestDetails = {
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

export default function ContestDetails() {
  const { contestId = "" } = useParams();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState<ContestDetails | null>(null);
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
              <h1 className="text-4xl font-black">{item.title}</h1>

              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                {item.description || "No description"}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Starts: {new Date(item.startAt).toLocaleString()}</span>
                <span>Ends: {new Date(item.endAt).toLocaleString()}</span>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold">Problems</h2>

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
                        </div>

                        <Button asChild variant="outline" className="rounded-xl">
                          <Link to={`/problems/${cp.problem.slug}`}>
                            Open
                          </Link>
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

              {isAuthenticated && !item.isRegistered && (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}