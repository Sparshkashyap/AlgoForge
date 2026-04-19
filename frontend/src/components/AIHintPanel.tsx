import { useState } from "react";
import { Bot, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAiHintApi } from "@/api/ai.api";
import FeatureGate from "@/components/FeatureGate";

export default function AIHintPanel({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) {
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const handleHint = async () => {
    try {
      setLoading(true);
      const data = await getAiHintApi({ title, description, code });
      setHint(data.data.hint);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureGate fallbackTitle="AI Hint is premium only">
      <div className="rounded-[1.7rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Bot className="h-3.5 w-3.5 text-primary" />
              Guided hint
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold">AI Hint</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Ask for a guided nudge that moves you forward without dumping the full solution.
            </p>
          </div>

          <Button
            onClick={handleHint}
            disabled={loading}
            className="rounded-xl shadow-[0_12px_30px_rgba(100,90,255,0.16)]"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Generating..." : "Get Hint"}
          </Button>
        </div>

        {hint ? (
          <div className="mt-5 rounded-[1.3rem] border border-border/70 bg-background/50 p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold">Hint</p>
            </div>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {hint}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[1.3rem] border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
            Use AI hints when you want direction but still want to solve the core idea yourself.
          </div>
        )}
      </div>
    </FeatureGate>
  );
}