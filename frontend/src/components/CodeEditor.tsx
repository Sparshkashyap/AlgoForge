import { useMemo, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  Check,
  Copy,
  Expand,
  FileCode2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  language: "javascript" | "python" | "cpp" | "java" | "c";
  value: string;
  onChange: (value: string) => void;
  height?: string;
};

const editorLanguageMap: Record<Props["language"], string> = {
  javascript: "javascript",
  python: "python",
  cpp: "cpp",
  java: "java",
  c: "c",
};

const languageLabelMap: Record<Props["language"], string> = {
  javascript: "JavaScript",
  python: "Python",
  cpp: "C++",
  java: "Java",
  c: "C",
};

export default function CodeEditor({
  language,
  value,
  onChange,
  height = "520px",
}: Props) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const finalHeight = useMemo(() => {
    return expanded ? "78vh" : height;
  }, [expanded, height]);

  const lineCount = useMemo(() => {
    if (!value) return 1;
    return value.split("\n").length;
  }, [value]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0b1020] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_50px_rgba(0,0,0,0.25)]">
      <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-3 text-white/75">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              <FileCode2 className="h-3.5 w-3.5 text-primary" />
              {languageLabelMap[language]}
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
              AlgoForge Editor
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55">
              {lineCount} lines
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
      </div>

      <div
        className="min-h-[420px] overflow-hidden resize-y lg:resize"
        style={{ height: finalHeight, minWidth: "100%" }}
      >
        <MonacoEditor
          height="100%"
          language={editorLanguageMap[language]}
          value={value}
          theme="vs-dark"
          onChange={(nextValue) => onChange(nextValue || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            roundedSelection: true,
            padding: { top: 16 },
            fontLigatures: true,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderLineHighlight: "line",
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />
      </div>
    </div>
  );
}