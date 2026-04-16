import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileEdit,
  Layers3,
  PencilRuler,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { getAdminProblemsApi } from "@/api/adminProblem.api";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    getAdminProblemsApi().then((data) => setProblems(data.data || []));
  }, []);

  const mine = useMemo(
    () => problems.filter((item) => item.createdBy?.id === user?.id),
    [problems, user]
  );

  const published = mine.filter((item) => item.isPublished).length;
  const drafts = Math.max(mine.length - published, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 md:py-10">
        <motion.div className="spotlight-card overflow-hidden p-6 md:p-8" {...fade()}>
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <PencilRuler className="h-3.5 w-3.5 text-primary" />
                Problem creation workspace
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Creator dashboard
              </p>
              <h1 className="mt-4 font-heading text-4xl font-black leading-tight md:text-6xl">
                {user?.name || "Creator"}, build the problem bank intentionally.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                This page should feel like a publishing hub, not a plain counter
                screen. Drafts, published content, and next actions all need to stay
                obvious.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="metric-card">
                <Layers3 className="h-5 w-5 text-primary" />
                <p className="mt-4 text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  My problems
                </p>
                <p className="mt-2 font-heading text-4xl font-black">{mine.length}</p>
              </div>

              <div className="metric-card">
                <Rocket className="h-5 w-5 text-accent" />
                <p className="mt-4 text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Published
                </p>
                <p className="mt-2 font-heading text-4xl font-black">{published}</p>
              </div>

              <div className="metric-card">
                <FileEdit className="h-5 w-5 text-primary" />
                <p className="mt-4 text-xs uppercase tracking-[0.26em] text-muted-foreground">
                  Drafts
                </p>
                <p className="mt-2 font-heading text-4xl font-black">{drafts}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div className="spotlight-card p-6 md:p-7" {...fade(0.08)}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-black">Publishing focus</h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Draft clearly",
                  copy: "Capture rough ideas quickly before they disappear.",
                },
                {
                  title: "Refine with intent",
                  copy: "Tighten constraints, examples, and edge-case clarity.",
                },
                {
                  title: "Publish confidently",
                  copy: "Move from draft to live content with less hesitation.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5"
                >
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="spotlight-card p-6 md:p-7" {...fade(0.14)}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
              Quick actions
            </p>
            <h2 className="mt-3 font-heading text-2xl font-black">
              Keep creation flow obvious.
            </h2>

            <div className="mt-6 space-y-4">
              <Link
                to="/create-problem"
                className="block rounded-[1.5rem] border border-border/70 bg-background/45 p-5 transition hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Create a new problem</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Start a fresh draft and shape the next publishable question.
                    </p>
                  </div>
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                </div>
              </Link>

              <Link
                to="/manage-problems"
                className="block rounded-[1.5rem] border border-border/70 bg-background/45 p-5 transition hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">Manage existing problems</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Review drafts, update live content, and keep the bank organized.
                    </p>
                  </div>
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                </div>
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/create-problem">
                <Button className="rounded-full px-6">Create Problem</Button>
              </Link>
              <Link to="/manage-problems">
                <Button variant="outline" className="rounded-full px-6">
                  Manage Problems
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}