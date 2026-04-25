import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, ChevronDown } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import {
  approveProblemApi,
  listProblemsForReviewApi,
  rejectProblemApi,
} from "@/api/problemReview.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminProblemReview() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

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

  const approve = async (id: string) => {
    try {
      setBusyId(id);
      await approveProblemApi(id);
      toast.success("Approved");
      await load();
    } catch {
      toast.error("Approval failed");
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Reason?") || "Rejected by admin";

    try {
      setBusyId(id);
      await rejectProblemApi(id, reason);
      toast.success("Rejected");
      await load();
    } catch {
      toast.error("Reject failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div>
            <h1 className="text-3xl font-black mb-6">
              Problem Review Queue
            </h1>

            {loading ? (
              <div className="p-6 border rounded-2xl">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-6 border rounded-2xl text-muted-foreground">
                No pending reviews
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => {
                  const isOpen = expanded === item.id;

                  return (
                    <div
                      key={item.id}
                      className="border rounded-2xl p-5 bg-card transition hover:shadow-lg"
                    >
                      {/* HEADER */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold">
                            {item.title}
                          </h2>

                          <p className="text-xs text-muted-foreground mt-1">
                            {item.createdBy?.name} • {item.createdBy?.email}
                          </p>

                          <div className="flex gap-2 mt-2">
                            <Badge>{item.difficulty}</Badge>

                            {item.isPremium && (
                              <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-400">
                                PRO
                              </Badge>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setExpanded(isOpen ? null : item.id)
                          }
                          className="text-muted-foreground"
                        >
                          <ChevronDown />
                        </button>
                      </div>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags?.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs border rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* PREVIEW */}
                      <div className="mt-4 text-sm text-muted-foreground">
                        {item.description?.slice(0, 120)}...
                      </div>

                      {/* EXPANDED VIEW */}
                      {isOpen && (
                        <div className="mt-5 space-y-4 border-t pt-4">
                          <div>
                            <h3 className="font-semibold">Description</h3>
                            <p className="text-sm">{item.description}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold">Constraints</h3>
                            <p className="text-sm">{item.constraints || "-"}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold">Sample</h3>
                            <p className="text-sm">
                              Input: {item.sampleInput}
                            </p>
                            <p className="text-sm">
                              Output: {item.sampleOutput}
                            </p>
                          </div>

                          <div>
                            <h3 className="font-semibold">Explanation</h3>
                            <p className="text-sm">{item.explanation}</p>
                          </div>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="flex gap-2 mt-5">
                        <Button
                          disabled={busyId === item.id}
                          onClick={() => approve(item.id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          className="border-rose-500 text-rose-500"
                          disabled={busyId === item.id}
                          onClick={() => reject(item.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}