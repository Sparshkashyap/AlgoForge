import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import type { ProblemTestCase } from "@/types/problem.types";

type Props = {
  testCases?: ProblemTestCase[] | null;
  visibleOnly?: boolean;
  compact?: boolean;
  showTitle?: boolean;
  explanation?: string | null;
  showExplanation?: boolean;
};

export default function ProblemTestCasesPanel({
  testCases,
  visibleOnly = false,
  compact = false,
  showTitle = true,
  explanation,
  showExplanation = false,
}: Props) {
  const safeCases = Array.isArray(testCases) ? testCases : [];

  const finalCases = visibleOnly
    ? safeCases.filter((tc) => !tc?.isHidden)
    : safeCases;

  const handleCopy = async (text?: string) => {
    await navigator.clipboard.writeText(text || "");
    toast.success("Copied");
  };

  if (!finalCases.length) return null;

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
      {showTitle && (
        <h3 className="mb-5 font-heading text-lg font-bold">
          {compact ? "Visible Test Cases" : "Sample Test Cases"}
        </h3>
      )}

      {showExplanation && explanation && (
        <div className="mb-5 rounded-[1.3rem] border border-primary/20 bg-primary/10 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-primary">
            Explanation
          </p>
          <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
            {explanation}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {finalCases.map((testCase, index) => (
          <div
            key={testCase?.id || index}
            className="group relative overflow-hidden rounded-[1.3rem] border border-border/70 bg-background/60 p-4 transition hover:border-primary/30"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
                  Case {index + 1}
                </span>

                {!visibleOnly && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      testCase?.isHidden
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {testCase?.isHidden ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Hidden
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        Visible
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`grid gap-4 ${
                compact ? "grid-cols-1" : "md:grid-cols-2"
              }`}
            >
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Input
                  </p>

                  <button
                    onClick={() => handleCopy(testCase?.input)}
                    className="opacity-0 transition group-hover:opacity-100"
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                  </button>
                </div>

                <pre className="whitespace-pre-wrap rounded-lg border border-border/70 bg-muted/50 p-3 text-sm leading-6">
                  {testCase?.input || "—"}
                </pre>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Expected
                  </p>

                  <button
                    onClick={() => handleCopy(testCase?.expected)}
                    className="opacity-0 transition group-hover:opacity-100"
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                  </button>
                </div>

                <pre className="whitespace-pre-wrap rounded-lg border border-border/70 bg-muted/50 p-3 text-sm leading-6">
                  {testCase?.expected || "—"}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}