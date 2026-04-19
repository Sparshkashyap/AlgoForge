import { useState } from "react";
import { Bot, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewCodeApi } from "@/api/ai.api";
import FeatureGate from "@/components/FeatureGate";

export default function AICodeReview({
  title,
  description,
  code,
  language,
}: {
  title: string;
  description: string;
  code: string;
  language: string;
}) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    try {
      setLoading(true);
      const data = await reviewCodeApi({
        title,
        description,
        code,
        language,
      });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeatureGate fallbackTitle="AI Code Review is premium only">
      <div className="rounded-[1.7rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Bot className="h-3.5 w-3.5 text-primary" />
              Premium review
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold">AI Code Review</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Get a structured review of your code quality, likely issues, and improvement ideas.
            </p>
          </div>

          <Button
            onClick={handleReview}
            disabled={loading}
            className="rounded-xl shadow-[0_12px_30px_rgba(100,90,255,0.16)]"
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            {loading ? "Reviewing..." : "Review Code"}
          </Button>
        </div>

        {result ? (
          <div className="mt-5 space-y-4 text-sm">
            <div className="rounded-[1.3rem] border border-border/70 bg-background/50 p-4">
              <p className="font-semibold">Summary</p>
              <p className="mt-3 leading-7 text-muted-foreground">
                {result.summary}
              </p>
            </div>

            <div className="rounded-[1.3rem] border border-border/70 bg-background/50 p-4">
              <p className="font-semibold">Issues</p>
              {(result.issues || []).length ? (
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {(result.issues || []).map((item: string, index: number) => (
                    <li key={index} className="flex gap-2 leading-7">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-rose-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-muted-foreground">No major issues found.</p>
              )}
            </div>

            <div className="rounded-[1.3rem] border border-border/70 bg-background/50 p-4">
              <p className="font-semibold">Improvements</p>
              {(result.improvements || []).length ? (
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {(result.improvements || []).map((item: string, index: number) => (
                    <li key={index} className="flex gap-2 leading-7">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-muted-foreground">
                  No suggested improvements returned.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-[1.3rem] border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
            Get AI review for structure, logic quality, and improvement ideas.
          </div>
        )}
      </div>
    </FeatureGate>
  );
}