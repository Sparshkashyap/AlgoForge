import type { ProblemTestCase } from "@/types/problem.types";

type Props = {
  testCases?: ProblemTestCase[];
  visibleOnly?: boolean;
  compact?: boolean;
  showTitle?: boolean;
  explanation?: string | null;
  showExplanation?: boolean;
};

export default function ProblemTestCasesPanel({
  testCases = [],
  visibleOnly = false,
  compact = false,
  showTitle = true,
  explanation,
  showExplanation = false,
}: Props) {
  const finalCases = visibleOnly
    ? testCases.filter((testCase) => !testCase.isHidden)
    : testCases;

  if (!finalCases.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      {showTitle ? (
        <h3 className="mb-4 font-semibold">
          {compact ? "Visible Test Cases" : "Sample Test Cases"}
        </h3>
      ) : null}

      {showExplanation && explanation ? (
        <div className="mb-4 rounded-xl border border-border bg-muted/40 p-4">
          <p className="mb-2 text-sm font-medium">Explanation</p>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {explanation}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {finalCases.map((testCase, index) => (
          <div
            key={testCase.id || index}
            className="rounded-xl border border-border p-4"
          >
            <p className="mb-2 text-sm font-medium">Case {index + 1}</p>

            <div className={`grid gap-3 ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Input</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">
                  {testCase.input}
                </pre>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">Expected</p>
                <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm">
                  {testCase.expected}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}