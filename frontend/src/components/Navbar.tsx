import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  LogIn,
  Menu,
  PlusSquare,
  Sparkles,
  UserPlus,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import { UserNav } from "@/components/UserNav";
import BrandLogo from "@/components/BrandLogo";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Problems", href: "/problems" },
];

export function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

const privateLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Problems", href: "/problems", icon: Sparkles },
  ...(user?.role === "CREATOR" || user?.role === "ADMIN"
    ? [{ label: "Create Problem", href: "/create-problem", icon: PlusSquare }]
    : []),
  ...(user?.role === "ADMIN"
    ? [
        { label: "Manage Problems", href: "/manage-problems", icon: ListChecks },
        { label: "Manage Users", href: "/manage-users", icon: ListChecks },
      ]
    : []),
];
  const links = isAuthenticated ? privateLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <BrandLogo />

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />

          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="rounded-full">
                  {user.name.split(" ")[0]}
                </Button>
              </Link>
              <UserNav />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="rounded-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-full border-0 bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(99,102,241,0.22)]">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px] p-0">
              <div className="border-b border-border px-6 py-5">
                <BrandLogo />
              </div>

              <div className="px-4 py-4">
                <div className="flex flex-col gap-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                        location.pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  {isAuthenticated && user ? (
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>

                      <div className="mt-4 flex flex-col gap-2">
                        <Link to="/dashboard">
                          <Button className="w-full rounded-xl">
                            Go to Dashboard
                          </Button>
                        </Link>

                        {user.role === "ADMIN" ? (
                          <>
                            <Link to="/create-problem">
                              <Button variant="outline" className="w-full rounded-xl">
                                Create Problem
                              </Button>
                            </Link>

                            <Link to="/manage-problems">
                              <Button variant="outline" className="w-full rounded-xl">
                                Manage Problems
                              </Button>
                            </Link>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login">
                        <Button variant="outline" className="w-full rounded-xl">
                          Log in
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="w-full rounded-xl border-0 bg-primary text-primary-foreground">
                          Create account
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}