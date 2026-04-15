import { useEffect, useState } from "react";
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

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

const LANGUAGES: SupportedLanguage[] = [
  "javascript",
  "python",
  "cpp",
  "java",
  "c",
];

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
  const [code, setCode] = useState("// Write your solution here");
  const [codeByLanguage, setCodeByLanguage] = useState<
    Record<SupportedLanguage, string>
  >({
    javascript: "",
    python: "",
    cpp: "",
    java: "",
    c: "",
  });

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
        const nextProblem = data.data;
        setProblem(nextProblem);

        const nextCodeByLanguage = LANGUAGES.reduce((acc, currentLanguage) => {
          const draftKey = `algoforge:draft:${nextProblem.id}:${currentLanguage}`;
          const existingDraft = localStorage.getItem(draftKey);

          acc[currentLanguage] =
            existingDraft ?? getLanguageTemplate(nextProblem, currentLanguage);

          return acc;
        }, {} as Record<SupportedLanguage, string>);

        setCodeByLanguage(nextCodeByLanguage);
        setCode(nextCodeByLanguage[language]);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to load problem");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!problem) return;

    const nextCode =
      codeByLanguage[language] || getLanguageTemplate(problem, language);

    setCode(nextCode);
  }, [language, codeByLanguage, problem]);

  useEffect(() => {
    if (!problem) return;

    setCodeByLanguage((prev) => {
      if (prev[language] === code) return prev;

      return {
        ...prev,
        [language]: code,
      };
    });

    localStorage.setItem(`algoforge:draft:${problem.id}:${language}`, code);
  }, [code, language, problem]);

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
        problem.testCases?.find((tc) => !tc.isHidden) || problem.testCases?.[0];

      const data = await runProblemApi(problem.id, {
        language,
        code,
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
      });

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
        code,
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
    setCodeByLanguage((prev) => ({
      ...prev,
      [language]: code,
    }));

    setLanguage(nextLanguage);
  };

  const handleCodeChange = (nextCode: string) => {
    setCode(nextCode);

    setCodeByLanguage((prev) => ({
      ...prev,
      [language]: nextCode,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10 text-muted-foreground">
          Loading problem...
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10 text-muted-foreground">
          Problem not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ProblemWorkspace
            problem={problem}
            language={language}
            setLanguage={handleLanguageChange}
            code={code}
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
    </div>
  );
}