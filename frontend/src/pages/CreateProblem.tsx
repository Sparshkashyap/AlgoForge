import { Navigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import ProblemForm from "@/components/ProblemForm";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Problem } from "@/types/problem.types";
import { getAdminProblemByIdApi } from "@/api/adminProblem.api";
import { Loader2, ShieldCheck } from "lucide-react";

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
        <div className="container py-16 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Loading problem...
            </span>
          </div>
        </div>
      </div>
    );
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
          {/* SIDEBAR */}
          <AdminSidebar />

          {/* MAIN */}
          <div className="space-y-6">
            {/* HEADER */}
            <div className="spotlight-card p-6 md:p-7">
              <div className="feature-glow absolute inset-0 opacity-80" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Admin control
                </div>

                <h1 className="mt-5 font-heading text-3xl font-black md:text-4xl">
                  {problemId ? "Edit Problem" : "Create Problem"}
                </h1>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  This is your control surface. Write the problem clearly, define
                  constraints properly, and make sure the reference solution is solid.
                  Weak admin inputs = bad product experience.
                </p>
              </div>
            </div>

            {/* FORM */}
            <ProblemForm
              initialProblem={problem}
              mode={problemId ? "edit" : "create"}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}