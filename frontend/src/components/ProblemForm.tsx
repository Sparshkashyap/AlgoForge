import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PlayCircle, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeEditor from "@/components/CodeEditor";
import TestCaseForm, { type TestCaseItem } from "@/components/TestCaseForm";
import SubmissionResult from "@/components/SubmissionResult";
import {
  createProblemApi,
  generateAllLanguageTemplatesApi,
  previewRunProblemApi,
  updateProblemApi,
} from "@/api/adminProblem.api";
import type { Problem } from "@/types/problem.types";

const LANGUAGES = ["javascript", "python", "cpp", "java", "c"] as const;
type LanguageKey = (typeof LANGUAGES)[number];
type CodeBucket =
  | "starterCode"
  | "languageTemplates"
  | "referenceSolutions"
  | "driverCode";

const defaultTemplates: Record<LanguageKey, string> = {
  javascript: `function solve(input) {
  
}`,
  python: `def solve(input_data):
    
`,
  cpp: `string solve(string input) {
    
}`,
  java: `public class Main {
    public static String solve(String input) {
        
    }
}`,
  c: `char* solve(char* input) {
    
}`,
};

const defaultDriverCode: Record<LanguageKey, string> = {
  javascript: `const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();
process.stdout.write(String(solve(input)));`,
  python: `import sys

input_data = sys.stdin.read().strip()
print(solve(input_data))`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string input, line;
    while (getline(cin, line)) {
        input += line + "\\n";
    }

    cout << solve(input);
    return 0;
}`,
  java: ``,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    char input[10000];
    int len = fread(input, 1, sizeof(input) - 1, stdin);
    input[len] = '\\0';
    printf("%s", solve(input));
    return 0;
}`,
};

type Props = {
  initialProblem?: Problem | null;
  mode?: "create" | "edit";
};

