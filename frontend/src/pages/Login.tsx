import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const FloatingOrb = ({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) => (
  <motion.div
    className={className}
    animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from || "/dashboard";

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await login(form);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <FloatingOrb
        delay={0}
        className="absolute top-20 left-16 h-28 w-28 rounded-full bg-primary/10 blur-2xl"
      />
      <FloatingOrb
        delay={1.2}
        className="absolute bottom-24 right-20 h-36 w-36 rounded-full bg-accent/10 blur-2xl"
      />
      <FloatingOrb
        delay={0.6}
        className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-warning/10 blur-xl"
      />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold">AlgoForge</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Cookie-based secure authentication
          </div>

          <h1 className="font-heading text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in and continue from where you left off
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-8 shadow-xl">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-2 h-12 rounded-xl"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-2 h-12 rounded-xl"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>

            <Button
              className="w-full h-12 rounded-xl gradient-primary text-primary-foreground border-0"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 mt-0.5 text-primary" />
              <span>
                Google and GitHub login can be added next, after problem create, preview run,
                and Judge0 submission flow is stable.
              </span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}