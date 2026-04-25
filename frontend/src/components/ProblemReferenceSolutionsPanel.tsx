import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, ShieldCheck } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

type Props = {
  problemId: string;
  referenceSolutions?: Record<string, string> | null;
};

const languageLabels: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
  c: "C",
};

export default function ProblemReferenceSolutionsPanel({
  problemId,
  referenceSolutions,
}: Props) {
  const availableLanguages = useMemo(() => {
    const source = referenceSolutions || {};

    return (Object.keys(source) as SupportedLanguage[]).filter((language) => {
      return Boolean(source[language]?.trim());
    });
  }, [referenceSolutions]);

  const [language, setLanguage] = useState<SupportedLanguage>("javascript");

  useEffect(() => {
    if (!availableLanguages.length) return;

    if (!availableLanguages.includes(language)) {
      setLanguage(availableLanguages[0]);
    }
  }, [availableLanguages, language]);

  if (!availableLanguages.length) {
    return (
      <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-semibold">Reference Solutions</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              No official solution has been added for this problem yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeCode = referenceSolutions?.[language] || "";

  return (
    <div className="space-y-4">
      <div className="rounded-[1.6rem] border border-border/70 bg-background/45 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-primary" />
              <h3 className="font-heading text-lg font-bold">
                Reference Solutions
              </h3>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Official code pack for comparison after you finish your own attempt.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Official
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {availableLanguages.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLanguage(item)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                language === item
                  ? "border-primary/35 bg-primary/10 text-foreground"
                  : "border-border/70 bg-card/70 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              }`}
            >
              {languageLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <CodeEditor
        language={language}
        value={activeCode}
        readOnly
        height="480px"
        storageKey={`algoforge:solution-editor:${problemId}`}
      />
    </div>
  );
}