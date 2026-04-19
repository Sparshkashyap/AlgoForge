import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-16 md:py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Route not found
          </div>

          <h1 className="mt-8 font-heading text-[4.5rem] font-black leading-none md:text-[6rem] lg:text-[7rem]">
            404
          </h1>

          <h2 className="mt-4 font-heading text-2xl font-bold md:text-4xl">
            This page doesn’t exist.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Either the route is wrong or the page is gone. Don’t overthink it.
            Just move somewhere useful.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/">
              <Button className="rounded-full px-6">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>

            <Link to="/problems">
              <Button variant="outline" className="rounded-full px-6">
                <Search className="mr-2 h-4 w-4" />
                Problems
              </Button>
            </Link>

            {user && (
              <Link to="/dashboard">
                <Button variant="outline" className="rounded-full px-6">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-14 rounded-[2rem] border border-border/70 bg-card/60 p-6 backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Next steps
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                Fix the URL
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                Use navigation
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                Keep practicing
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}