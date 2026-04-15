import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Edit, Trash2, Crown } from "lucide-react";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { deleteProblemApi, getAdminProblemsApi } from "@/api/adminProblem.api";
import { Button } from "@/components/ui/button";
import type { Problem } from "@/types/problem.types";

export default function ManageProblems() {
  const { user, loading } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const loadProblems = async () => {
    try {
      setPageLoading(true);
      const data = await getAdminProblemsApi();
      setProblems(data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load problems");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleDelete = async (problemId: string) => {
    const ok = window.confirm("Delete this problem?");
    if (!ok) return;

    try {
      await deleteProblemApi(problemId);
      toast.success("Problem deleted");
      await loadProblems();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  if (!loading && (!user || user.role !== "ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Manage Problems</h1>
            <p className="mt-2 text-muted-foreground">
              Edit, delete, and review all problems.
            </p>
          </div>

          <Link to="/create-problem">
            <Button className="rounded-xl gradient-primary text-primary-foreground border-0">
              Create Problem
            </Button>
          </Link>
        </div>

        {pageLoading ? (
          <div className="text-muted-foreground">Loading problems...</div>
        ) : (
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-xl font-semibold">
                        {problem.title}
                      </h3>
                      {problem.isPremium ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400">
                          <Crown className="h-3 w-3" />
                          Premium
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {problem.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/create-problem/${problem.id}`}>
                      <Button variant="outline" className="rounded-xl">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>

                    <Button
                      variant="destructive"
                      className="rounded-xl"
                      onClick={() => handleDelete(problem.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}