import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Crown,
  Flame,
  Lock,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getProblemBySlugApi, runProblemApi } from "@/api/problem.api";
import { createSubmissionApi, getMySubmissionsApi } from "@/api/submission.api";
import { useAuth } from "@/context/AuthContext";
import type { Problem } from "@/types/problem.types";
import type { Submission } from "@/types/submission.types";
import { fireCenterConfetti } from "@/components/ConfettiBurst";
import ProblemWorkspace from "@/components/ProblemWorkspace";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

const LANGUAGES: SupportedLanguage[] = [
  "javascript",
  "python",
  "cpp",
  "java",
  "c",
];

const EMPTY_CODE_BY_LANGUAGE: Record<SupportedLanguage, string> = {
  javascript: "",
  python: "",
  cpp: "",
  java: "",
  c: "",
};

const getLanguageTemplate = (
  problem: Problem | null,
  language: SupportedLanguage
) => {
  if (!problem) return "// Write your solution here";

  const template = problem.languageTemplates?.[language];
  if (template && template.trim()) {
    return template;
  }

  if (problem.boilerplateMode === "none") {
    return "";
  }

  return "// Write your solution here";
};

function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export default function ProblemDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [codeByLanguage, setCodeByLanguage] =
    useState<Record<SupportedLanguage, string>>(EMPTY_CODE_BY_LANGUAGE);

  const [runResult, setRunResult] = useState<Submission | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [previousSubmissions, setPreviousSubmissions] = useState<Submission[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const blockedPremium = problem?.isPremium && !problem?.hasPremiumAccess;

  const currentCode = useMemo(() => {
    if (!problem) return "// Write your solution here";

    const storedCode = codeByLanguage[language];
    if (typeof storedCode === "string" && storedCode.length > 0) {
      return storedCode;
    }

    return getLanguageTemplate(problem, language);
  }, [codeByLanguage, language, problem]);

  const acceptedCount = useMemo(() => {
    return previousSubmissions.filter(
      (item) => (item.verdict || item.status) === "Accepted"
    ).length;
  }, [previousSubmissions]);

  useEffect(() => {
    if (!timerRunning) return;

    const timer = window.setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    getProblemBySlugApi(slug)
      .then((data) => {
        const nextProblem = data.data as Problem;
        setProblem(nextProblem);

        const nextCodeByLanguage = LANGUAGES.reduce((acc, currentLanguage) => {
          const draftKey = `algoforge:draft:${nextProblem.id}:${currentLanguage}`;
          const existingDraft = localStorage.getItem(draftKey);

          acc[currentLanguage] =
            existingDraft ?? getLanguageTemplate(nextProblem, currentLanguage);

          return acc;
        }, {} as Record<SupportedLanguage, string>);

        setCodeByLanguage(nextCodeByLanguage);
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to load problem"
        );
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user) return;

    getMySubmissionsApi()
      .then((data) => {
        const filtered = (data.data || []).filter(
          (item: Submission) => item.problem?.slug === slug
        );
        setPreviousSubmissions(filtered);
      })
      .catch(() => {});
  }, [user, slug, submission]);

  const handleRun = async () => {
    if (!problem) return;

    try {
      setRunning(true);

      const visibleCase =
        problem.testCases?.find((tc) => !tc.isHidden) ||
        problem.testCases?.[0];

      const data = await runProblemApi(problem.id, {
        language,
        code: currentCode,
        input: visibleCase?.input || problem.sampleInput || "",
        expectedOutput: visibleCase?.expected || problem.sampleOutput || "",
      });

      setRunResult({
        language,
        status: data.data.verdict || data.data.statusDescription || "Completed",
        verdict: data.data.verdict,
        stdout: data.data.stdout,
        stderr: data.data.stderr || data.data.message,
        compileOutput: data.data.compileOutput,
        runtime: data.data.runtime,
        memory: data.data.memory,
        passedCount: data.data.passedCount,
        totalCount: data.data.totalCount,
      } as Submission);

      toast.success(`Run: ${data.data.verdict || data.data.statusDescription}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;

    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    try {
      setSubmitting(true);

      const data = await createSubmissionApi({
        problemId: problem.id,
        language,
        code: currentCode,
      });

      setSubmission(data.data);

      if ((data.data.verdict || data.data.status) === "Accepted") {
        fireCenterConfetti();
      }

      toast.success(`Verdict: ${data.data.verdict || data.data.status}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimerToggle = () => {
    setTimerRunning((prev) => !prev);
  };

  const handleTimerReset = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleLanguageChange = (nextLanguage: SupportedLanguage) => {
    setLanguage(nextLanguage);
  };

  const handleCodeChange = (nextCode: string) => {
    setCodeByLanguage((prev) => {
      const updated = {
        ...prev,
        [language]: nextCode,
      };

      if (problem) {
        localStorage.setItem(
          `algoforge:draft:${problem.id}:${language}`,
          nextCode
        );
      }

      return updated;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-8 md:py-10">
          <div className="spotlight-card p-6 text-sm text-muted-foreground">
            Loading problem...
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-8 md:py-10">
          <div className="spotlight-card p-6 text-sm text-muted-foreground">
            Problem not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="container py-6 md:py-8"
      >
        <div className="mb-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="spotlight-card overflow-hidden p-5 md:p-6">
            <div className="feature-glow absolute inset-0 opacity-80" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    to="/problems"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to problem bank
                  </Link>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        problem.difficulty === "Easy"
                          ? "bg-emerald-500/12 text-emerald-400"
                          : problem.difficulty === "Medium"
                          ? "bg-amber-500/12 text-amber-400"
                          : "bg-rose-500/12 text-rose-400"
                      }`}
                    >
                      {problem.difficulty}
                    </span>

                    {problem.isPremium && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-400">
                        <Crown className="h-3.5 w-3.5" />
                        Premium
                      </span>
                    )}

                    {problem.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="mt-4 font-heading text-3xl font-black leading-tight md:text-5xl">
                    {problem.title}
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">
                    Work through the prompt, use the workspace properly, and keep
                    your progress visible. This page should feel like the core of
                    the platform, not an afterthought around the editor.
                  </p>
                </div>

                <div className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {user ? "Signed in" : "Guest mode"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <TimerReset className="h-5 w-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Session
                </span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Timer
              </p>
              <p className="mt-2 font-heading text-3xl font-black">
                {formatTimer(timerSeconds)}
              </p>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Drafts
                </span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Current language
              </p>
              <p className="mt-2 font-heading text-3xl font-black capitalize">
                {language}
              </p>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <Flame className="h-5 w-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Attempts
                </span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Accepted
              </p>
              <p className="mt-2 font-heading text-3xl font-black">
                {acceptedCount}
              </p>
            </div>
          </div>
        </div>

        {blockedPremium && (
          <div className="mb-5 rounded-[1.4rem] border border-yellow-500/20 bg-yellow-500/10 px-5 py-4 text-sm text-yellow-300">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Premium problem locked</p>
                <p className="mt-1 text-yellow-200/80">
                  You can view the shell, but running and submitting this problem
                  requires premium access.
                </p>
              </div>
            </div>
          </div>
        )}

        <ProblemWorkspace
          problem={problem}
          language={language}
          setLanguage={handleLanguageChange}
          code={currentCode}
          setCode={handleCodeChange}
          running={running}
          submitting={submitting}
          blockedPremium={!!blockedPremium}
          timerRunning={timerRunning}
          timerSeconds={timerSeconds}
          onTimerToggle={handleTimerToggle}
          onTimerReset={handleTimerReset}
          onRun={handleRun}
          onSubmit={handleSubmit}
          runResult={runResult}
          submission={submission}
          previousSubmissions={previousSubmissions}
          userExists={!!user}
        />
      </motion.div>
    </div>
  );
}