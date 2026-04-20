import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import API from "@/api/axios";

type ProblemForm = {
  title: string;
  slug: string;
  difficulty: string;
  tags: string;
  isPremium: boolean;
  isPublished: boolean;
  description: string;
};

export default function CreateProblemPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { problemId } = useParams();

  const isEdit = Boolean(problemId);

  const [form, setForm] = useState<ProblemForm>({
    title: "",
    slug: "",
    difficulty: "EASY",
    tags: "",
    isPremium: false,
    isPublished: false,
    description: "",
  });

  const [pageLoading, setPageLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const loadProblem = async () => {
    try {
      const res = await API.get(`/problems/${problemId}`);
      const p = res.data.data;

      setForm({
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        tags: p.tags?.join(",") || "",
        isPremium: p.isPremium,
        isPublished: p.isPublished,
        description: p.description || "",
      });
    } catch (err: any) {
      toast.error("Failed to load problem");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      void loadProblem();
    }
  }, [problemId]);

  if (!authLoading && (!user || user.role !== "ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            Loading problem...
          </span>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      };

      if (isEdit) {
        await API.put(`/problems/${problemId}`, payload);
        toast.success("Problem updated");
      } else {
        await API.post("/problems", payload);
        toast.success("Problem created");
      }

      navigate("/manage-problems");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <div className="space-y-6 max-w-3xl">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Problem" : "Create Problem"}
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />

            <Input
              placeholder="Slug"
              value={form.slug}
              onChange={(e) =>
                setForm((p) => ({ ...p, slug: e.target.value }))
              }
            />

            <Input
              placeholder="Difficulty (EASY/MEDIUM/HARD)"
              value={form.difficulty}
              onChange={(e) =>
                setForm((p) => ({ ...p, difficulty: e.target.value }))
              }
            />

            <Input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) =>
                setForm((p) => ({ ...p, tags: e.target.value }))
              }
            />

            <textarea
              className="w-full rounded-xl border p-3 bg-background"
              rows={6}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />

            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  checked={form.isPremium}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isPremium: e.target.checked,
                    }))
                  }
                />
                Premium
              </label>

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
            </div>

            <Button disabled={saving} className="w-full">
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Problem"
                : "Create Problem"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}