import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  Settings,
  Sparkles,
  UserCircle2,
  Bot,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { BrandLogo } from "@/components/BrandLogo";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import NotificationBell from "@/components/NotificationBell";

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
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: "Home", to: "/" },
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Roadmap", to: "/roadmap" },
        { label: "Pricing", to: "/upgrade" },
      ];
    }

    if (user?.role === "ADMIN") {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Admin", to: "/admin-dashboard" },
        { label: "AI Chat", to: "/ai-chat" },
      ];
    }

    if (user?.role === "CREATOR") {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Creator", to: "/creator-dashboard" },
        { label: "AI Chat", to: "/ai-chat" },
      ];
    }

    return [
      { label: "Problems", to: "/problems" },
      { label: "Contests", to: "/contests" },
      { label: "Roadmap", to: "/roadmap" },
      { label: "Analytics", to: "/submission-analytics" },
    ];
  }, [isAuthenticated, user?.role]);

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin-dashboard"
      : user?.role === "CREATOR"
      ? "/creator-dashboard"
      : "/dashboard";

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/65 p-2 shadow md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary/12"
                  />
                )}

                <span className={`relative z-10 ${active ? "text-foreground" : ""}`}>
                  <NavLinkText label={item.label} />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />

          {isAuthenticated ? (
            <>
              <NotificationBell />

              <Link to="/ai-chat">
                <Button variant="outline" className="rounded-full">
                  <Bot className="mr-2 h-4 w-4" />
                  AI
                </Button>
              </Link>

              <Link to={dashboardHref}>
                <Button variant="outline" className="rounded-full">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <UserNav />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="rounded-full">
                  Sign In
                </Button>
              </Link>

              <Link to="/signup">
                <Button className="rounded-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Forging
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          {isAuthenticated && <NotificationBell />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[86vw]">
              <div className="mt-6 flex flex-col gap-3">
                <BrandLogo />

                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm"
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAuthenticated ? (
                  <>
                    <NavLink to="/ai-chat" onClick={() => setOpen(false)}>
                      AI Chat
                    </NavLink>

                    <NavLink to={dashboardHref} onClick={() => setOpen(false)}>
                      Dashboard
                    </NavLink>

                    <NavLink to="/profile" onClick={() => setOpen(false)}>
                      Profile
                    </NavLink>

                    <Button onClick={handleLogout} variant="outline">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline">Login</Button>
                    </Link>

                    <Link to="/signup" onClick={() => setOpen(false)}>
                      <Button>Sign Up</Button>
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