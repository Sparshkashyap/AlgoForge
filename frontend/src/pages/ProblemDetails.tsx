import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { getProblemBySlugApi, runProblemApi } from "@/api/problem.api";
import { createSubmissionApi, getMySubmissionsApi } from "@/api/submission.api";
import { useAuth } from "@/context/AuthContext";
import type { Problem } from "@/types/problem.types";
import type { Submission } from "@/types/submission.types";
import { fireCenterConfetti } from "@/components/ConfettiBurst";
import ProblemWorkspace from "@/components/ProblemWorkspace";
import AIHintPanel from "@/components/AIHintPanel";
import AICodeReview from "@/components/AICodeReview";

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
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
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
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
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
        className="mx-auto max-w-7xl px-4 py-6"
      >
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