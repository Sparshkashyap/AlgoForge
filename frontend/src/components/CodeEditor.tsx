import { useMemo, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Copy, Check, Expand, Shrink } from "lucide-react";
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-white/70">
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-[0.2em]">{language}</span>
          <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-white/60">
            AlgoForge Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 rounded-lg px-3 text-white hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setExpanded((prev) => !prev)}
            className="h-8 rounded-lg px-3 text-white hover:bg-white/10 hover:text-white"
          >
            {expanded ? (
              <>
                <Shrink className="mr-2 h-4 w-4" />
                Normal
              </>
            ) : (
              <>
                <Expand className="mr-2 h-4 w-4" />
                Expand
              </>
            )}
          </Button>
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
          }}
        />
      </div>
    </div>
  );
}