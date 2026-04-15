import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Lock, Play, Send } from "lucide-react";
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
  blockedPremium,
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
  const visibleCases = (problem.testCases || []).filter((tc) => !tc.isHidden);

  const difficultyClass =
    problem.difficulty === "Easy"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
      : problem.difficulty === "Medium"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
      : "bg-rose-500/10 text-rose-300 border-rose-500/20";

  return (
    <PanelGroup direction="horizontal" className="min-h-[calc(100vh-96px)] gap-4">
      <Panel defaultSize={45} minSize={28}>
        <div className="h-full space-y-6 overflow-y-auto rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-3xl font-bold">{problem.title}</h1>

              {problem.isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                  <Lock className="h-3 w-3" />
                  Premium
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${difficultyClass}`}
              >
                {problem.difficulty}
              </span>

              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {blockedPremium ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
              This is a premium problem. Upgrade to Pro to run and submit solutions.
            </div>
          ) : null}

          <div className="rounded-2xl border border-border bg-background p-4">
            <h3 className="mb-3 font-semibold">Problem</h3>
            <div className="whitespace-pre-wrap text-sm text-foreground/90">
              {problem.description}
            </div>
          </div>

          {problem.sampleInput ? (
            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="mb-2 font-semibold">Sample Input</h3>
              <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
                {problem.sampleInput}
              </pre>
            </div>
          ) : null}

          {problem.sampleOutput ? (
            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="mb-2 font-semibold">Sample Output</h3>
              <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
                {problem.sampleOutput}
              </pre>
            </div>
          ) : null}

          <ProblemConstraints constraints={problem.constraints} />

          <ProblemTestCasesPanel
            testCases={visibleCases}
            visibleOnly
            explanation={problem.explanation}
            showExplanation
          />

          {problem.createdBy ? (
            <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
              Created by {problem.createdBy.name}
            </div>
          ) : null}
        </div>
      </Panel>

      <PanelResizeHandle className="w-2 rounded-full bg-border/40 hover:bg-border" />

      <Panel defaultSize={55} minSize={35}>
        <div className="h-full space-y-5">
          <div className="sticky top-0 z-20 rounded-3xl border border-border bg-card/90 p-5 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="h-11 rounded-xl border border-border bg-background px-4"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                </select>

                <ProblemRunTimer
                  isRunning={timerRunning}
                  seconds={timerSeconds}
                  onStartToggle={onTimerToggle}
                  onReset={onTimerReset}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={onRun}
                  disabled={running || !!blockedPremium}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {running ? "Running..." : "Run"}
                </Button>

                <Button
                  onClick={onSubmit}
                  disabled={submitting || !!blockedPremium}
                  className="rounded-xl border-0 bg-primary text-primary-foreground"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>

            {!userExists ? (
              <p className="mt-4 text-sm text-muted-foreground">
                You can read the problem without login. Submit will redirect you to login.
              </p>
            ) : null}

            <div className="mt-4">
              <CodeEditor language={language} value={code} onChange={setCode} />
            </div>
          </div>

          <ProblemTestCasesPanel
            testCases={visibleCases}
            visibleOnly
            compact
            showTitle
          />

          <SubmissionHistoryPanel
            submissions={previousSubmissions}
            onUseSubmission={(nextCode) => setCode(nextCode)}
          />

          <SubmissionResult result={runResult} title="Run Result" />
          <SubmissionResult result={submission} title="Submission Result" />
        </div>
      </Panel>
    </PanelGroup>
  );
}