import { Sparkles, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CurrentPlanCard({
  plan = "FREE",
  status = "inactive",
  expiresAt,
  onUpgrade,
}: {
  plan?: string;
  status?: string | null;
  expiresAt?: string | null;
  onUpgrade?: () => void;
}) {
  const isPro = plan === "PRO";

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/10 to-pink-500/10" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
            {isPro ? (
              <Crown className="h-5 w-5 text-yellow-400" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Current Plan
            </p>
            <p className="text-sm text-muted-foreground">
              Your subscription status
            </p>
          </div>
        </div>

        <h3 className="mt-5 font-heading text-3xl font-black tracking-tight">
          {plan}
        </h3>

        <div
          className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
            status === "active"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/20 bg-amber-500/10 text-amber-400"
          }`}
        >
          {status || "inactive"}
        </div>

        {expiresAt && (
          <p className="mt-4 text-sm text-muted-foreground">
            Renews / Ends on{" "}
            <span className="font-medium text-foreground">
              {new Date(expiresAt).toLocaleDateString()}
            </span>
          </p>
        )}

        <div className="mt-6">
          {!isPro ? (
            <Button
              type="button"
              onClick={onUpgrade}
              className="h-11 rounded-xl px-5 text-sm font-semibold"
            >
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              You are on the highest plan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}