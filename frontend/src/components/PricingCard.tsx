import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingCard({
  title,
  price,
  description,
  highlighted = false,
  onChoose,
}: {
  title: string;
  price: string;
  description: string;
  highlighted?: boolean;
  onChoose?: () => void;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border p-6 transition-all duration-300 ${
        highlighted
          ? "border-primary/40 bg-card shadow-[0_20px_60px_rgba(99,102,241,0.18)] scale-[1.03]"
          : "border-border bg-card/80 hover:border-primary/20 hover:-translate-y-1"
      }`}
    >
      {highlighted && (
        <div className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-primary">
          Popular
        </div>
      )}

      <h3 className="font-heading text-xl font-bold">{title}</h3>

      <p className="mt-2 text-sm text-muted-foreground leading-6">
        {description}
      </p>

      <div className="mt-6 text-4xl font-black tracking-tight">
        {price}
      </div>

      {/* fake features for perception */}
      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        {[
          "Full problem access",
          "AI hints + review",
          "Contest participation",
        ].map((f) => (
          <div key={f} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            {f}
          </div>
        ))}
      </div>

      <Button
        onClick={onChoose}
        className="mt-6 w-full rounded-xl h-11 text-sm font-semibold"
        variant={highlighted ? "default" : "outline"}
      >
        Choose {title}
      </Button>
    </div>
  );
}