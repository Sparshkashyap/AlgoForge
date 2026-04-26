import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpenText,
  Crown,
  Flame,
  Lock,
  MessagesSquare,
  Sparkles,
  Tag,
  TimerReset,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getProblemBySlugApi, runProblemApi } from "@/api/problem.api";
import { createSubmissionApi, getMySubmissionsApi } from "@/api/submission.api";
import { useAuth } from "@/context/AuthContext";
import type { Problem } from "@/types/problem.types";
import type { Submission } from "@/types/submission.types";
import { fireCenterConfetti } from "@/components/ConfettiBurst";
import ProblemWorkspace from "@/components/ProblemWorkspace";
import { useSubmission } from "@/hooks/useSubmission";
import ProblemDiscussions from "@/components/ProblemDiscussions";
import ProblemNotes from "@/components/ProblemNotes";
import { toggleBookmarkApi } from "@/api/bookmark.api";
import BookmarkButton from "@/components/BookmarkButton";
import { Button } from "@/components/ui/button";

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
  language: SupportedLanguage,
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
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

const isAccepted = (item: Submission) => {
  const value = String(item.verdict || item.status || "").toLowerCase();
  return value === "accepted";
};

const isFinalSubmissionState = (item?: Submission | null) => {
  const status = String(item?.status || "").toUpperCase();
  return ["COMPLETED", "FAILED"].includes(status);
};

