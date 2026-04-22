import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import API from "@/api/axios";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  CheckCircle2,
  DraftingCompass,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await API.get("/problems/me");
        setProblems(response?.data?.data || []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load creator problems"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const published = useMemo(
    () => problems.filter((item) => item.isPublished).length,
    [problems]
  );
  const drafts = problems.length - published;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-10"
      >
        <div className="spotlight-card p-6 md:p-7">
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-heading text-4xl font-black md:text-5xl">
              Creator Dashboard
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              Welcome, {user?.name}. Your job is problem quality, not contest
              control, not billing control, not admin control.
            </p>
          </div>
        </div>

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
              {loading ? "-" : problems.length}
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

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            className="rounded-xl hover:bg-primary/90"
            onClick={() => navigate("/create-problem")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Problem
          </Button>

          <Button
            variant="outline"
            className="rounded-xl hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
            onClick={() => navigate("/manage-problems")}
          >
            Manage Problems
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {!loading && problems.length === 0 && (
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            You haven’t created any problems yet. Start with one high-quality
            problem instead of dumping low-value content.
          </div>
        )}
      </motion.div>
    </div>
  );
}