import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Trophy,
  Crown,Eye,Settings,
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

  const isFreeUser = user?.role === "USER" && user?.plan === "FREE";
const isPaidUser =
  user?.role === "USER" &&
  (user?.plan === "STANDARD" || user?.plan === "PRO");

  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = useMemo(() => {
    if (!isAuthenticated) {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Roadmap", to: "/roadmap" },
        { label: "Pricing", to: "/pricing" },
      ];
    }

    if (user?.role === "ADMIN") {
      return [
        { label: "Problems", to: "/problems" },
        { label: "Contests", to: "/contests" },
        { label: "Manage Contests", to: "/manage-contests" },
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

    return [
      { label: "Problems", to: "/problems" },
      { label: "Contests", to: "/contests" },
      { label: "Roadmap", to: "/roadmap" },
      { label: "Pricing", to: "/pricing" },
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
          ? "bg-background/90 backdrop-blur-xl border-b shadow-sm"
          : "bg-background/60 backdrop-blur",
      ].join(" ")}
    >
      <div className="container flex h-[70px] items-center justify-between">
        <Link to="/" className="shrink-0">
          <BrandLogo />
        </Link>

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

                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-primary transition-all duration-300 group-hover:w-full ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        

        <div className="hidden md:flex items-center gap-3">



  {isAuthenticated && user?.role === "USER" && (
  isFreeUser ? (
    <Link to="/pricing">
      <Button className="rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90">
        Upgrade
        <Crown className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  ) : (
    <Button
      disabled
      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 text-emerald-600 cursor-default"
    >
      Enrolled
      <Crown className="ml-2 h-4 w-4 text-emerald-600" />
    </Button>
  )
)}



          <ModeToggle />

          {isAuthenticated ? (
            <>
              <NotificationBell />

              {user?.role === "ADMIN" && (
                <Link to="/create-contest">
               <Button className="group relative rounded-full p-[1px]">
  {/* animated gradient border */}
  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 opacity-80 transition-all duration-500 group-hover:opacity-100" />

  {/* inner */}
  <span className="relative z-10 flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 group-hover:bg-white/90 group-hover:shadow-md">
    <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90 group-hover:text-pink-500" />
    Create Contest
  </span>
</Button>
                </Link>
              )}

              <Link
                to={dashboardHref}
                className="group relative inline-flex items-center justify-center rounded-full p-[1px]"
              >
                <span className="absolute inset-0 rounded-full opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="absolute inset-0 animate-borderMove rounded-full bg-[linear-gradient(120deg,#6366f1,#ec4899,#22d3ee,#6366f1)] bg-[length:300%_300%]" />
                </span>

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

        <div className="flex items-center gap-2 md:hidden">

{isAuthenticated && user?.role === "USER" && (
  isFreeUser ? (
    <Link to="/pricing" onClick={() => setOpen(false)}>
      <Button size="sm" className="rounded-full">
        <Crown className="h-4 w-4" />
      </Button>
    </Link>
  ) : (
    <Button
      size="sm"
      disabled
      className="rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
    >
      <Crown className="h-4 w-4" />
    </Button>
  )
)}

  

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
                    {user?.role === "ADMIN" && (
                      <>
                        <Link
                          to="/create-contest"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Create Contest
                        </Link>

                        <Link
                          to="/manage-contests"
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-2"
                        >
                          <Trophy className="h-4 w-4" />
                          Manage Contests
                        </Link>
                      </>
                    )}

                    <Link to={dashboardHref} onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>

                    <Button onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Signup
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