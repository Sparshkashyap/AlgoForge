import { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  Copy,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import type { Submission } from "@/types/submission.types";
import { Button } from "@/components/ui/button";

function getVerdictStyles(verdict?: string | null) {
  const value = (verdict || "").toLowerCase();

  if (value.includes("accept")) {
    return {
      wrapper: "border-emerald-500/20 bg-emerald-500/10",
      text: "text-emerald-400",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    };
  }

  if (
    value.includes("wrong") ||
    value.includes("fail") ||
    value.includes("runtime") ||
    value.includes("compile")
  ) {
    return {
      wrapper: "border-rose-500/20 bg-rose-500/10",
      text: "text-rose-400",
      icon: <XCircle className="h-4 w-4 text-rose-400" />,
    };
  }

  return {
    wrapper: "border-amber-500/20 bg-amber-500/10",
    text: "text-amber-400",
    icon: <Clock3 className="h-4 w-4 text-amber-400" />,
  };
}

function formatSubmissionTime(value?: string) {
  if (!value) return "Just now";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function SubmissionHistoryPanel({
  submissions,
  onUseSubmission,
}: {
  submissions: Submission[];
  onUseSubmission: (code: string) => void;
}) {
  const items = useMemo(() => submissions.slice(0, 12), [submissions]);

  const handleCopy = async (code?: string) => {
    await navigator.clipboard.writeText(code || "");
    toast.success("Submission copied");
  };

  if (!items.length) {
    return (
      <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">Previous Submissions</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              No previous submissions yet. Once you submit code, your recent attempts
              will appear here for quick reuse and comparison.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold">Previous Submissions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reuse a past attempt, inspect verdicts, and move faster.
          </p>
        </div>

        <div className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {items.length} recent
        </div>
      </div>

      <div className="space-y-3">
        {items.map((submission) => {
          const verdict = submission.verdict || submission.status || "Pending";
          const verdictStyles = getVerdictStyles(verdict);

          return (
            <div
              key={submission.id}
              className="rounded-[1.3rem] border border-border/70 bg-card/70 p-4 transition hover:border-primary/25"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${verdictStyles.wrapper} ${verdictStyles.text}`}
                      >
                        {verdictStyles.icon}
                        {verdict}
                      </span>

                      <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {submission.language}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>
                        Runtime:{" "}
                        <span className="font-medium text-foreground/90">
                          {submission.runtime || "-"}
                        </span>
                      </span>
                      <span className="text-border">•</span>
                      <span>
                        Memory:{" "}
                        <span className="font-medium text-foreground/90">
                          {submission.memory || "-"}
                        </span>
                      </span>
                      <span className="text-border">•</span>
                      <span>{formatSubmissionTime(submission.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-border/70 bg-background/60"
                      onClick={() => onUseSubmission(submission.code || "")}
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Use
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-border/70 bg-background/60"
                      onClick={() => handleCopy(submission.code)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </div>

                {submission.code ? (
                  <pre className="max-h-40 overflow-auto rounded-[1rem] border border-border/70 bg-background/60 p-3 text-xs leading-6 text-foreground/85">
                    {submission.code}
                  </pre>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}