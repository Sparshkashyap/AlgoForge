import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createContestApi,
  getContestByIdApi,
  updateContestApi,
} from "@/api/contest.api";
import API from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

export default function CreateContest() {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { user } = useAuth();

  const isEdit = Boolean(contestId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    isPublished: false,
  });

  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [allProblems, setAllProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canManageContest = user?.role === "ADMIN";

  const selectedCount = useMemo(() => problemIds.length, [problemIds]);

  const loadProblems = async () => {
    const res = await API.get("/problems");
    setAllProblems(res.data.data || []);
  };

  const loadContest = async () => {
    if (!contestId) return;

    const res = await getContestByIdApi(contestId);
    const c = res.data;

    setForm({
      title: c.title || "",
      description: c.description || "",
      startAt: c.startAt ? c.startAt.slice(0, 16) : "",
      endAt: c.endAt ? c.endAt.slice(0, 16) : "",
      isPublished: !!c.isPublished,
    });

    setProblemIds((c.problems || []).map((p: any) => p.problem.id));
  };

  useEffect(() => {
    if (!canManageContest) {
      setLoading(false);
      return;
    }

    const boot = async () => {
      try {
        setLoading(true);
        await loadProblems();
        if (isEdit) {
          await loadContest();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load contest");
      } finally {
        setLoading(false);
      }
    };

    void boot();
  }, [contestId, canManageContest, isEdit]);

  const toggleProblem = (id: string) => {
    setProblemIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Contest title is required");
      return;
    }

    if (!form.startAt || !form.endAt) {
      toast.error("Start and end time are required");
      return;
    }

    const start = new Date(form.startAt);
    const end = new Date(form.endAt);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Invalid date format");
      return;
    }

    if (end <= start) {
      toast.error("End time must be after start time");
      return;
    }

    if (problemIds.length === 0) {
      toast.error("Select at least one problem");
      return;
    }

    try {
      setSaving(true);

      // 🔥 CRITICAL FIX → convert to ISO
      const payload = {
        ...form,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        problemIds,
      };

      if (isEdit) {
        await updateContestApi(contestId!, payload);
        toast.success("Contest updated");
      } else {
        await createContestApi(payload);
        toast.success("Contest created");
      }

      navigate("/manage-contests");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  if (!canManageContest) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-12">
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Only admin can create or edit contests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container max-w-4xl py-12">
        <div className="rounded-[1.8rem] border border-border/70 bg-card/60 p-6 md:p-8">
          <h1 className="text-3xl font-black">
            {isEdit ? "Edit Contest" : "Create Contest"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Admin controls contest visibility and schedule.
          </p>

          {loading ? (
            <div className="mt-6 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
              Loading contest form...
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  className="mt-2 h-12 rounded-xl"
                  placeholder="Weekly DSA Arena"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-border bg-background/50 p-3 outline-none"
                  rows={5}
                  placeholder="Contest description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Start At</label>
                  <Input
                    type="datetime-local"
                    className="mt-2 h-12 rounded-xl"
                    value={form.startAt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, startAt: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">End At</label>
                  <Input
                    type="datetime-local"
                    className="mt-2 h-12 rounded-xl"
                    value={form.endAt}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, endAt: e.target.value }))
                    }
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isPublished: e.target.checked,
                    }))
                  }
                />
                Publish immediately
              </label>

              <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">Select Problems</p>
                  <span className="text-sm text-muted-foreground">
                    Selected: {selectedCount}
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  {allProblems.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={problemIds.includes(p.id)}
                        onChange={() => toggleProblem(p.id)}
                      />
                      <div className="min-w-0">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.difficulty} • {p.slug}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button className="w-full rounded-xl" disabled={saving}>
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Update Contest"
                  : "Create Contest"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}