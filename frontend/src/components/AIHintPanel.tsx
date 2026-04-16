import { useState } from "react";
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
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-heading text-lg font-semibold">AI Hint</h3>
          <Button onClick={handleHint} disabled={loading} className="rounded-xl">
            {loading ? "Generating..." : "Get Hint"}
          </Button>
        </div>

        {hint ? (
          <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-border bg-background p-4 text-sm">
            {hint}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Ask for a guided hint without revealing the full solution.
          </p>
        )}
      </div>
    </FeatureGate>
  );
}