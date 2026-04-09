import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Problems", href: "/problems" },
  { label: "Contests", href: "/contests" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Code2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight">AlgoForge</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="gradient-primary text-primary-foreground border-0">
              Get Started
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">Log in</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button size="sm" className="w-full gradient-primary text-primary-foreground border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