export default function ProblemForm({
  initialProblem = null,
  mode = "create",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewResult, setPreviewResult] = useState<any>(null);

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageKey>("javascript");

  const [selectedBucket, setSelectedBucket] =
    useState<CodeBucket>("referenceSolutions");

  const [testCases, setTestCases] = useState<TestCaseItem[]>(
    initialProblem?.testCases?.length
      ? initialProblem.testCases.map((tc) => ({
          input: tc.input,
          expected: tc.expected,
          isHidden: tc.isHidden,
        }))
      : [
          {
            input: "",
            expected: "",
            isHidden: false,
          },
        ]
  );

  const [form, setForm] = useState({
    title: initialProblem?.title || "",
    description: initialProblem?.description || "",
    difficulty:
      (initialProblem?.difficulty as "Easy" | "Medium" | "Hard") || "Easy",
    tags: initialProblem?.tags?.join(", ") || "",
    constraints: initialProblem?.constraints || "",
    isPremium: initialProblem?.isPremium || false,
    boilerplateMode:
      (initialProblem?.boilerplateMode as "provided" | "optional" | "none") ||
      "provided",
    sampleInput: initialProblem?.sampleInput || "",
    sampleOutput: initialProblem?.sampleOutput || "",
    explanation: initialProblem?.explanation || "",
    isPublished: initialProblem?.isPublished ?? true,
    starterCode: {
      ...defaultTemplates,
      ...(initialProblem?.starterCode || {}),
    } as Record<LanguageKey, string>,
    languageTemplates: {
      ...defaultTemplates,
      ...(initialProblem?.languageTemplates || {}),
    } as Record<LanguageKey, string>,
    referenceSolutions: {
      ...defaultTemplates,
      ...(initialProblem?.referenceSolutions || {}),
    } as Record<LanguageKey, string>,
    driverCode: {
      ...defaultDriverCode,
      ...(initialProblem?.driverCode || {}),
    } as Record<LanguageKey, string>,
  });

  const editorValue = useMemo(() => {
    return form[selectedBucket][selectedLanguage] || "";
  }, [form, selectedBucket, selectedLanguage]);

  const setCodeForBucket = (
    bucket: CodeBucket,
    language: LanguageKey,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [bucket]: {
        ...prev[bucket],
        [language]: value,
      },
    }));
  };

  const handleEditorChange = (value: string) => {
    setCodeForBucket(selectedBucket, selectedLanguage, value);
  };

  const handleGenerateAll = async () => {
    const referenceCode = form.referenceSolutions[selectedLanguage];

    if (!referenceCode?.trim()) {
      toast.error("Selected language reference solution is empty");
      return;
    }

    try {
      setGenerating(true);

      const data = await generateAllLanguageTemplatesApi({
        title: form.title,
        description: form.description,
        constraints: form.constraints,
        referenceLanguage: selectedLanguage,
        referenceCode,
      });

      setForm((prev) => ({
        ...prev,
        languageTemplates: {
          ...prev.languageTemplates,
          ...data.data.languageTemplates,
        },
        starterCode: {
          ...prev.starterCode,
          ...data.data.languageTemplates,
        },
        referenceSolutions: {
          ...prev.referenceSolutions,
          ...data.data.referenceSolutions,
        },
        driverCode: {
          ...prev.driverCode,
          ...data.data.driverCode,
        },
      }));

      toast.success("All language templates generated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewRun = async () => {
    try {
      setPreviewing(true);

      const finalCode =
        form.referenceSolutions[selectedLanguage] ||
        form.languageTemplates[selectedLanguage];

      if (!finalCode?.trim()) {
        toast.error("No code available for preview run");
        return;
      }

      const data = await previewRunProblemApi({
        language: selectedLanguage,
        code: finalCode,
        testCases,
        driverCode: form.driverCode,
      });

      setPreviewResult({
        language: selectedLanguage,
        status: data.data.verdict || data.data.status,
        verdict: data.data.verdict,
        stdout: data.data.stdout,
        stderr: data.data.stderr,
        compileOutput: data.data.compileOutput,
        runtime: data.data.runtime,
        memory: data.data.memory,
        passedCount: data.data.passedCount,
        totalCount: data.data.totalCount,
      });

      toast.success(`Preview: ${data.data.verdict || data.data.status}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Preview run failed");
    } finally {
      setPreviewing(false);
    }
  };

  const handleCopyTemplateToReference = () => {
    const template = form.languageTemplates[selectedLanguage] || "";
    setCodeForBucket("referenceSolutions", selectedLanguage, template);
    setSelectedBucket("referenceSolutions");
    toast.success("Copied user boilerplate → reference");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      constraints: form.constraints,
      isPremium: form.isPremium,
      boilerplateMode: form.boilerplateMode,
      sampleInput: form.sampleInput,
      sampleOutput: form.sampleOutput,
      explanation: form.explanation,
      isPublished: form.isPublished,
      starterCode: form.boilerplateMode === "none" ? {} : form.starterCode,
      languageTemplates:
        form.boilerplateMode === "none" ? {} : form.languageTemplates,
      referenceSolutions: form.referenceSolutions,
      driverCode: form.driverCode,
      testCases,
    };

    try {
      setLoading(true);

      if (mode === "edit" && initialProblem?.id) {
        await updateProblemApi(initialProblem.id, payload);
        toast.success("Problem updated successfully");
      } else {
        await createProblemApi(payload);
        toast.success("Problem created successfully");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Problem save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-xl space-y-5">
        <div>
          <label className="text-sm font-medium">Problem Title</label>
          <Input
            className="mt-2 h-12 rounded-xl"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Best Time to Buy and Sell Stock"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-2 min-h-[220px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Write the full problem statement"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Difficulty</label>
            <select
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4"
              value={form.difficulty}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  difficulty: e.target.value as "Easy" | "Medium" | "Hard",
                }))
              }
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tags</label>
            <Input
              className="mt-2 h-12 rounded-xl"
              value={form.tags}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="Array, Dynamic Programming"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Constraints</label>
          <textarea
            className="mt-2 min-h-[120px] w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
            value={form.constraints}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, constraints: e.target.value }))
            }
            placeholder={`1 <= prices.length <= 10^5
0 <= prices[i] <= 10^4`}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPremium}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isPremium: e.target.checked }))
              }
            />
            Premium problem
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isPublished: e.target.checked }))
              }
            />
            Publish immediately
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-xl space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-heading text-xl font-semibold">
              Boilerplate / Template / Reference / Driver
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Admin code controls live here.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="h-11 rounded-xl border border-border bg-background px-4"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguageKey)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>

            <select
              className="h-11 rounded-xl border border-border bg-background px-4"
              value={selectedBucket}
              onChange={(e) => setSelectedBucket(e.target.value as CodeBucket)}
            >
              <option value="languageTemplates">User Boilerplate</option>
              <option value="starterCode">Starter Code</option>
              <option value="referenceSolutions">Reference Solution</option>
              <option value="driverCode">Hidden Driver Code</option>
            </select>

            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={handleGenerateAll}
              disabled={generating}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? "Generating..." : "Generate All Languages"}
            </Button>
          </div>
        </div>

        <CodeEditor
          language={selectedLanguage}
          value={editorValue}
          onChange={handleEditorChange}
          height="430px"
        />

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyTemplateToReference}
          >
            Copy Boilerplate → Reference
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-heading text-xl font-semibold">Admin Preview Run</h3>

          <div className="flex items-center gap-3">
            <select
              className="h-11 rounded-xl border border-border bg-background px-4"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as LanguageKey)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>

            <Button type="button" variant="outline" onClick={handlePreviewRun}>
              <PlayCircle className="mr-2 h-4 w-4" />
              {previewing ? "Running..." : "Preview Run"}
            </Button>
          </div>
        </div>

        <SubmissionResult result={previewResult} title="Preview Result" />
      </div>

      <div className="rounded-3xl border border-border bg-card/90 p-6 backdrop-blur-xl">
        <h3 className="font-heading text-xl font-semibold mb-4">Test Cases</h3>
        <TestCaseForm testCases={testCases} setTestCases={setTestCases} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="rounded-xl border-0 bg-primary text-primary-foreground"
        >
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : mode === "edit" ? "Update Problem" : "Create Problem"}
        </Button>
      </div>
    </form>
  );
}