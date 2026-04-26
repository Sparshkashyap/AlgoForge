import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileCode2,
  FlaskConical,
  Layers,
  Sparkles,
  Play,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronDown,
  Code2,
  BookOpen,
  Cpu,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import CreatorSidebar from "@/components/CreatorSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  createProblemApi,
  generateAllLanguageTemplatesApi,
  getManageProblemByIdApi,
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

const LANG_LABELS: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
  c: "C",
};

const LANG_COLORS: Record<SupportedLanguage, string> = {
  javascript: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  python: "text-blue-400 border-blue-400/40 bg-blue-400/10",
  cpp: "text-purple-400 border-purple-400/40 bg-purple-400/10",
  java: "text-orange-400 border-orange-400/40 bg-orange-400/10",
  c: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10",
};

// Code section metadata — descriptions + icons
const CODE_SECTIONS = [
  {
    key: "starterCode" as const,
    label: "Starter Code",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
  description:
  "Hidden runner code. It must contain {{USER_CODE}} where the user's code will be injected. For Java, this driver must contain public class Main with main().",
placeholder: (lang: string) =>
  `${lang} driver code. Must contain {{USER_CODE}}...`,
  },
  {
    key: "languageTemplates" as const,
    label: "Language Template",
    icon: Layers,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/30",
    description:
  "Hidden runner code. It must contain {{USER_CODE}} where the user's code will be injected. For Java, this driver must contain public class Main with main().",
placeholder: (lang: string) =>
  `${lang} driver code. Must contain {{USER_CODE}}...`,
  },
  {
    key: "referenceSolutions" as const,
    label: "Reference Solution",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
   description:
  "Hidden runner code. It must contain {{USER_CODE}} where the user's code will be injected. For Java, this driver must contain public class Main with main().",
placeholder: (lang: string) =>
  `${lang} driver code. Must contain {{USER_CODE}}...`,
  },
  {
    key: "driverCode" as const,
    label: "Driver Code",
    icon: Cpu,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
   description:
  "Hidden runner code. It must contain {{USER_CODE}} where the user's code will be injected. For Java, this driver must contain public class Main with main().",
placeholder: (lang: string) =>
  `${lang} driver code. Must contain {{USER_CODE}}...`,
  },
];

