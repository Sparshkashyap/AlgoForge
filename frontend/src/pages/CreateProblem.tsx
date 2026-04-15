import { Navigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import ProblemForm from "@/components/ProblemForm";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import type { Problem } from "@/types/problem.types";
import { getAdminProblemByIdApi } from "@/api/adminProblem.api";

export default function CreateProblemPage() {
  const { user, loading } = useAuth();
  const { problemId } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [pageLoading, setPageLoading] = useState(Boolean(problemId));

  useEffect(() => {
    if (!problemId) return;

    getAdminProblemByIdApi(problemId)
      .then((data) => setProblem(data.data))
      .finally(() => setPageLoading(false));
  }, [problemId]);

  if (!loading && (!user || user.role !== "ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10 text-muted-foreground">
          Loading problem...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <div>
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold">
              {problemId ? "Edit Problem" : "Create Problem"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Admin can add, edit, view, preview-run, and update boilerplate/reference code here.
            </p>
          </div>

          <ProblemForm
            initialProblem={problem}
            mode={problemId ? "edit" : "create"}
          />
        </div>
      </div>
    </div>
  );
}