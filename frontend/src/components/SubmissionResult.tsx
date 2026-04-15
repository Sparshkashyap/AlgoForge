import type { Submission } from "@/types/submission.types";

const verdictClasses: Record<string, string> = {
  Accepted: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  "Wrong Answer": "text-amber-300 border-amber-500/20 bg-amber-500/10",
  "Runtime Error": "text-rose-300 border-rose-500/20 bg-rose-500/10",
  "Compilation Error": "text-rose-300 border-rose-500/20 bg-rose-500/10",
  Pending: "text-sky-300 border-sky-500/20 bg-sky-500/10",
  "Internal Error": "text-rose-300 border-rose-500/20 bg-rose-500/10",
};

export default function SubmissionResult({
  result,
  title = "Result",
}: {
  result: Submission | null;
  title?: string;
}) {
  if (!result) {
    return (
      <div className="rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">
          Run or submit code to see verdict, passed test cases, stdout, stderr, runtime, and memory.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            verdictClasses[result.verdict || result.status] ||
            "text-foreground border-border bg-muted"
          }`}
        >
          {result.verdict || result.status}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Passed</p>
          <p className="mt-1 text-xl font-bold">
            {result.passedCount ?? 0}/{result.totalCount ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Runtime</p>
          <p className="mt-1 text-xl font-bold">{result.runtime || "-"}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Memory</p>
          <p className="mt-1 text-xl font-bold">{result.memory || "-"}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Language</p>
          <p className="mt-1 text-xl font-bold">{result.language}</p>
        </div>
      </div>

      {result.stdout ? (
        <div>
          <p className="mb-2 text-sm font-medium">Stdout</p>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-background p-4 text-sm">
            {result.stdout}
          </pre>
        </div>
      ) : null}

      {result.stderr ? (
        <div>
          <p className="mb-2 text-sm font-medium text-rose-400">Stderr</p>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-background p-4 text-sm">
            {result.stderr}
          </pre>
        </div>
      ) : null}

      {result.compileOutput ? (
        <div>
          <p className="mb-2 text-sm font-medium text-rose-400">Compile Output</p>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-background p-4 text-sm">
            {result.compileOutput}
          </pre>
        </div>
      ) : null}
    </div>
  );
}