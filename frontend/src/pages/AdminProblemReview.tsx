import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import {
  approveProblemApi,
  listProblemsForReviewApi,
  rejectProblemApi,
} from "@/api/problemReview.api";
import { Button } from "@/components/ui/button";

export default function AdminProblemReview() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await listProblemsForReviewApi();
      setItems(res?.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load review queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const approve = async (problemId: string) => {
    try {
      setBusyId(problemId);
      await approveProblemApi(problemId);
      toast.success("Problem approved");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Approval failed");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (problemId: string) => {
    const reason = window.prompt("Reason for rejection") || "Rejected by admin";

    try {
      setBusyId(problemId);
      await rejectProblemApi(problemId, reason);
      toast.success("Problem rejected");
      await load();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Reject failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div>
            <div className="mb-6">
              <h1 className="font-heading text-3xl font-black md:text-4xl">
                Problem Review Queue
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Creator can draft. Admin decides what goes live.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                Loading review queue...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                No pending problem review items.
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          By: {item.createdBy?.name || "Unknown"} •{" "}
                          {item.createdBy?.email || "-"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Difficulty: {item.difficulty}</span>
                          <span>Premium: {item.isPremium ? "Yes" : "No"}</span>
                          <span>Published: {item.isPublished ? "Yes" : "No"}</span>
                        </div>

                        {item.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          className="rounded-xl"
                          disabled={busyId === item.id}
                          onClick={() => approve(item.id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                          disabled={busyId === item.id}
                          onClick={() => reject(item.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}