import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const productLinks = [
  { label: "Problems", to: "/problems" },
  { label: "Contests", to: "/contests" },
  { label: "Pricing", to: "/pricing" },
  { label: "Dashboard", to: "/dashboard" },
];

const accountLinks = [
  { label: "Login", to: "/login" },
  { label: "Signup", to: "/signup" },
  { label: "Profile", to: "/profile" },
  { label: "Bookmarks", to: "/bookmarks" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background/82">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <BrandLogo />
            <p className="mt-5 text-sm leading-8 text-muted-foreground md:text-base">
              AlgoForge should feel like a serious product from the first scroll.
              Sharper prep workflows, cleaner practice surfaces, stronger visual
              direction, and less generic noise.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {["AI hints", "Contests", "Interview prep", "Focused practice"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border/70 bg-card/62 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[1.6rem] border border-border/70 bg-card/62 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-foreground">Product</p>
              <div className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-background/50 hover:text-foreground"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-border/70 bg-card/62 p-5 backdrop-blur-xl">
              <p className="text-sm font-semibold text-foreground">Account</p>
              <div className="mt-4 space-y-3">
                {accountLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-background/50 hover:text-foreground"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 AlgoForge. Built for people who actually want to get better.</p>
          <div className="flex items-center gap-5">
            <Link to="/" className="transition hover:text-foreground">
              Home
            </Link>
            <Link to="/pricing" className="transition hover:text-foreground">
              Pricing
            </Link>
            <Link to="/problems" className="transition hover:text-foreground">
              Problems
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}