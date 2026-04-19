import { Hexagon, Sparkles } from "lucide-react";

export function BrandLogo() {
  return (
    <div className="group flex items-center gap-3.5 select-none py-1">
      
      {/* ICON */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] border border-white/10 bg-gradient-to-br from-primary/30 via-primary/20 to-pink-500/20 shadow-[0_12px_34px_rgba(100,90,255,0.25)] transition-all duration-300 group-hover:scale-[1.06] group-hover:rotate-[2deg]">
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)]" />

        <Hexagon
          className="relative z-10 h-5.5 w-5.5 text-primary transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2.2}
        />

        <Sparkles
          className="absolute right-1.5 top-1.5 h-3 w-3 text-pink-400 transition-all duration-300 group-hover:scale-110"
          strokeWidth={2.4}
        />
      </div>

      {/* TEXT */}
      <div className="leading-[1.1]">
        <div className="font-heading text-[1.7rem] font-extrabold tracking-[-0.05em] bg-gradient-to-r from-primary via-indigo-400 to-pink-500 bg-clip-text text-transparent">
          AlgoForge
        </div>

        <div className="mt-[2px] text-[11px] font-semibold uppercase tracking-[0.34em] text-muted-foreground">
          serious prep
        </div>
      </div>
    </div>
  );
}