import { useMemo } from "react";
import { Copy } from "lucide-react";
import { toast } from "react-toastify";
import type { Submission } from "@/types/submission.types";
import { Button } from "@/components/ui/button";

export default function SubmissionHistoryPanel({
  submissions,
  onUseSubmission,
}: {
  submissions: Submission[];
  onUseSubmission: (code: string) => void;
}) {
  const items = useMemo(() => submissions.slice(0, 10), [submissions]);

  const handleCopy = async (code?: string) => {
    await navigator.clipboard.writeText(code || "");
    toast.success("Submission copied");
  };

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-xl">
        <p className="text-sm text-muted-foreground">
          No previous submissions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-xl">
      <h3 className="mb-4 font-heading text-lg font-semibold">Previous Submissions</h3>

      <div className="space-y-3">
        {items.map((submission) => (
          <div
            key={submission.id}
            className="rounded-2xl border border-border bg-background p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{submission.verdict || submission.status}</p>
                <p className="text-sm text-muted-foreground">
                  {submission.language} • Runtime: {submission.runtime || "-"} • Memory: {submission.memory || "-"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => onUseSubmission(submission.code || "")}
                >
                  Use
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => handleCopy(submission.code)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}