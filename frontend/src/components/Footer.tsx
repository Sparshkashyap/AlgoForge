import { Link } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/80">
      <div className="container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Crafted for serious prep. Premium UI now, deep platform systems next.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="transition hover:text-foreground">
            Home
          </Link>
          <Link to="/problems" className="transition hover:text-foreground">
            Problems
          </Link>
          <Link to="/login" className="transition hover:text-foreground">
            Login
          </Link>
          <Link to="/signup" className="transition hover:text-foreground">
            Signup
          </Link>
        </div>
      </div>
    </footer>
  );
}