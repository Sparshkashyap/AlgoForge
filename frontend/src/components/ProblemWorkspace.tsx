import { useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Crown,
  Lock,
  Play,
  Send,
  Sparkles,
  TimerReset,
  Zap,
  History,
  FlaskConical,
  TerminalSquare,
  CheckCircle2,
} from "lucide-react";
import type { Problem } from "@/types/problem.types";
import type { Submission } from "@/types/submission.types";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import ProblemRunTimer from "@/components/ProblemRunTimer";
import ProblemTestCasesPanel from "@/components/ProblemTestCasesPanel";
import SubmissionResult from "@/components/SubmissionResult";
import ProblemDescriptionTabs from "@/components/ProblemDescriptionTabs";
import SubmissionHistoryPanel from "@/components/SubmissionHistoryPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  customInput: string;
  setCustomInput: (value: string) => void;
  customExpectedOutput: string;
  setCustomExpectedOutput: (value: string) => void;
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
  customInput,
  setCustomInput,
  customExpectedOutput,
  setCustomExpectedOutput,
}: Props) {
  const safeTags = Array.isArray(problem?.tags) ? problem.tags : [];
  const safeTestCases = Array.isArray(problem?.testCases)
    ? problem.testCases
    : [];
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

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (modifierPressed && event.key === "Enter") {
        event.preventDefault();
        if (!running && !blockedPremium) {
          onRun();
        }
      }

      if (event.shiftKey && event.key === "Enter") {
        event.preventDefault();
        if (!submitting && !blockedPremium) {
          onSubmit();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [blockedPremium, onRun, onSubmit, running, submitting]);

  return (
    <PanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-110px)] gap-4"
    >
      <Panel defaultSize={42} minSize={28}>
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
                        You can inspect the prompt, but running and submitting
                        this problem requires Pro access.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5">
              <ProblemDescriptionTabs
                problem={problem}
                previousSubmissions={previousSubmissions}
                onUseSubmission={setCode}
              />
            </div>
          </div>
        </div>
      </Panel>

      <PanelResizeHandle className="relative w-2">
        <div className="mx-auto h-full w-[2px] rounded-full bg-border/40 transition hover:bg-primary/40" />
      </PanelResizeHandle>

      <Panel defaultSize={58} minSize={35}>
        <PanelGroup direction="vertical" className="h-full gap-4">
          <Panel defaultSize={66} minSize={40}>
            <div className="h-full rounded-[2rem] border border-border/70 bg-card/88 p-4 backdrop-blur-2xl md:p-5">
              <div className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-background/80 p-4 backdrop-blur">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                      <select
                        value={language}
                        onChange={(e) =>
                          setLanguage(e.target.value as SupportedLanguage)
                        }
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

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Autosave enabled
                      </span>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-primary">
                        Dynamic editor
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <TimerReset className="h-4 w-4 text-primary" />
                        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          Session
                        </span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Timer
                      </p>
                      <p className="mt-1 text-xl font-black">{timerSeconds}s</p>
                    </div>

                    <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          Draft
                        </span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Language
                      </p>
                      <p className="mt-1 text-xl font-black capitalize">
                        {language}
                      </p>
                    </div>

                    <div className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <History className="h-4 w-4 text-primary" />
                        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          History
                        </span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Attempts
                      </p>
                      <p className="mt-1 text-xl font-black">
                        {previousSubmissions.length}
                      </p>
                    </div>
                  </div>
                </div>

                {!userExists ? (
                  <p className="text-sm leading-7 text-muted-foreground">
                    You can inspect the problem without login. Submitting will
                    redirect you to login first.
                  </p>
                ) : null}

                <div className="min-h-0 flex-1 overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/70">
                  <CodeEditor
                    language={language}
                    value={code || ""}
                    onChange={setCode}
                    storageKey={`algoforge:workspace:${problem.id}:${language}`}
                  />
                </div>

                <div className="sticky bottom-0 z-20 rounded-[1.3rem] border border-border/70 bg-background/85 p-4 backdrop-blur-xl">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 uppercase tracking-[0.16em]">
                        Actions
                      </span>
                      <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 uppercase tracking-[0.16em]">
                        Ctrl/Cmd + Enter → Run
                      </span>
                      <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 uppercase tracking-[0.16em]">
                        Shift + Enter → Submit
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={onRun}
                        disabled={running || blockedPremium}
                        variant="outline"
                        className="h-11 rounded-xl border-border/70 bg-background/60 px-5"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {running ? "Running..." : "Run Code"}
                      </Button>

                      <Button
                        onClick={onSubmit}
                        disabled={submitting || blockedPremium}
                        className="h-11 rounded-xl border-0 bg-primary px-5 text-primary-foreground shadow-[0_14px_34px_rgba(100,90,255,0.22)]"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {submitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="relative h-2">
            <div className="mx-auto h-[2px] w-full rounded-full bg-border/40 transition hover:bg-primary/40" />
          </PanelResizeHandle>

          <Panel defaultSize={34} minSize={18}>
            <div className="h-full rounded-[2rem] border border-border/70 bg-card/75 p-4 backdrop-blur-xl">
              <Tabs defaultValue="testcases" className="flex h-full flex-col">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <TabsList className="h-auto flex-wrap justify-start gap-2 rounded-[1.2rem] border border-border/70 bg-background/60 p-2">
                    <TabsTrigger value="testcases" className="rounded-xl px-4 py-2">
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Test Cases
                    </TabsTrigger>

                    <TabsTrigger value="custom" className="rounded-xl px-4 py-2">
                      <TerminalSquare className="mr-2 h-4 w-4" />
                      Custom
                    </TabsTrigger>

                    <TabsTrigger value="run" className="rounded-xl px-4 py-2">
                      <TerminalSquare className="mr-2 h-4 w-4" />
                      Run Result
                    </TabsTrigger>

                    <TabsTrigger value="submit" className="rounded-xl px-4 py-2">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit Result
                    </TabsTrigger>

                    <TabsTrigger
                      value="submissions"
                      className="rounded-xl px-4 py-2"
                    >
                      <History className="mr-2 h-4 w-4" />
                      Submissions
                    </TabsTrigger>
                  </TabsList>

                  <div className="rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Right workbench
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  <TabsContent value="testcases" className="mt-0">
                    <ProblemTestCasesPanel
                      testCases={visibleCases}
                      visibleOnly
                      compact
                      showTitle
                      layout="horizontal"
                      explanation={problem?.explanation}
                      showExplanation
                    />
                  </TabsContent>

                  <TabsContent value="custom" className="mt-0">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">Custom Input</p>
                          <span className="text-xs text-muted-foreground">
                            stdin
                          </span>
                        </div>

                        <textarea
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          placeholder="Enter custom input here..."
                          className="mt-3 min-h-[160px] w-full resize-y rounded-xl border border-border bg-card/70 p-3 font-mono text-sm outline-none focus:border-primary/50"
                        />
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">
                            Expected Output
                          </p>
                          <span className="text-xs text-muted-foreground">
                            optional
                          </span>
                        </div>

                        <textarea
                          value={customExpectedOutput}
                          onChange={(e) =>
                            setCustomExpectedOutput(e.target.value)
                          }
                          placeholder="Enter expected output here..."
                          className="mt-3 min-h-[160px] w-full resize-y rounded-xl border border-border bg-card/70 p-3 font-mono text-sm outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/70 p-4">
                      <p className="text-sm text-muted-foreground">
                        Run Code will use this custom test case if input is
                        filled. Otherwise it uses the visible sample test case.
                      </p>

                      <Button
                        onClick={onRun}
                        disabled={running || blockedPremium}
                        className="rounded-xl"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {running ? "Running..." : "Run Custom"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="run" className="mt-0">
                    <SubmissionResult result={runResult} title="Run Result" />
                  </TabsContent>

                  <TabsContent value="submit" className="mt-0">
                    <SubmissionResult
                      result={submission}
                      title="Submission Result"
                    />
                  </TabsContent>

                  <TabsContent value="submissions" className="mt-0">
                    <SubmissionHistoryPanel
                      submissions={
                        Array.isArray(previousSubmissions)
                          ? previousSubmissions
                          : []
                      }
                      onUseSubmission={(nextCode) => setCode(nextCode)}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}