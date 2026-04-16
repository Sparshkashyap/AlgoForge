import { useState } from "react";
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
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold">AI Code Review</h3>
          <Button onClick={handleReview} disabled={loading} className="rounded-xl">
            {loading ? "Reviewing..." : "Review Code"}
          </Button>
        </div>

        {result ? (
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="font-medium">Summary</p>
              <p className="mt-2 text-muted-foreground">{result.summary}</p>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="font-medium">Issues</p>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {(result.issues || []).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="font-medium">Improvements</p>
              <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                {(result.improvements || []).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Get AI review for structure, logic quality, and improvement ideas.
          </p>
        )}
      </div>
    </FeatureGate>
  );
}