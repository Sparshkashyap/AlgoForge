import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2, Pencil, Trophy } from "lucide-react";

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
              Contest lifecycle belongs to admin, not creator.
            </p>
          </div>

          <Button
            className="rounded-xl"
            onClick={() => navigate("/create-contest")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Contest
          </Button>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
              Loading contests...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
              No contests found
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-4 w-4 text-primary" />
                        <h2 className="text-lg font-semibold">{c.title}</h2>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Start: {new Date(c.startAt).toLocaleString()}</span>
                        <span>End: {new Date(c.endAt).toLocaleString()}</span>
                        <span>Problems: {c.problems?.length || 0}</span>
                        <span>Registrations: {c.registrations?.length || 0}</span>
                        <span>
                          Status: {c.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => navigate(`/create-contest/${c.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="rounded-xl"
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