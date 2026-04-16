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
      className={`rounded-3xl border p-6 ${
        highlighted
          ? "border-primary/30 bg-card shadow-[0_0_0_1px_rgba(99,102,241,0.18)]"
          : "border-border bg-card"
      }`}
    >
      <h3 className="font-heading text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-6 text-3xl font-bold">{price}</div>
      <Button onClick={onChoose} className="mt-6 rounded-xl w-full">
        Choose {title}
      </Button>
    </div>
  );
}