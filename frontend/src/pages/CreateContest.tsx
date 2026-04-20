import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  createContestApi,
  getContestByIdApi,
  updateContestApi,
} from "@/api/contest.api";
import API from "@/api/axios";

export default function CreateContest() {
  const navigate = useNavigate();
  const { contestId } = useParams();

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

  const loadProblems = async () => {
    const res = await API.get("/problems");
    setAllProblems(res.data.data || []);
  };

  const loadContest = async () => {
    if (!contestId) return;

    const res = await getContestByIdApi(contestId);
    const c = res.data;

    setForm({
      title: c.title,
      description: c.description || "",
      startAt: c.startAt.slice(0, 16),
      endAt: c.endAt.slice(0, 16),
      isPublished: c.isPublished,
    });

    setProblemIds(c.problems.map((p: any) => p.problem.id));
  };

  useEffect(() => {
    void loadProblems();
    if (isEdit) void loadContest();
  }, [contestId]);

  const toggleProblem = (id: string) => {
    setProblemIds((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        problemIds,
      };

      if (isEdit) {
        await updateContestApi(contestId!, payload);
        toast.success("Updated");
      } else {
        await createContestApi(payload);
        toast.success("Created");
      }

      navigate("/manage-contests");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 max-w-3xl">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Contest" : "Create Contest"}
        </h1>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm((p) => ({ ...p, title: e.target.value }))
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />

          <input
            type="datetime-local"
            value={form.startAt}
            onChange={(e) =>
              setForm((p) => ({ ...p, startAt: e.target.value }))
            }
          />

          <input
            type="datetime-local"
            value={form.endAt}
            onChange={(e) =>
              setForm((p) => ({ ...p, endAt: e.target.value }))
            }
          />

          <label>
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
            Published
          </label>

          <div>
            <p className="font-semibold">Select Problems</p>

            <div className="grid gap-2 mt-3">
              {allProblems.map((p) => (
                <label key={p.id} className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={problemIds.includes(p.id)}
                    onChange={() => toggleProblem(p.id)}
                  />
                  {p.title}
                </label>
              ))}
            </div>
          </div>

          <Button className="w-full">
            {isEdit ? "Update" : "Create"}
          </Button>
        </form>
      </div>
    </div>
  );
}