function scrollToSection(ref: React.RefObject<HTMLDivElement>) {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export default function ProblemDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const discussionsRef = useRef<HTMLDivElement>(null);




  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<
    Record<SupportedLanguage, string>
  >(EMPTY_CODE_BY_LANGUAGE);

  const [runResult, setRunResult] = useState<Submission | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [queuedSubmissionId, setQueuedSubmissionId] = useState<string | null>(
    null,
  );
  const [previousSubmissions, setPreviousSubmissions] = useState<Submission[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [customInput, setCustomInput] = useState("");
const [customExpectedOutput, setCustomExpectedOutput] = useState("");

  const liveSubmission = useSubmission(queuedSubmissionId).submission;

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
    return previousSubmissions.filter(isAccepted).length;
  }, [previousSubmissions]);

  const visibleCasesCount = useMemo(() => {
    return (problem?.testCases || []).filter((item) => !item?.isHidden).length;
  }, [problem]);

  const totalTags = useMemo(() => {
    return Array.isArray(problem?.tags) ? problem?.tags.length : 0;
  }, [problem]);

  const quickStats = useMemo(() => {
    return [
      {
        label: "Session timer",
        value: formatTimer(timerSeconds),
        icon: <TimerReset className="h-5 w-5 text-primary" />,
        hint: timerRunning ? "Running" : "Paused",
      },
      {
        label: "Accepted",
        value: String(acceptedCount),
        icon: <Flame className="h-5 w-5 text-primary" />,
        hint: "Your solved attempts",
      },
      {
        label: "Language",
        value: language.toUpperCase(),
        icon: <Zap className="h-5 w-5 text-accent" />,
        hint: "Current editor mode",
      },
      {
        label: "Samples",
        value: String(visibleCasesCount),
        icon: <BookOpenText className="h-5 w-5 text-primary" />,
        hint: "Visible test cases",
      },
    ];
  }, [acceptedCount, language, timerRunning, timerSeconds, visibleCasesCount]);

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

        const nextCodeByLanguage = LANGUAGES.reduce(
          (acc, currentLanguage) => {
            const draftKey = `algoforge:draft:${nextProblem.id}:${currentLanguage}`;
            const existingDraft = localStorage.getItem(draftKey);

            acc[currentLanguage] =
              existingDraft ??
              getLanguageTemplate(nextProblem, currentLanguage);

            return acc;
          },
          {} as Record<SupportedLanguage, string>,
        );

        setCodeByLanguage(nextCodeByLanguage);
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.message || "Failed to load problem");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!user) return;

    getMySubmissionsApi()
      .then((data) => {
        const filtered = (data.data || []).filter(
          (item: Submission) => item.problem?.slug === slug,
        );
        setPreviousSubmissions(filtered);
      })
      .catch(() => {});
  }, [user, slug]);

  useEffect(() => {
    if (!liveSubmission) return;

    setSubmission(liveSubmission);

    if (isFinalSubmissionState(liveSubmission)) {
      setSubmitting(false);
      setQueuedSubmissionId(null);

      if (isAccepted(liveSubmission)) {
        fireCenterConfetti();
        toast.success("Accepted");
      } else if (String(liveSubmission.status).toUpperCase() === "FAILED") {
        toast.error("Submission failed");
      } else {
        toast.info(liveSubmission.verdict || liveSubmission.status);
      }

      getMySubmissionsApi()
        .then((data) => {
          const filtered = (data.data || []).filter(
            (item: Submission) => item.problem?.slug === slug,
          );
          setPreviousSubmissions(filtered);
        })
        .catch(() => {});
    }
  }, [liveSubmission, slug]);


    const handleRun = async () => {
  if (!problem) return;

  if (blockedPremium) {
    toast.error("Upgrade to Pro to run this problem");
    return;
  }

  try {
    setRunning(true);

    const visibleCase =
      problem.testCases?.find((tc) => !tc.isHidden) || problem.testCases?.[0];

    const res = await runProblemApi(problem.id, {
      language,
      code: currentCode,
      input:
        customInput.trim() ||
        visibleCase?.input ||
        problem.sampleInput ||
        "",
      expectedOutput:
        customExpectedOutput.trim() ||
        visibleCase?.expected ||
        problem.sampleOutput ||
        "",
    });

    const result = res.data?.data ?? res.data;

    setRunResult({
      language,
      status: result.verdict || result.status || "Completed",
      verdict: result.verdict || result.status,
      stdout: result.stdout,
      stderr: result.stderr || result.message,
      compileOutput: result.compileOutput,
      runtime: result.runtime,
      memory: result.memory,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
      results: result.results || [],
    } as Submission);

    toast.success(`Run: ${result.verdict || result.status || "Completed"}`);
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

    if (blockedPremium) {
      toast.error("Upgrade to Pro to submit this problem");
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
      setQueuedSubmissionId(data.data?.id || null);

      const queuedStatus = String(data.data?.status || "").toUpperCase();

      if (queuedStatus === "QUEUED" || queuedStatus === "PROCESSING") {
        toast.success("Submission queued");
      } else if (isAccepted(data.data)) {
        setSubmitting(false);
        fireCenterConfetti();
        toast.success("Accepted");
      } else {
        setSubmitting(false);
        toast.info(data.data?.verdict || data.data?.status || "Submitted");
      }
    } catch (error: any) {
      setSubmitting(false);
      toast.error(error?.response?.data?.message || "Submission failed");
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
          nextCode,
        );
      }

      return updated;
    });
  };

  const handleToggleBookmark = async () => {
    if (!problem?.id) return;

    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    const response = await toggleBookmarkApi(problem.id);
    setIsBookmarked(!!response?.data?.bookmarked);
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
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
          <div className="feature-glow absolute inset-0 opacity-80" />

          <div className="relative z-10 p-5 md:p-6 xl:p-7">
            <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[1.7rem] border border-white/10 bg-background/60 p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to="/problems"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/65 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to problem bank
                  </Link>

                  <div className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {user ? "Signed in" : "Guest mode"}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      problem.difficulty === "Easy"
                        ? "border-emerald-500/20 bg-emerald-500/12 text-emerald-400"
                        : problem.difficulty === "Medium"
                          ? "border-amber-500/20 bg-amber-500/12 text-amber-400"
                          : "border-rose-500/20 bg-rose-500/12 text-rose-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  {problem.isPremium ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-400">
                      <Crown className="h-3.5 w-3.5" />
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                      Public
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/65 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    {totalTags} tags
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/65 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <BookOpenText className="h-3.5 w-3.5" />
                    {visibleCasesCount} samples
                  </span>
                </div>

                <h1 className="mt-5 max-w-4xl font-heading text-3xl font-black leading-tight md:text-5xl">
                  {problem.title}
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground md:text-base">
                  Solve inside a real split workspace, switch between
                  description, submissions, solutions, and editorial, and use the
                  right-side workbench for samples and execution results.
                </p>

                {!!problem.tags?.length && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/70 bg-background/65 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    className="rounded-xl"
                    onClick={() => scrollToSection(workspaceRef)}
                  >
                    Start solving
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-border/70 bg-background/60"
                    onClick={() => scrollToSection(notesRef)}
                  >
                    Open notes
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-border/70 bg-background/60"
                    onClick={() => scrollToSection(discussionsRef)}
                  >
                    Open discussion
                  </Button>

                  <BookmarkButton
                    isBookmarked={isBookmarked}
                    onToggle={handleToggleBookmark}
                  />
                </div>

                {blockedPremium ? (
                  <div className="mt-6 rounded-[1.3rem] border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
                    <div className="flex items-start gap-3">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-semibold">Premium problem locked</p>
                        <p className="mt-1 text-yellow-200/80">
                          You can inspect the problem, but running and submitting
                          require premium access.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {quickStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.6rem] border border-white/10 bg-background/60 p-5"
                  >
                    <div className="flex items-center justify-between">
                      {item.icon}
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {item.hint}
                      </span>
                    </div>

                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 font-heading text-3xl font-black">
                      {item.value}
                    </p>
                  </div>
                ))}

                <div className="rounded-[1.6rem] border border-white/10 bg-background/60 p-5 sm:col-span-2 xl:col-span-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Quick navigation
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => scrollToSection(workspaceRef)}
                      className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-primary/15"
                    >
                      Workspace
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection(notesRef)}
                      className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
                    >
                      Notes
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollToSection(discussionsRef)}
                      className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
                    >
                      Discussions
                    </button>
                  </div>

                  <div className="mt-5 rounded-[1.2rem] border border-border/70 bg-card/70 p-4">
                    <div className="flex items-start gap-3">
                      <MessagesSquare className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">Better solving flow</p>
                        <p className="mt-1 text-sm leading-7 text-muted-foreground">
                          Header stays focused on context while the workspace below
                          handles coding, samples, results, solutions, notes, and
                          discussion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div ref={workspaceRef}>
          <ProblemWorkspace
          customInput={customInput}
setCustomInput={setCustomInput}
customExpectedOutput={customExpectedOutput}
setCustomExpectedOutput={setCustomExpectedOutput}
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
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div ref={notesRef}>
            {problem?.id ? <ProblemNotes problemId={problem.id} /> : null}
          </div>

          <div ref={discussionsRef}>
            {problem?.id ? <ProblemDiscussions problemId={problem.id} /> : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 