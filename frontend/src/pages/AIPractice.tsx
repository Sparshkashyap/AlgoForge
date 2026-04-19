import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CodeEditor from "@/components/CodeEditor";
import SubmissionResult from "@/components/SubmissionResult";
import { reviewCodeApi } from "@/api/ai.api";
import FeatureGate from "@/components/FeatureGate";

export default function AIPractice() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState<"javascript" | "python" | "cpp" | "java" | "c">("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    try {
      setLoading(true);
      const data = await reviewCodeApi({
        title,
        description,
        code,
        language,
      });

      setResult({
        verdict: "AI Review",
        status: "Completed",
        stdout: data.data.summary,
        stderr: (data.data.issues || []).join("\n"),
        compileOutput: (data.data.improvements || []).join("\n"),
        language,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8 md:py-10 space-y-8"
      >
        {/* HEADER */}
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-black md:text-5xl">
            AI Practice Lab
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Write code, analyze logic, and get structured AI feedback. This is not
            just autocomplete. It’s guided improvement.
          </p>
        </div>

        {/* INPUT SECTION */}
        <div className="rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl space-y-5">
          <Input
            placeholder="Problem title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 rounded-xl"
          />

          <textarea
            placeholder="Describe the problem or your approach..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
          />

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="h-11 rounded-xl border border-border bg-background px-4"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="c">C</option>
            </select>

            <FeatureGate fallbackTitle="AI Practice is premium only">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="rounded-xl"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Analyzing..." : "Analyze Code"}
              </Button>
            </FeatureGate>
          </div>
        </div>

        {/* CODE EDITOR */}
        <div className="space-y-5">
          <CodeEditor language={language} value={code} onChange={setCode} />
        </div>

        {/* RESULT */}
        <div>
          <SubmissionResult result={result} title="AI Feedback" />
        </div>

        {/* INFO BLOCK */}
        <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary/80">
            <BrainCircuit className="h-3.5 w-3.5" />
            Practice mindset
          </div>

          <p className="mt-4 leading-7">
            Use this tool to improve thinking, not just correctness. Focus on why
            your solution works, not just whether it passes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}