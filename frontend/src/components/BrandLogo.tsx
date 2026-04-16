import { Hexagon, Sparkles } from "lucide-react";

export function BrandLogo() {
  return (
    <div className="group flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.28),hsl(var(--accent)/0.16))] shadow-[0_10px_30px_rgba(100,90,255,0.22)]">
        <Hexagon className="h-5 w-5 text-primary" strokeWidth={2.2} />
        <Sparkles className="absolute right-1.5 top-1.5 h-3 w-3 text-accent" strokeWidth={2.4} />
      </div>

      <div className="leading-none">
        <div className="font-heading text-xl font-black tracking-[-0.04em] text-foreground">
          AlgoForge
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
          serious prep
        </div>
      </div>
    </div>
  );
}