import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "react-toastify";

import { BrandLogo } from "@/components/BrandLogo";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "@/components/UserNav";
import NotificationBell from "@/components/NotificationBell";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ CLEAN NAV STRUCTURE
  const navItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Roadmap", to: "/roadmap" },
        { label: "Pricing", to: "/pricing" }, // ✅ FIXED
      ];
    }

    if (user?.role === "ADMIN") {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Admin", to: "/admin-dashboard" },
      ];
    }

    if (user?.role === "CREATOR") {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Creator", to: "/creator-dashboard" },
      ];
    }

    // ✅ USER
    return [
      { label: "Problems", to: "/problems" },
      { label: "Contests", to: "/contests" },
      { label: "Roadmap", to: "/roadmap" },
      { label: "Pricing", to: "/pricing" }, // ✅ USER ONLY
    ];
  }, [isAuthenticated, user?.role]);

 const dashboardHref = "/dashboard";

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
          ? "bg-background/90 backdrop-blur-xl border-b shadow-sm"
          : "bg-background/60 backdrop-blur",
      ].join(" ")}
    >
      <div className="container flex h-[70px] items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="shrink-0">
          <BrandLogo />
        </Link>

        {/* NAV LINKS */}
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                {item.label}

                {/* 🔥 UNDERLINE ANIMATION */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full ${
                    active ? "w-full" : ""
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />

          {isAuthenticated ? (
            <>
              <NotificationBell />

    <Link
  to={dashboardHref}
  className="group relative inline-flex items-center justify-center rounded-full p-[1px]"
>
  {/* 🔥 OUTER ANIMATED BORDER */}
  <span className="absolute inset-0 rounded-full opacity-0 transition duration-300 group-hover:opacity-100">
    <span className="absolute inset-0 animate-borderMove rounded-full bg-[linear-gradient(120deg,#6366f1,#ec4899,#22d3ee,#6366f1)] bg-[length:300%_300%]" />
  </span>

  {/* INNER CONTENT */}
  <span className="relative z-10 flex items-center rounded-full bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition group-hover:text-foreground">
    <LayoutDashboard className="mr-2 h-4 w-4" />
    Dashboard
  </span>
</Link>

              <UserNav />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>

              <Link to="/signup">
                <Button>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="text-base"
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link to={dashboardHref}>Dashboard</Link>
                    <Button onClick={handleLogout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
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