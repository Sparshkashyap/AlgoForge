import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import CreatorSidebar from "@/components/CreatorSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  createProblemApi,
  generateAllLanguageTemplatesApi,
  getAdminProblemByIdApi,
  previewRunProblemApi,
  updateProblemApi,
  type CreateProblemPayload,
} from "@/api/adminProblem.api";
import type { ProblemTestCase } from "@/types/problem.types";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

const EMPTY_TEST_CASE: ProblemTestCase = {
  input: "",
  expected: "",
  isHidden: true,
};

const EMPTY_CODE_PACK: Record<SupportedLanguage, string> = {
  javascript: "",
  python: "",
  cpp: "",
  java: "",
  c: "",
};

export default function CreateProblemPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { problemId } = useParams();

  const isEdit = Boolean(problemId);
  const canManage = user?.role === "ADMIN" || user?.role === "CREATOR";
  const isAdmin = user?.role === "ADMIN";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy"
  );
  const [tags, setTags] = useState("");
  const [constraints, setConstraints] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [boilerplateMode, setBoilerplateMode] = useState<
    "provided" | "optional" | "none"
  >("provided");

  const [starterCode, setStarterCode] =
    useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [languageTemplates, setLanguageTemplates] =
    useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [referenceSolutions, setReferenceSolutions] =
    useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [driverCode, setDriverCode] =
    useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);

  const [testCases, setTestCases] = useState<ProblemTestCase[]>([
    { ...EMPTY_TEST_CASE, isHidden: false },
    { ...EMPTY_TEST_CASE, isHidden: true },
  ]);

  const [pageLoading, setPageLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [templateLoading, setTemplateLoading] = useState(false);

  const validTestCases = useMemo(() => {
    return testCases.filter(
      (item) => item.input.trim() !== "" || item.expected.trim() !== ""
    );
  }, [testCases]);

  const loadProblem = async () => {
    try {
      const res = await getAdminProblemByIdApi(problemId!);
      const p = res.data;

      setTitle(p.title || "");
      setDescription(p.description || "");
      setDifficulty((p.difficulty || "Easy") as "Easy" | "Medium" | "Hard");
      setTags((p.tags || []).join(", "));
      setConstraints(p.constraints || "");
      setSampleInput(p.sampleInput || "");
      setSampleOutput(p.sampleOutput || "");
      setExplanation(p.explanation || "");
      setIsPremium(!!p.isPremium);
      setIsPublished(!!p.isPublished);
      setBoilerplateMode(p.boilerplateMode || "provided");
      setStarterCode({
        ...EMPTY_CODE_PACK,
        ...(p.starterCode || {}),
      });
      setLanguageTemplates({
        ...EMPTY_CODE_PACK,
        ...(p.languageTemplates || {}),
      });
      setReferenceSolutions({
        ...EMPTY_CODE_PACK,
        ...(p.referenceSolutions || {}),
      });
      setDriverCode({
        ...EMPTY_CODE_PACK,
        ...(p.driverCode || {}),
      });
      setTestCases(
        Array.isArray(p.testCases) && p.testCases.length > 0
          ? p.testCases.map((tc: any) => ({
              id: tc.id,
              input: tc.input || "",
              expected: tc.expected || "",
              explanation: tc.explanation || "",
              isHidden: !!tc.isHidden,
            }))
          : [
              { ...EMPTY_TEST_CASE, isHidden: false },
              { ...EMPTY_TEST_CASE, isHidden: true },
            ]
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load problem");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && canManage) {
      void loadProblem();
    }
  }, [problemId, isEdit, canManage]);

  if (!authLoading && (!user || !canManage)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center py-16">
          <span className="text-sm text-muted-foreground">
            Loading problem...
          </span>
        </div>
      </div>
    );
  }

  const updateCodePack = (
    setter: React.Dispatch<
      React.SetStateAction<Record<SupportedLanguage, string>>
    >,
    language: SupportedLanguage,
    value: string
  ) => {
    setter((prev) => ({
      ...prev,
      [language]: value,
    }));
  };

  const updateTestCase = (
    index: number,
    key: keyof ProblemTestCase,
    value: string | boolean
  ) => {
    setTestCases((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [key]: value } : item
      )
    );
  };

  const addTestCase = (hidden = true) => {
    setTestCases((prev) => [...prev, { ...EMPTY_TEST_CASE, isHidden: hidden }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, idx) => idx !== index));
  };

  const buildPayload = (): CreateProblemPayload => ({
    title: title.trim(),
    description: description.trim(),
    difficulty,
    tags: tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    constraints: constraints.trim() || undefined,
    isPremium,
    boilerplateMode,
    sampleInput: sampleInput.trim() || undefined,
    sampleOutput: sampleOutput.trim() || undefined,
    explanation: explanation.trim() || undefined,
    starterCode,
    languageTemplates,
    referenceSolutions,
    driverCode,
    isPublished,
    testCases: validTestCases,
  });

  const handleGenerateTemplates = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required before template generation");
      return;
    }

    const referenceCode = referenceSolutions.javascript?.trim();

    if (!referenceCode) {
      toast.error("Add JavaScript reference solution first");
      return;
    }

    try {
      setTemplateLoading(true);

      const res = await generateAllLanguageTemplatesApi({
        title: title.trim(),
        description: description.trim(),
        constraints: constraints.trim() || undefined,
        referenceLanguage: "javascript",
        referenceCode,
      });

      const pack = res?.data || {};

      if (pack.starterCode) {
        setStarterCode({
          ...EMPTY_CODE_PACK,
          ...pack.starterCode,
        });
      }

      if (pack.languageTemplates) {
        setLanguageTemplates({
          ...EMPTY_CODE_PACK,
          ...pack.languageTemplates,
        });
      }

      if (pack.referenceSolutions) {
        setReferenceSolutions({
          ...EMPTY_CODE_PACK,
          ...pack.referenceSolutions,
        });
      }

      if (pack.driverCode) {
        setDriverCode({
          ...EMPTY_CODE_PACK,
          ...pack.driverCode,
        });
      }

      toast.success("Language templates generated");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to generate templates"
      );
    } finally {
      setTemplateLoading(false);
    }
  };

  const handlePreviewRun = async () => {
    if (validTestCases.length === 0) {
      toast.error("Add at least one valid test case");
      return;
    }

    try {
      setPreviewLoading(true);

      const res = await previewRunProblemApi({
        language: "javascript",
        code: referenceSolutions.javascript || "",
        testCases: validTestCases,
        driverCode,
      });

      setPreviewResult(res?.data || null);
      toast.success("Preview run completed");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Preview failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (validTestCases.length === 0) {
      toast.error("At least one valid test case is required");
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();

      if (isEdit) {
        await updateProblemApi(problemId!, payload);
        toast.success("Problem updated");
      } else {
        await createProblemApi(payload);
        toast.success("Problem created");
      }

      navigate("/manage-problems");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const languages: SupportedLanguage[] = [
    "javascript",
    "python",
    "cpp",
    "java",
    "c",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        {isAdmin ? <AdminSidebar /> : <CreatorSidebar />}

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? "Edit Problem" : "Create Problem"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Creator can create problems. Admin can review and control quality.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full rounded-xl border border-border bg-background p-3 outline-none"
                rows={6}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />

                <select
                  className="h-12 rounded-xl border border-border bg-background px-3"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value as "Easy" | "Medium" | "Hard"
                    )
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <textarea
                className="w-full rounded-xl border border-border bg-background p-3 outline-none"
                rows={4}
                placeholder="Constraints"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <textarea
                  className="w-full rounded-xl border border-border bg-background p-3 outline-none"
                  rows={4}
                  placeholder="Sample Input"
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                />

                <textarea
                  className="w-full rounded-xl border border-border bg-background p-3 outline-none"
                  rows={4}
                  placeholder="Sample Output"
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                />
              </div>

              <textarea
                className="w-full rounded-xl border border-border bg-background p-3 outline-none"
                rows={4}
                placeholder="Explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
              />

              <div className="flex flex-wrap gap-5 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                  />
                  Premium
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  Published
                </label>

                <label className="inline-flex items-center gap-2">
                  Boilerplate mode
                  <select
                    className="rounded-lg border border-border bg-background px-2 py-1"
                    value={boilerplateMode}
                    onChange={(e) =>
                      setBoilerplateMode(
                        e.target.value as "provided" | "optional" | "none"
                      )
                    }
                  >
                    <option value="provided">Provided</option>
                    <option value="optional">Optional</option>
                    <option value="none">None</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Test Cases</h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => addTestCase(false)}
                  >
                    Add visible
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => addTestCase(true)}
                  >
                    Add hidden
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-4">
                {testCases.map((tc, index) => (
                  <div
                    key={`${index}-${tc.id || "new"}`}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <textarea
                        className="w-full rounded-xl border border-border bg-card p-3 outline-none"
                        rows={4}
                        placeholder="Input"
                        value={tc.input}
                        onChange={(e) =>
                          updateTestCase(index, "input", e.target.value)
                        }
                      />

                      <textarea
                        className="w-full rounded-xl border border-border bg-card p-3 outline-none"
                        rows={4}
                        placeholder="Expected Output"
                        value={tc.expected}
                        onChange={(e) =>
                          updateTestCase(index, "expected", e.target.value)
                        }
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!!tc.isHidden}
                          onChange={(e) =>
                            updateTestCase(index, "isHidden", e.target.checked)
                          }
                        />
                        Hidden
                      </label>

                      {testCases.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => removeTestCase(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Code Packs</h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={handleGenerateTemplates}
                    disabled={templateLoading}
                  >
                    {templateLoading
                      ? "Generating..."
                      : "Generate Templates"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={handlePreviewRun}
                    disabled={previewLoading}
                  >
                    {previewLoading ? "Running..." : "Preview Run"}
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-6">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <h3 className="text-lg font-semibold capitalize">{lang}</h3>

                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                      <textarea
                        className="w-full rounded-xl border border-border bg-card p-3 outline-none"
                        rows={6}
                        placeholder={`${lang} starter code`}
                        value={starterCode[lang]}
                        onChange={(e) =>
                          updateCodePack(
                            setStarterCode,
                            lang,
                            e.target.value
                          )
                        }
                      />

                      <textarea
                        className="w-full rounded-xl border border-border bg-card p-3 outline-none"
                        rows={6}
                        placeholder={`${lang} language template`}
                        value={languageTemplates[lang]}
                        onChange={(e) =>
                          updateCodePack(
                            setLanguageTemplates,
                            lang,
                            e.target.value
                          )
                        }
                      />

                      <textarea
                        className="w-full rounded-xl border border-border bg-card p-3 outline-none"
                        rows={6}
                        placeholder={`${lang} reference solution`}
                        value={referenceSolutions[lang]}
                        onChange={(e) =>
                          updateCodePack(
                            setReferenceSolutions,
                            lang,
                            e.target.value
                          )
                        }
                      />

                      <textarea
                        className="w-full rounded-xl border border-border bg-card p-3 outline-none"
                        rows={6}
                        placeholder={`${lang} driver code`}
                        value={driverCode[lang]}
                        onChange={(e) =>
                          updateCodePack(setDriverCode, lang, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {previewResult && (
                <div className="mt-5 rounded-xl border border-border bg-background p-4 text-sm">
                  <p className="font-medium">Preview Result</p>
                  <pre className="mt-3 overflow-auto whitespace-pre-wrap text-muted-foreground">
                    {JSON.stringify(previewResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <Button disabled={saving} className="w-full rounded-xl">
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Problem"
                : "Create Problem"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}