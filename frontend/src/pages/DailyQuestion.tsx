import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Sparkles, Target } from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  getMyDailyQuestionAttemptApi,
  getTodayDailyQuestionApi,
  markDailyQuestionAttemptApi,
} from "@/api/dailyQuestion.api";
import { useAuth } from "@/context/AuthContext";

type DailyQuestionResponse = {
  id: string;
  activeDate: string;
  problem: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    difficulty: string;
    tags: string[];
    constraints?: string;
    sampleInput?: string;
    sampleOutput?: string;
    explanation?: string;
  };
};

export default function DailyQuestion() {
  const { isAuthenticated } = useAuth();

  const [dailyQuestion, setDailyQuestion] = useState<DailyQuestionResponse | null>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const dailyQuestionRes = await getTodayDailyQuestionApi();
      const dq = dailyQuestionRes?.data;
      setDailyQuestion(dq);

      if (isAuthenticated && dq?.id) {
        const attemptRes = await getMyDailyQuestionAttemptApi(dq.id);
        setAttempt(attemptRes?.data || null);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load daily question"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [isAuthenticated]);

  const markSolved = async () => {
    if (!dailyQuestion) return;

    try {
      setMarking(true);
      const res = await markDailyQuestionAttemptApi({
        dailyQuestionId: dailyQuestion.id,
        status: "SOLVED",
      });
      setAttempt(res?.data);
      toast.success("Daily question marked as solved");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update daily question");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="container py-12 md:py-16"
      >
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-border/70 bg-card/60 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Daily challenge
            </div>

            <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-5xl">
              One focused problem. Every day.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
              Daily questions should be obvious, lightweight, and easy to continue into the full problem page.
            </p>
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Loading daily question...
              </div>
            ) : !dailyQuestion ? (
              <div className="rounded-3xl border border-border bg-card p-8 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-4 text-base font-medium">No daily question available</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.8rem] border border-border/70 bg-card/60 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold">{dailyQuestion.problem.title}</h2>
                    <span className="rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {dailyQuestion.problem.difficulty}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-8 text-muted-foreground">
                    {dailyQuestion.problem.description || "No description available."}
                  </p>

                  {dailyQuestion.problem.tags?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {dailyQuestion.problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {dailyQuestion.problem.constraints && (
                    <div className="mt-6 rounded-2xl border border-border/70 bg-background/50 p-4">
                      <p className="text-sm font-semibold">Constraints</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                        {dailyQuestion.problem.constraints}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-xl">
                      <Link to={`/problems/${dailyQuestion.problem.slug}`}>
                        Open problem
                      </Link>
                    </Button>

                    {isAuthenticated && (
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        disabled={marking || attempt?.status === "SOLVED"}
                        onClick={markSolved}
                      >
                        {attempt?.status === "SOLVED"
                          ? "Already solved"
                          : marking
                          ? "Saving..."
                          : "Mark as solved"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Active date
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {new Date(dailyQuestion.activeDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">Your progress</p>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {attempt?.status === "SOLVED"
                        ? "You have already completed today's daily question."
                        : "Solve today's daily question to build consistency."}
                    </p>

                    {attempt?.status === "SOLVED" && (
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Solved
                      </div>
                    )}
                  </div>

                  {dailyQuestion.problem.sampleInput && (
                    <div className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5">
                      <p className="text-sm font-semibold">Sample Input</p>
                      <pre className="mt-3 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                        {dailyQuestion.problem.sampleInput}
                      </pre>
                    </div>
                  )}

                  {dailyQuestion.problem.sampleOutput && (
                    <div className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5">
                      <p className="text-sm font-semibold">Sample Output</p>
                      <pre className="mt-3 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                        {dailyQuestion.problem.sampleOutput}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}