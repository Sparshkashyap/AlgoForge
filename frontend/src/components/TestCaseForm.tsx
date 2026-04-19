import { Button } from "@/components/ui/button";
import { Plus, Trash2, EyeOff, Eye } from "lucide-react";

export type TestCaseItem = {
  input: string;
  expected: string;
  isHidden: boolean;
};

type Props = {
  testCases: TestCaseItem[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCaseItem[]>>;
};

export default function TestCaseForm({ testCases, setTestCases }: Props) {
  const updateTestCase = (
    index: number,
    field: keyof TestCaseItem,
    value: string | boolean
  ) => {
    setTestCases((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      { input: "", expected: "", isHidden: true },
    ]);
  };

  const removeTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold">Test Cases</h3>
          <p className="text-sm text-muted-foreground">
            Define input-output pairs. Hidden cases are used during evaluation only.
          </p>
        </div>

        <Button
          type="button"
          onClick={addTestCase}
          className="rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Case
        </Button>
      </div>

      {/* CASES */}
      {testCases.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background/50 p-6 text-sm text-muted-foreground text-center">
          No test cases added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {testCases.map((testCase, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[1.5rem] border border-border/70 bg-card/70 p-5 transition hover:border-primary/30"
            >
              {/* header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                    Case {index + 1}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      testCase.isHidden
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {testCase.isHidden ? (
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
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeTestCase(index)}
                  className="rounded-xl border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              {/* INPUT / OUTPUT */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Input
                  </label>
                  <textarea
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary/40"
                    value={testCase.input}
                    onChange={(e) =>
                      updateTestCase(index, "input", e.target.value)
                    }
                    placeholder="Enter input..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Expected Output
                  </label>
                  <textarea
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary/40"
                    value={testCase.expected}
                    onChange={(e) =>
                      updateTestCase(index, "expected", e.target.value)
                    }
                    placeholder="Expected result..."
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testCase.isHidden}
                    onChange={(e) =>
                      updateTestCase(index, "isHidden", e.target.checked)
                    }
                  />
                  Hidden test case (used only in evaluation)
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}