import { useEffect, useMemo, useState } from "react";
import { Copy, Eye, EyeOff, FlaskConical, Layers3 } from "lucide-react";
import { toast } from "react-toastify";
import type { ProblemTestCase } from "@/types/problem.types";

type Props = {
  testCases?: ProblemTestCase[] | null;
  visibleOnly?: boolean;
  compact?: boolean;
  showTitle?: boolean;
  explanation?: string | null;
  showExplanation?: boolean;
  layout?: "vertical" | "horizontal";
};

function CaseBlock({
  label,
  value,
  onCopy,
}: {
  label: string;
  value?: string;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-background/60 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg p-1 text-muted-foreground transition hover:bg-background hover:text-primary"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      <pre className="whitespace-pre-wrap break-words rounded-xl border border-border/70 bg-muted/40 p-3 text-sm leading-6 text-foreground/90">
        {value || "—"}
      </pre>
    </div>
  );
}

export default function ProblemTestCasesPanel({
  testCases,
  visibleOnly = false,
  compact = false,
  showTitle = true,
  explanation,
  showExplanation = false,
  layout = "vertical",
}: Props) {
  const safeCases = Array.isArray(testCases) ? testCases : [];

  const finalCases = useMemo(() => {
    return visibleOnly ? safeCases.filter((tc) => !tc?.isHidden) : safeCases;
  }, [safeCases, visibleOnly]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex > finalCases.length - 1) {
      setSelectedIndex(0);
    }
  }, [finalCases.length, selectedIndex]);

  const handleCopy = async (text?: string) => {
    await navigator.clipboard.writeText(text || "");
    toast.success("Copied");
  };

  if (!finalCases.length) {
    return (
      <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">Test Cases</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              No test cases are available for this problem yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "horizontal") {
    const activeCase = finalCases[selectedIndex] || finalCases[0];

    return (
      <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
        {showTitle && (
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold">
                {compact ? "Test Cases" : "Sample Test Cases"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Switch cases horizontally and validate behavior fast.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Layers3 className="h-3.5 w-3.5" />
              {finalCases.length} cases
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {finalCases.map((testCase, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={testCase?.id || index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`shrink-0 rounded-2xl border px-4 py-2 text-left transition ${
                  isActive
                    ? "border-primary/35 bg-primary/10 text-foreground"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Case {index + 1}</span>

                  {!visibleOnly && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        testCase?.isHidden
                          ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                          : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
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
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <CaseBlock
            label="Input"
            value={activeCase?.input}
            onCopy={() => handleCopy(activeCase?.input)}
          />

          <CaseBlock
            label="Expected Output"
            value={activeCase?.expected}
            onCopy={() => handleCopy(activeCase?.expected)}
          />
        </div>

        {showExplanation && explanation ? (
          <div className="mt-4 rounded-[1.3rem] border border-primary/20 bg-primary/10 p-4">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-primary">
              Explanation
            </p>
            <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
              {explanation}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

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
                        ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
                        : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
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

            <div className={`grid gap-4 ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
              <CaseBlock
                label="Input"
                value={testCase?.input}
                onCopy={() => handleCopy(testCase?.input)}
              />
              <CaseBlock
                label="Expected"
                value={testCase?.expected}
                onCopy={() => handleCopy(testCase?.expected)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}