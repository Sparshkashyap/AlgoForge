import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-primary shadow-[0_10px_30px_rgba(99,102,241,0.25)]">
        <Code2 className="h-5 w-5 text-primary-foreground" />
      </div>

      <div className="leading-none">
        <div className="font-heading text-xl font-bold tracking-tight">
          AlgoForge
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          Build stronger problem-solving skills
        </div>
      </div>
    </Link>
  );
}