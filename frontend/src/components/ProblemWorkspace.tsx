import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Crown,
  Lock,
  Play,
  Send,
  Sparkles,
  FileCode2,
  ShieldCheck,
} from "lucide-react";
import type { Problem } from "@/types/problem.types";
import type { Submission } from "@/types/submission.types";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import ProblemRunTimer from "@/components/ProblemRunTimer";
import ProblemConstraints from "@/components/ProblemConstraints";
import ProblemTestCasesPanel from "@/components/ProblemTestCasesPanel";
import SubmissionHistoryPanel from "@/components/SubmissionHistoryPanel";
import SubmissionResult from "@/components/SubmissionResult";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

type Props = {
  problem: Problem;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  code: string;
  setCode: (code: string) => void;
  running: boolean;
  submitting: boolean;
  blockedPremium?: boolean;
  timerRunning: boolean;
  timerSeconds: number;
  onTimerToggle: () => void;
  onTimerReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
  runResult: Submission | null;
  submission: Submission | null;
  previousSubmissions: Submission[];
  userExists: boolean;
};

export default function ProblemWorkspace({
  problem,
  language,
  setLanguage,
  code,
  setCode,
  running,
  submitting,
  blockedPremium = false,
  timerRunning,
  timerSeconds,
  onTimerToggle,
  onTimerReset,
  onRun,
  onSubmit,
  runResult,
  submission,
  previousSubmissions,
  userExists,
}: Props) {
  const safeTags = Array.isArray(problem?.tags) ? problem.tags : [];
  const safeTestCases = Array.isArray(problem?.testCases) ? problem.testCases : [];
  const visibleCases = safeTestCases.filter((tc) => !tc?.isHidden);

  const difficultyClass =
    problem?.difficulty === "Easy"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : problem?.difficulty === "Medium"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
      : "border-rose-500/20 bg-rose-500/10 text-rose-400";

  const languageOptions: { value: SupportedLanguage; label: string }[] = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "cpp", label: "C++" },
    { value: "java", label: "Java" },
    { value: "c", label: "C" },
  ];

  return (
    <PanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-110px)] gap-4"
    >
      <Panel defaultSize={44} minSize={28}>
        <div className="relative h-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 backdrop-blur-2xl">
          <div className="feature-glow absolute inset-0 opacity-70" />

          <div className="relative z-10 h-full overflow-y-auto p-5 md:p-6">
            <div className="rounded-[1.6rem] border border-border/70 bg-background/50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${difficultyClass}`}
                    >
                      {problem?.difficulty || "Problem"}
                    </span>

                    {problem?.isPremium ? (
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
                  </div>

                  <h2 className="mt-4 font-heading text-2xl font-black leading-tight md:text-3xl">
                    {problem?.title || "Untitled Problem"}
                  </h2>

                  {safeTags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {safeTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/70 bg-background/65 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Problem view
                </div>
              </div>

              {blockedPremium ? (
                <div className="mt-5 rounded-[1.2rem] border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
                  <div className="flex items-start gap-3">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">Premium access required</p>
                      <p className="mt-1 text-yellow-200/80">
                        You can inspect the prompt, but running and submitting this
                        problem requires Pro access.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 space-y-5">
              <section className="rounded-[1.6rem] border border-border/70 bg-background/50 p-5">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Problem Statement</h3>
                </div>

                <div className="mt-4 whitespace-pre-wrap text-sm leading-8 text-foreground/92">
                  {problem?.description || "No problem description available."}
                </div>
              </section>

              {problem?.sampleInput ? (
                <section className="rounded-[1.6rem] border border-border/70 bg-background/50 p-5">
                  <h3 className="font-semibold">Sample Input</h3>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[1rem] border border-border/60 bg-card/70 p-4 text-sm leading-7">
                    {problem.sampleInput}
                  </pre>
                </section>
              ) : null}

              {problem?.sampleOutput ? (
                <section className="rounded-[1.6rem] border border-border/70 bg-background/50 p-5">
                  <h3 className="font-semibold">Sample Output</h3>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[1rem] border border-border/60 bg-card/70 p-4 text-sm leading-7">
                    {problem.sampleOutput}
                  </pre>
                </section>
              ) : null}

              <div className="rounded-[1.6rem] border border-border/70 bg-background/50 p-5">
                <ProblemConstraints constraints={problem?.constraints} />
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-background/50 p-5">
                <ProblemTestCasesPanel
                  testCases={visibleCases}
                  visibleOnly
                  explanation={problem?.explanation}
                  showExplanation
                />
              </div>

              {problem?.createdBy ? (
                <div className="rounded-[1.6rem] border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Created by {problem.createdBy.name}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>

      <PanelResizeHandle className="relative w-2">
        <div className="mx-auto h-full w-[2px] rounded-full bg-border/40 transition hover:bg-primary/40" />
      </PanelResizeHandle>

      <Panel defaultSize={56} minSize={35}>
        <div className="h-full space-y-4">
          <div className="sticky top-0 z-20 rounded-[2rem] border border-border/70 bg-card/88 p-4 backdrop-blur-2xl md:p-5">
            <div className="rounded-[1.4rem] border border-white/10 bg-background/80 p-4 backdrop-blur">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="h-11 rounded-xl border border-border bg-background px-4 text-sm font-medium"
                  >
                    {languageOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <ProblemRunTimer
                    isRunning={timerRunning}
                    seconds={timerSeconds}
                    onStartToggle={onTimerToggle}
                    onReset={onTimerReset}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={onRun}
                    disabled={running || blockedPremium}
                    variant="outline"
                    className="h-11 rounded-xl border-border/70 bg-background/60"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {running ? "Running..." : "Run Code"}
                  </Button>

                  <Button
                    onClick={onSubmit}
                    disabled={submitting || blockedPremium}
                    className="h-11 rounded-xl border-0 bg-primary text-primary-foreground shadow-[0_14px_34px_rgba(100,90,255,0.22)]"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>

              {!userExists ? (
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  You can inspect the problem without login. Submitting will redirect
                  you to login first.
                </p>
              ) : null}
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/70">
              <CodeEditor language={language} value={code || ""} onChange={setCode} />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
              <ProblemTestCasesPanel
                testCases={visibleCases}
                visibleOnly
                compact
                showTitle
              />
            </div>

            <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
              <SubmissionHistoryPanel
                submissions={Array.isArray(previousSubmissions) ? previousSubmissions : []}
                onUseSubmission={(nextCode) => setCode(nextCode)}
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
              <SubmissionResult result={runResult} title="Run Result" />
            </div>

            <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
              <SubmissionResult result={submission} title="Submission Result" />
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}