type CodeSectionKey = "starterCode" | "languageTemplates" | "referenceSolutions" | "driverCode";

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionCard({
  title,
  icon: Icon,
  iconColor,
  description,
  children,
  action,
}: {
  title: string;
  icon: any;
  iconColor: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${iconColor === "text-blue-400" ? "bg-blue-500/10 border-blue-500/30" : iconColor === "text-emerald-400" ? "bg-emerald-500/10 border-emerald-500/30" : iconColor === "text-amber-400" ? "bg-amber-500/10 border-amber-500/30" : "bg-violet-500/10 border-violet-500/30"}`}>
            <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
          </div>
          <div>
            <h2 className="font-bold text-base">{title}</h2>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Code Block with label ────────────────────────────────────────────────────
function CodeTextarea({
  label,
  icon: Icon,
  iconClass,
  bgClass,
  description,
  value,
  onChange,
  placeholder,
  rows = 8,
}: {
  label: string;
  icon: any;
  iconClass: string;
  bgClass: string;
  description: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      {/* Label bar */}
      <div className={`flex items-center gap-2.5 px-4 py-2.5 border-b border-border/40 ${bgClass}`}>
        <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClass}`} />
        <span className={`text-xs font-bold uppercase tracking-[0.14em] ${iconClass}`}>
          {label}
        </span>
        <div className="ml-auto group relative">
          <Info className="h-3 w-3 text-muted-foreground/50 cursor-help" />
          <div className="absolute right-0 top-5 z-20 hidden w-56 rounded-lg border border-border bg-popover p-2.5 text-xs text-muted-foreground shadow-xl group-hover:block">
            {description}
          </div>
        </div>
      </div>
      {/* Textarea */}
      <textarea
        className="w-full bg-background/60 p-4 font-mono text-sm outline-none resize-none placeholder:text-muted-foreground/40 focus:bg-background/90 transition-colors"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

export default function CreateProblemPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { problemId } = useParams();

  const isEdit = Boolean(problemId);
  const canManage = user?.role === "ADMIN" || user?.role === "CREATOR";
  const isAdmin = user?.role === "ADMIN";

  // ── Form state ──────────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [tags, setTags] = useState("");
  const [constraints, setConstraints] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [boilerplateMode, setBoilerplateMode] = useState<"provided" | "optional" | "none">("provided");

  const [starterCode, setStarterCode] = useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [languageTemplates, setLanguageTemplates] = useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [referenceSolutions, setReferenceSolutions] = useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [driverCode, setDriverCode] = useState<Record<SupportedLanguage, string>>(EMPTY_CODE_PACK);
  const [testCases, setTestCases] = useState<ProblemTestCase[]>([
    { ...EMPTY_TEST_CASE, isHidden: false },
    { ...EMPTY_TEST_CASE, isHidden: true },
  ]);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [activeLang, setActiveLang] = useState<SupportedLanguage>("javascript");
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<any>(null);
  const [templateLoading, setTemplateLoading] = useState(false);

  const languages: SupportedLanguage[] = ["javascript", "python", "cpp", "java", "c"];

  const validTestCases = useMemo(
    () => testCases.filter((item) => item.input.trim() !== "" || item.expected.trim() !== ""),
    [testCases]
  );

  // ── Load for edit ───────────────────────────────────────────────────────────
  const loadProblem = async () => {
    try {
      const res = await getManageProblemByIdApi(problemId!);
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
      setStarterCode({ ...EMPTY_CODE_PACK, ...(p.starterCode || {}) });
      setLanguageTemplates({ ...EMPTY_CODE_PACK, ...(p.languageTemplates || {}) });
      setReferenceSolutions({ ...EMPTY_CODE_PACK, ...(p.referenceSolutions || {}) });
      setDriverCode({ ...EMPTY_CODE_PACK, ...(p.driverCode || {}) });
      setTestCases(
        Array.isArray(p.testCases) && p.testCases.length > 0
          ? p.testCases.map((tc: any) => ({
              id: tc.id,
              input: tc.input || "",
              expected: tc.expected || "",
              explanation: tc.explanation || "",
              isHidden: !!tc.isHidden,
            }))
          : [{ ...EMPTY_TEST_CASE, isHidden: false }, { ...EMPTY_TEST_CASE, isHidden: true }]
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load problem");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isEdit && canManage) void loadProblem();
  }, [problemId, isEdit, canManage]);

  if (!authLoading && (!user || !canManage)) return <Navigate to="/dashboard" replace />;

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading problem...
          </div>
        </div>
      </div>
    );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const updateCodePack = (
    setter: React.Dispatch<React.SetStateAction<Record<SupportedLanguage, string>>>,
    language: SupportedLanguage,
    value: string
  ) => setter((prev) => ({ ...prev, [language]: value }));

  const updateTestCase = (index: number, key: keyof ProblemTestCase, value: string | boolean) =>
    setTestCases((prev) => prev.map((item, idx) => (idx === index ? { ...item, [key]: value } : item)));

  const addTestCase = (hidden = true) =>
    setTestCases((prev) => [...prev, { ...EMPTY_TEST_CASE, isHidden: hidden }]);

  const removeTestCase = (index: number) =>
    setTestCases((prev) => prev.filter((_, idx) => idx !== index));

  const buildPayload = (): CreateProblemPayload => ({
    title: title.trim(),
    description: description.trim(),
    difficulty,
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
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
      if (pack.starterCode) setStarterCode({ ...EMPTY_CODE_PACK, ...pack.starterCode });
      if (pack.languageTemplates) setLanguageTemplates({ ...EMPTY_CODE_PACK, ...pack.languageTemplates });
      if (pack.referenceSolutions) setReferenceSolutions({ ...EMPTY_CODE_PACK, ...pack.referenceSolutions });
      if (pack.driverCode) setDriverCode({ ...EMPTY_CODE_PACK, ...pack.driverCode });
      toast.success("Language templates generated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to generate templates");
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

  const saveProblem = async (publishStatus: boolean) => {
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
      const payload: CreateProblemPayload = {
        ...buildPayload(),
        isPublished: publishStatus,
      };
      if (isEdit) {
        await updateProblemApi(problemId!, payload);
        toast.success("Problem updated!");
      } else {
        await createProblemApi(payload);
        toast.success("Problem created!");
      }
      navigate("/manage-problems");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProblem(isPublished);
  };

  const difficultyConfig = {
    Easy: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
    Medium: "border-amber-500/50 bg-amber-500/10 text-amber-400",
    Hard: "border-red-500/50 bg-red-500/10 text-red-400",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        {isAdmin ? <AdminSidebar /> : <CreatorSidebar />}

        <div className="space-y-6">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                  <FileCode2 className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {isEdit ? "Edit Problem" : "New Problem"}
                </span>
              </div>
              <h1 className="text-3xl font-black">
                {isEdit ? "Edit Problem" : "Create Problem"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the details below — all code sections have clear labels explaining their purpose.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* ── 1. Problem Details ─────────────────────────────────────── */}
            <SectionCard
              title="Problem Details"
              icon={BookOpen}
              iconColor="text-blue-400"
              description="Basic info shown to users on the problem page."
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Title *
                  </label>
                  <Input
                    placeholder="e.g. Two Sum"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Description *
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-background/60 p-3.5 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
                    rows={7}
                    placeholder="Full problem description with examples and edge cases..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Tags
                    </label>
                    <Input
                      placeholder="array, hash-map, two-pointer"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="rounded-xl"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Comma separated</p>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Difficulty
                    </label>
                    <div className="flex gap-2">
                      {(["Easy", "Medium", "Hard"] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                            difficulty === d
                              ? difficultyConfig[d]
                              : "border-border/50 bg-background/50 text-muted-foreground hover:border-border"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Constraints
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-background/60 p-3.5 text-sm font-mono outline-none focus:border-primary/50 transition-colors resize-none"
                    rows={3}
                    placeholder="1 ≤ n ≤ 10^5&#10;-10^9 ≤ nums[i] ≤ 10^9"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Sample Input
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-border bg-background/60 p-3.5 text-sm font-mono outline-none focus:border-primary/50 transition-colors resize-none"
                      rows={4}
                      placeholder="nums = [2,7,11,15]&#10;target = 9"
                      value={sampleInput}
                      onChange={(e) => setSampleInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Sample Output
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-border bg-background/60 p-3.5 text-sm font-mono outline-none focus:border-primary/50 transition-colors resize-none"
                      rows={4}
                      placeholder="[0, 1]"
                      value={sampleOutput}
                      onChange={(e) => setSampleOutput(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Explanation
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-background/60 p-3.5 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                    rows={3}
                    placeholder="Because nums[0] + nums[1] = 2 + 7 = 9..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPremium((v) => !v)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                      isPremium
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                        : "border-border/50 bg-background/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <span className="text-base">{isPremium ? "👑" : "🔓"}</span>
                    {isPremium ? "Premium" : "Free"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPublished((v) => !v)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                      isPublished
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        : "border-border/50 bg-background/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {isPublished ? "Published" : "Draft"}
                  </button>

                  <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/50 px-4 py-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Boilerplate:</span>
                    <select
                      className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
                      value={boilerplateMode}
                      onChange={(e) => setBoilerplateMode(e.target.value as any)}
                    >
                      <option value="provided">Provided</option>
                      <option value="optional">Optional</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── 2. Test Cases ──────────────────────────────────────────── */}
            <SectionCard
              title="Test Cases"
              icon={FlaskConical}
              iconColor="text-emerald-400"
              description="Visible test cases are shown to users. Hidden test cases run silently for final evaluation."
              action={
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addTestCase(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> Visible
                  </button>
                  <button
                    type="button"
                    onClick={() => addTestCase(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-border hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" /> Hidden
                  </button>
                </div>
              }
            >
              <div className="space-y-3">
                {testCases.map((tc, index) => (
                  <div
                    key={`${index}-${tc.id || "new"}`}
                    className={`rounded-xl border overflow-hidden transition-all ${
                      tc.isHidden
                        ? "border-border/40 bg-background/30"
                        : "border-emerald-500/20 bg-emerald-500/5"
                    }`}
                  >
                    {/* TC header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">
                          Test Case #{index + 1}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            tc.isHidden
                              ? "bg-muted/50 text-muted-foreground"
                              : "bg-emerald-500/15 text-emerald-400"
                          }`}
                        >
                          {tc.isHidden ? "Hidden" : "Visible"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateTestCase(index, "isHidden", !tc.isHidden)}
                          className="text-xs text-muted-foreground hover:text-foreground transition"
                        >
                          {tc.isHidden ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                        </button>
                        {testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="text-muted-foreground hover:text-red-400 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 p-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                          Input
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-border/40 bg-background/50 p-3 font-mono text-sm outline-none focus:border-primary/40 transition resize-none"
                          rows={4}
                          placeholder="Input value(s)..."
                          value={tc.input}
                          onChange={(e) => updateTestCase(index, "input", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                          Expected Output
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-border/40 bg-background/50 p-3 font-mono text-sm outline-none focus:border-primary/40 transition resize-none"
                          rows={4}
                          placeholder="Expected output..."
                          value={tc.expected}
                          onChange={(e) => updateTestCase(index, "expected", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Summary */}
                <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                  <span>
                    ✅ {testCases.filter((t) => !t.isHidden).length} visible
                  </span>
                  <span>
                    🔒 {testCases.filter((t) => t.isHidden).length} hidden
                  </span>
                  <span>
                    📋 {validTestCases.length} valid (non-empty)
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* ── 3. Code Packs ──────────────────────────────────────────── */}
            <SectionCard
              title="Code Packs"
              icon={Code2}
              iconColor="text-violet-400"
              description="All 4 code types per language. Switch languages using the tabs below."
              action={
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateTemplates}
                    disabled={templateLoading}
                    className="flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-400 transition hover:bg-violet-500/20 disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {templateLoading ? "Generating…" : "AI Generate"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePreviewRun}
                    disabled={previewLoading}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {previewLoading ? "Running…" : "Preview Run"}
                  </button>
                </div>
              }
            >
              {/* Legend */}
              <div className="mb-5 grid grid-cols-2 gap-2 md:grid-cols-4">
                {CODE_SECTIONS.map((s) => (
                  <div key={s.key} className={`rounded-xl border px-3 py-2.5 ${s.bg}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Language tabs */}
              <div className="mb-5 flex gap-1.5 flex-wrap">
                {languages.map((lang) => {
                  const hasContent =
                    referenceSolutions[lang] ||
                    starterCode[lang] ||
                    driverCode[lang] ||
                    languageTemplates[lang];

                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={`relative flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                        activeLang === lang
                          ? LANG_COLORS[lang]
                          : "border-border/40 bg-background/50 text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      {LANG_LABELS[lang]}
                      {hasContent && (
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 4 code textareas for active language */}
              <div className="space-y-4">
                {CODE_SECTIONS.map((section) => (
                  <CodeTextarea
                    key={section.key}
                    label={section.label}
                    icon={section.icon}
                    iconClass={section.color}
                    bgClass={section.bg}
                    description={section.description}
                    placeholder={section.placeholder(LANG_LABELS[activeLang])}
                    value={
                      section.key === "starterCode"
                        ? starterCode[activeLang]
                        : section.key === "languageTemplates"
                        ? languageTemplates[activeLang]
                        : section.key === "referenceSolutions"
                        ? referenceSolutions[activeLang]
                        : driverCode[activeLang]
                    }
                    onChange={(v) => {
                      const setterMap: Record<CodeSectionKey, any> = {
                        starterCode: setStarterCode,
                        languageTemplates: setLanguageTemplates,
                        referenceSolutions: setReferenceSolutions,
                        driverCode: setDriverCode,
                      };
                      updateCodePack(setterMap[section.key], activeLang, v);
                    }}
                    rows={9}
                  />
                ))}
              </div>

              {/* Preview result */}
              {previewResult && (
                <div className="mt-5 rounded-xl border border-border/50 overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-border/40 bg-muted/20 px-4 py-2.5">
                    {previewResult.status === "Accepted" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                    <span className="text-sm font-semibold">
                      Preview Result —{" "}
                      <span
                        className={
                          previewResult.status === "Accepted"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {previewResult.status}
                      </span>
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {previewResult.passedCount}/{previewResult.totalCount} passed
                    </span>
                  </div>
                  <pre className="max-h-48 overflow-auto p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                    {JSON.stringify(previewResult, null, 2)}
                  </pre>
                </div>
              )}
            </SectionCard>

            {/* ── Submit ─────────────────────────────────────────────────── */}
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => saveProblem(false)}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-border/60 bg-background/60 px-6 py-4 text-base font-bold text-foreground transition hover:border-border hover:bg-muted/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                    Saving…
                  </>
                ) : (
                  <>
                    <EyeOff className="h-5 w-5" />
                    Save as Draft
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => saveProblem(true)}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500 px-6 py-4 text-base font-bold text-white transition hover:bg-emerald-500/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5" />
                    {isEdit ? "Update & Publish" : "Create & Publish"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}