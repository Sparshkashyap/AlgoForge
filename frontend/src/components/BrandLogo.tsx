import { Hexagon, Sparkles } from "lucide-react";

export function BrandLogo() {
  return (
    <div className="group flex items-center gap-3.5">
      <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.1rem] border border-white/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.28),hsl(var(--accent)/0.16))] shadow-[0_12px_34px_rgba(100,90,255,0.22)] transition-transform duration-300 group-hover:scale-[1.04]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_56%)]" />
        <Hexagon className="relative z-10 h-5.5 w-5.5 text-primary" strokeWidth={2.2} />
        <Sparkles
          className="absolute right-1.5 top-1.5 h-3 w-3 text-accent"
          strokeWidth={2.4}
        />
      </div>

      <div className="leading-none">
        <div className="font-heading text-[1.55rem] font-extrabold tracking-[-0.045em] text-foreground transition-transform duration-300 group-hover:translate-x-[1px]">
          AlgoForge
        </div>
        <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          serious prep
        </div>
      </div>
    </div>
  );
}