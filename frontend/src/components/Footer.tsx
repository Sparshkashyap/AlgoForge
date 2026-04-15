import { Link } from "react-router-dom";
import { Code2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold">AlgoForge</p>
            <p className="text-sm text-muted-foreground">
              Build stronger problem-solving skills.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/problems" className="hover:text-foreground transition-colors">
            Problems
          </Link>
          <Link to="/login" className="hover:text-foreground transition-colors">
            Login
          </Link>
          <Link to="/signup" className="hover:text-foreground transition-colors">
            Signup
          </Link>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Crafted with <Heart className="h-4 w-4 text-red-500" /> for serious prep
        </div>
      </div>
    </footer>
  );
}