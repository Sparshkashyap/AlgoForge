import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Crown,
  PlusSquare,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import CreatorSidebar from "@/components/CreatorSidebar";
import { useAuth } from "@/context/AuthContext";
import { deleteProblemApi } from "@/api/adminProblem.api";
import API from "@/api/axios";
import { Button } from "@/components/ui/button";
import type { Problem } from "@/types/problem.types";

export default function ManageProblems() {
  const { user, loading } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const canManage = user?.role === "ADMIN" || user?.role === "CREATOR";
  const isAdmin = user?.role === "ADMIN";

  const loadProblems = async () => {
    try {
      setPageLoading(true);

      const data =
        user?.role === "ADMIN"
          ? await API.get("/problems/admin/all/list")
          : await API.get("/problems/me");

      setProblems(data.data?.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load problems");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (canManage) {
      void loadProblems();
    }
  }, [user?.role, canManage]);

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

  if (!loading && (!user || !canManage)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8"
      >
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {isAdmin ? <AdminSidebar /> : <CreatorSidebar />}

          <div>
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h1 className="font-heading text-3xl font-black md:text-4xl">
                  Manage Problems
                </h1>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Review, edit, and manage authored problems from one clean
                  surface.
                </p>
              </div>

              <Link to="/create-problem">
                <Button className="rounded-xl border-0 px-5">
                  <PlusSquare className="mr-2 h-4 w-4" />
                  Create Problem
                </Button>
              </Link>
            </div>

            {pageLoading ? (
              <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-8 text-sm text-muted-foreground backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Loading problems...
                </div>
              </div>
            ) : problems.length === 0 ? (
              <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-8 text-sm text-muted-foreground backdrop-blur-xl">
                No problems found.
              </div>
            ) : (
              <div className="grid gap-4">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    className="rounded-[1.7rem] border border-border/70 bg-card/80 p-5 backdrop-blur-xl transition hover:border-primary/25"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/60">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>

                          <div>
                            <h2 className="text-lg font-semibold">
                              {problem.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              /problems/{problem.slug}
                            </p>
                          </div>

                          {problem.isPremium && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                              <Crown className="h-3 w-3" />
                              Premium
                            </span>
                          )}

                          <span className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                            {problem.difficulty}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              problem.isPublished
                                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border border-border/70 text-muted-foreground"
                            }`}
                          >
                            {problem.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>

                        {problem.tags?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link to={`/create-problem/${problem.id}`}>
                          <Button variant="outline" className="rounded-xl">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        <Link to={`/problems/${problem.slug}`}>
                          <Button variant="outline" className="rounded-xl">
                            View
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          className="rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
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
      </motion.div>
    </div>
  );
}