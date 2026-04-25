import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2, Pencil, Trophy, Eye } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  deleteContestApi,
  listMyCreatedContestsApi,
} from "@/api/contest.api";
import { useAuth } from "@/context/AuthContext";

export default function ManageContests() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canManageContest = user?.role === "ADMIN";

  const load = async () => {
    try {
      setLoading(true);
      const res = await listMyCreatedContestsApi();
      setItems(res?.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load contests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canManageContest) {
      setLoading(false);
      return;
    }

    void load();
  }, [canManageContest]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this contest?");
    if (!ok) return;

    try {
      await deleteContestApi(id);
      toast.success("Contest deleted");
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  if (!canManageContest) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-12">
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Only admin can manage contests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">Manage Contests</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create, schedule, publish, edit, and delete contests.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => navigate("/contests")}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Public Page
            </Button>

            <Button
              className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => navigate("/create-contest")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Contest
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
              Loading contests...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-muted-foreground">
              <p className="font-medium text-foreground">No contests found.</p>
              <p className="mt-1">
                Create your first contest, select problems, set schedule, and
                publish it for users.
              </p>

              <Button
                className="mt-4 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => navigate("/create-contest")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Contest
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-4 w-4 text-primary" />
                        <h2 className="text-lg font-semibold">{c.title}</h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            c.isPublished
                              ? "border border-emerald-400/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : "border border-border bg-background text-muted-foreground"
                          }`}
                        >
                          {c.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>
                          Start: {new Date(c.startAt).toLocaleString()}
                        </span>
                        <span>End: {new Date(c.endAt).toLocaleString()}</span>
                        <span>Problems: {c.problems?.length || 0}</span>
                        <span>
                          Registrations: {c.registrations?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate(`/contests/${c.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate(`/create-contest/${c.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
}