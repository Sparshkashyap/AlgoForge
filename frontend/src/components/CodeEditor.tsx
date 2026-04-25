import { useEffect, useMemo, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  Check,
  Copy,
  FileCode2,
  Maximize2,
  Minimize2,
  Monitor,
  MoonStar,
  RotateCcw,
  ScanLine,
  SunMedium,
  WrapText,
  ListOrdered,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";
type EditorTheme = "vs-dark" | "vs-light" | "hc-black";

type Props = {
  language: SupportedLanguage;
  value: string;
  onChange?: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  storageKey?: string;
};

const editorLanguageMap: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  python: "python",
  cpp: "cpp",
  java: "java",
  c: "c",
};

const languageLabelMap: Record<SupportedLanguage, string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
  c: "C",
};

const themeOptions: {
  value: EditorTheme;
  label: string;
  icon: JSX.Element;
}[] = [
  {
    value: "vs-dark",
    label: "Night",
    icon: <MoonStar className="h-4 w-4" />,
  },
  {
    value: "vs-light",
    label: "Light",
    icon: <SunMedium className="h-4 w-4" />,
  },
  {
    value: "hc-black",
    label: "Contrast",
    icon: <Monitor className="h-4 w-4" />,
  },
];

const fontSizes = [12, 13, 14, 16, 18];

function RailToggle({
  title,
  description,
  active,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
  icon: JSX.Element;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-3 text-left transition ${
        active
          ? "border-primary/40 bg-primary/10 text-white shadow-[0_0_0_1px_rgba(126,87,255,0.15)_inset]"
          : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="mt-1 text-xs text-white/50">{description}</p>
    </button>
  );
}

export default function CodeEditor({
  language,
  value,
  onChange,
  height = "560px",
  readOnly = false,
  storageKey = "algoforge:editor",
}: Props) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState<EditorTheme>("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [showRail, setShowRail] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${storageKey}:prefs`);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        theme?: EditorTheme;
        fontSize?: number;
        wordWrap?: boolean;
        minimap?: boolean;
        lineNumbers?: boolean;
        showRail?: boolean;
      };

      if (parsed.theme) setTheme(parsed.theme);
      if (typeof parsed.fontSize === "number") setFontSize(parsed.fontSize);
      if (typeof parsed.wordWrap === "boolean") setWordWrap(parsed.wordWrap);
      if (typeof parsed.minimap === "boolean") setMinimap(parsed.minimap);
      if (typeof parsed.lineNumbers === "boolean") setLineNumbers(parsed.lineNumbers);
      if (typeof parsed.showRail === "boolean") setShowRail(parsed.showRail);
    } catch {
      //
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(
        `${storageKey}:prefs`,
        JSON.stringify({
          theme,
          fontSize,
          wordWrap,
          minimap,
          lineNumbers,
          showRail,
        }),
      );
    } catch {
      //
    }
  }, [
    fontSize,
    lineNumbers,
    minimap,
    showRail,
    storageKey,
    theme,
    wordWrap,
  ]);

  const finalHeight = useMemo(() => {
    return expanded ? "82vh" : height;
  }, [expanded, height]);

  const lineCount = useMemo(() => {
    if (!value) return 1;
    return value.split("\n").length;
  }, [value]);

  const characterCount = useMemo(() => {
    return (value || "").length;
  }, [value]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleResetView = () => {
    setTheme("vs-dark");
    setFontSize(14);
    setWordWrap(true);
    setMinimap(false);
    setLineNumbers(true);
  };

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0a0f1d] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_64px_rgba(0,0,0,0.34)]">
      <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-4 py-3 text-white/75">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                <FileCode2 className="h-3.5 w-3.5 text-primary" />
                {languageLabelMap[language]}
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
                {lineCount} lines
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
                {characterCount} chars
              </div>

              {readOnly ? (
                <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-emerald-300">
                  Read only
                </div>
              ) : (
                <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-primary">
                  Live editing
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowRail((prev) => !prev)}
                className="h-9 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-white hover:bg-white/10 hover:text-white"
                title={showRail ? "Hide controls" : "Show controls"}
              >
                {showRail ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleCopy}
                className="h-9 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-white hover:bg-white/10 hover:text-white"
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setExpanded((prev) => !prev)}
                className="h-9 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-white hover:bg-white/10 hover:text-white"
              >
                {expanded ? (
                  <>
                    <Minimize2 className="mr-2 h-4 w-4" />
                    Normal
                  </>
                ) : (
                  <>
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Expand
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {themeOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTheme(item.value)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  theme === item.value
                    ? "border-primary/40 bg-primary/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`grid min-h-[460px] ${
          showRail ? "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px]" : "grid-cols-1"
        }`}
        style={{ height: finalHeight }}
      >
        <div
          className={`min-w-0 overflow-hidden ${
            showRail ? "border-b border-white/10 lg:border-b-0 lg:border-r" : ""
          }`}
        >
          <MonacoEditor
            height="100%"
            language={editorLanguageMap[language]}
            value={value}
            theme={theme}
            onChange={(nextValue) => onChange?.(nextValue || "")}
            options={{
              readOnly,
              fontSize,
              minimap: { enabled: minimap },
              scrollBeyondLastLine: false,
              roundedSelection: true,
              padding: { top: 16 },
              fontLigatures: true,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: wordWrap ? "on" : "off",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              renderLineHighlight: "line",
              lineNumbers: lineNumbers ? "on" : "off",
              scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
        </div>

        {showRail ? (
          <div className="overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-3">
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                    Font Size
                  </p>
                  <span className="text-xs font-semibold text-white/80">
                    {fontSize}px
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {fontSizes.map((size) => {
                    const active = fontSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFontSize(size)}
                        className={`rounded-xl border px-0 py-2 text-xs font-semibold transition ${
                          active
                            ? "border-primary/40 bg-primary/15 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/65 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <RailToggle
                title="Wrap"
                description={wordWrap ? "Enabled" : "Disabled"}
                active={wordWrap}
                onClick={() => setWordWrap((prev) => !prev)}
                icon={<WrapText className="h-4 w-4" />}
              />

              <RailToggle
                title="Minimap"
                description={minimap ? "Visible" : "Hidden"}
                active={minimap}
                onClick={() => setMinimap((prev) => !prev)}
                icon={<ScanLine className="h-4 w-4" />}
              />

              <RailToggle
                title="Line nums"
                description={lineNumbers ? "Visible" : "Hidden"}
                active={lineNumbers}
                onClick={() => setLineNumbers((prev) => !prev)}
                icon={<ListOrdered className="h-4 w-4" />}
              />

              <button
                type="button"
                onClick={handleResetView}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-sm font-semibold">Reset view</span>
                </div>
                <p className="mt-1 text-xs text-white/50">Default editor setup</p>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}