import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAdminProblemsApi } from "@/api/adminProblem.api";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, CheckCircle2, DraftingCompass } from "lucide-react";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProblemsApi()
      .then((data) => setProblems(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const mine = useMemo(
    () => problems.filter((item) => item.createdBy?.id === user?.id),
    [problems, user]
  );

  const published = mine.filter((item) => item.isPublished).length;
  const drafts = mine.length - published;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-10"
      >
        {/* HEADER */}
        <div className="spotlight-card p-6 md:p-7">
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-heading text-4xl font-black md:text-5xl">
              Creator Dashboard
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              Welcome, {user?.name}. This is your control layer. Create strong
              problems, maintain quality, and avoid dumping low-value content.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="metric-card">
            <div className="flex items-center justify-between">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Total
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              My Problems
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : mine.length}
            </p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Live
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Published
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : published}
            </p>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between">
              <DraftingCompass className="h-5 w-5 text-amber-400" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Pending
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Drafts
            </p>
            <p className="mt-2 text-3xl font-black">
              {loading ? "-" : drafts}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/create-problem">
            <Button className="rounded-xl flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Problem
            </Button>
          </Link>

          <Link to="/manage-problems">
            <Button variant="outline" className="rounded-xl">
              Manage Problems
            </Button>
          </Link>
        </div>

        {/* EMPTY / FEEDBACK */}
        {!loading && mine.length === 0 && (
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            You haven’t created any problems yet. Start with one high-quality
            problem instead of adding multiple weak ones.
          </div>
        )}
      </motion.div>
    </div>
  );
}