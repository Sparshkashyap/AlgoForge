import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Problems", to: "/problems" },
  { label: "Login", to: "/login" },
  { label: "Signup", to: "/signup" },
];

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-2xl">
      <div className="container flex h-18 items-center justify-between gap-4 py-3">
        <Link to="/" className="shrink-0">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/55 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:flex">
          {navItems
            .filter((item) => (isAuthenticated ? item.label !== "Login" && item.label !== "Signup" : true))
            .map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/12"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button className="rounded-full px-5">Dashboard</Button>
            </Link>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login">
                <Button variant="ghost" className="rounded-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full px-5">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}