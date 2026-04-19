import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cpu,
  FileCode2,
  Gauge,
  TerminalSquare,
  XCircle,
} from "lucide-react";
import type { Submission } from "@/types/submission.types";

const verdictClasses: Record<
  string,
  {
    badge: string;
    icon: JSX.Element;
    tone: string;
    description: string;
  }
> = {
  Accepted: {
    badge: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    tone: "Accepted",
    description: "Your solution passed all evaluated test cases.",
  },
  "Wrong Answer": {
    badge: "text-amber-400 border-amber-500/20 bg-amber-500/10",
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    tone: "Wrong Answer",
    description: "The code ran, but at least one test case failed.",
  },
  "Runtime Error": {
    badge: "text-rose-400 border-rose-500/20 bg-rose-500/10",
    icon: <XCircle className="h-4 w-4 text-rose-400" />,
    tone: "Runtime Error",
    description: "Execution failed while running the submitted program.",
  },
  "Compilation Error": {
    badge: "text-rose-400 border-rose-500/20 bg-rose-500/10",
    icon: <XCircle className="h-4 w-4 text-rose-400" />,
    tone: "Compilation Error",
    description: "The program could not compile successfully.",
  },
  Pending: {
    badge: "text-sky-400 border-sky-500/20 bg-sky-500/10",
    icon: <Clock3 className="h-4 w-4 text-sky-400" />,
    tone: "Pending",
    description: "The result is still being processed.",
  },
  "Internal Error": {
    badge: "text-rose-400 border-rose-500/20 bg-rose-500/10",
    icon: <XCircle className="h-4 w-4 text-rose-400" />,
    tone: "Internal Error",
    description: "Something failed on the evaluation side.",
  },
};

function getVerdictMeta(verdict?: string, status?: string) {
  const key = verdict || status || "Pending";

  return (
    verdictClasses[key] || {
      badge: "text-foreground border-border bg-muted",
      icon: <Clock3 className="h-4 w-4 text-muted-foreground" />,
      tone: key,
      description: "Execution finished with a non-standard response.",
    }
  );
}

function ResultBlock({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: JSX.Element;
}) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-background/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

function OutputSection({
  title,
  value,
  danger = false,
}: {
  title: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
      <p
        className={`mb-3 text-sm font-semibold ${
          danger ? "text-rose-400" : "text-foreground"
        }`}
      >
        {title}
      </p>
      <pre className="overflow-x-auto rounded-[1rem] border border-border/60 bg-card/70 p-4 text-sm leading-7 text-foreground/92 whitespace-pre-wrap">
        {value}
      </pre>
    </div>
  );
}

export default function SubmissionResult({
  result,
  title = "Result",
}: {
  result: Submission | null;
  title?: string;
}) {
  if (!result) {
    return (
      <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
        <div className="flex items-start gap-3">
          <TerminalSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">{title}</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Run or submit code to see verdict, passed test cases, stdout,
              stderr, runtime, and memory.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const verdictMeta = getVerdictMeta(result.verdict, result.status);
  const verdictText = result.verdict || result.status || "Pending";
  const passedValue = `${result.passedCount ?? 0}/${result.totalCount ?? 0}`;

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold">{title}</h3>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            {verdictMeta.description}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${verdictMeta.badge}`}
        >
          {verdictMeta.icon}
          {verdictText}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ResultBlock
          title="Passed"
          value={passedValue}
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
        />
        <ResultBlock
          title="Runtime"
          value={result.runtime || "-"}
          icon={<Gauge className="h-4 w-4 text-primary" />}
        />
        <ResultBlock
          title="Memory"
          value={result.memory || "-"}
          icon={<Cpu className="h-4 w-4 text-primary" />}
        />
        <ResultBlock
          title="Language"
          value={result.language || "-"}
          icon={<FileCode2 className="h-4 w-4 text-primary" />}
        />
      </div>

      <div className="mt-5 space-y-4">
        {result.stdout ? (
          <OutputSection title="Stdout" value={result.stdout} />
        ) : null}

        {result.stderr ? (
          <OutputSection title="Stderr" value={result.stderr} danger />
        ) : null}

        {result.compileOutput ? (
          <OutputSection
            title="Compile Output"
            value={result.compileOutput}
            danger
          />
        ) : null}
      </div>
    </div>
  );
}