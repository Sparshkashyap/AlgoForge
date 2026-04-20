import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Menu,
  Settings,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import NotificationBell from "@/components/NotificationBell";
import { toast } from "react-toastify";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Problems", to: "/problems" },
  { label: "Pricing", to: "/upgrade" },
  { label: "Contests", to: "/contests" },
];

function NavLinkText({ label }: { label: string }) {
  return (
    <span className="relative block h-6 overflow-hidden">
      <span className="nav-text-slide block">
        <span className="block h-6">{label}</span>
        <span className="block h-6 text-foreground">{label}</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actionLink = isAuthenticated ? "/dashboard" : "/signup";
  const actionLabel = isAuthenticated ? "Open App" : "Start Forging";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setOpen(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border/70 bg-background/84 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
          : "border-b border-transparent bg-background/52 backdrop-blur-xl",
      ].join(" ")}
    >
      <div className="container flex h-[84px] items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/65 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.08)] md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative rounded-full px-5 py-2.5 text-[1rem] font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/12"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  />
                )}

                <span
                  className={`relative z-10 ${active ? "text-foreground" : ""}`}
                >
                  <NavLinkText label={item.label} />
                </span>

                <span
                  className={`nav-underline-flow absolute bottom-[6px] left-1/2 h-[2px] -translate-x-1/2 rounded-full ${
                    active ? "w-[56%] opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <UserNav />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="navbar-ghost-btn rounded-full px-5 text-[0.98rem] font-semibold"
                >
                  <span className="relative z-10">Sign In</span>
                </Button>
              </Link>

              <Link to={actionLink}>
                <Button className="navbar-cta-btn group rounded-full px-5 text-[0.98rem] font-semibold shadow-[0_14px_44px_rgba(100,90,255,0.22)]">
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {actionLabel}
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          {isAuthenticated ? <NotificationBell /> : null}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border/70 bg-card/80"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[86vw] border-l border-border/70 bg-background/96 backdrop-blur-2xl"
            >
              <div className="mt-8 flex flex-col gap-3">
                <div className="mb-2">
                  <BrandLogo />
                </div>

                {isAuthenticated && user ? (
                  <div className="mb-2 rounded-2xl border border-border/70 bg-card/60 p-4">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="mt-1 break-all text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                ) : null}

                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      location.pathname === item.to
                        ? "border-primary/30 bg-primary/10 text-foreground"
                        : "border-border/70 bg-card/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      View Profile
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

                    <div className="mt-2">
                      <UserNav />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLogout}
                      className="justify-start rounded-2xl border-border/70 bg-card/60 px-4 py-3 text-sm font-medium text-destructive"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button
                        variant="outline"
                        className="mt-2 w-full rounded-2xl"
                      >
                        Sign In
                      </Button>
                    </Link>

                    <Link to={actionLink} onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-2xl">
                        {actionLabel}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}