import { Button } from "@/components/ui/button";

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
    <div className="space-y-4">
      {testCases.map((testCase, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-background p-4 space-y-3"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Input</label>
              <textarea
                className="mt-2 min-h-[100px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                value={testCase.input}
                onChange={(e) =>
                  updateTestCase(index, "input", e.target.value)
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Expected Output</label>
              <textarea
                className="mt-2 min-h-[100px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                value={testCase.expected}
                onChange={(e) =>
                  updateTestCase(index, "expected", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={testCase.isHidden}
                onChange={(e) =>
                  updateTestCase(index, "isHidden", e.target.checked)
                }
              />
              Hidden test case
            </label>

            <Button
              type="button"
              variant="outline"
              onClick={() => removeTestCase(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addTestCase}>
        Add Test Case
      </Button>
    </div>
  );
}