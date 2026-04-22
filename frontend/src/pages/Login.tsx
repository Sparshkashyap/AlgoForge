import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Eye,
  EyeOff,
  Github,
  Loader2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { startGithubLogin, startGoogleLogin } from "@/api/auth.api";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.8-5.4 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2A9.8 9.8 0 0 0 2.2 12 9.8 9.8 0 0 0 12 21.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12Z"
      />
      <path
        fill="#34A853"
        d="M3.3 7.4 6.5 9.7C7.4 7.4 9.5 5.8 12 5.8c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2c-3.8 0-7.1 2.2-8.7 5.2Z"
      />
      <path
        fill="#FBBC05"
        d="M2.2 12c0 1.5.4 2.9 1.1 4.2l3.7-2.9c-.2-.5-.3-.9-.3-1.3s.1-.9.3-1.3L3.3 7.4A9.7 9.7 0 0 0 2.2 12Z"
      />
      <path
        fill="#4285F4"
        d="M12 21.8c2.7 0 5-.9 6.7-2.5l-3.3-2.6c-.9.6-2 .9-3.4.9-2.5 0-4.6-1.6-5.4-3.8l-3.7 2.9c1.6 3.1 4.9 5.1 9.1 5.1Z"
      />
    </svg>
  );
}

function FloatingOrb({
  className,
  delay,
}: {
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -16, 0], rotate: [0, 5, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

const loadRecaptcha = () =>
  new Promise<void>((resolve, reject) => {
    if (!RECAPTCHA_SITE_KEY) {
      resolve();
      return;
    }

    if (window.grecaptcha) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src^="https://www.google.com/recaptcha/api.js"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load reCAPTCHA")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.body.appendChild(script);
  });

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const from = useMemo(() => {
    const state = location.state as { from?: string | { pathname?: string } } | null;
    if (typeof state?.from === "string") return state.from;
    if (typeof state?.from?.pathname === "string") return state.from.pathname;
    return "/dashboard";
  }, [location.state]);

  useEffect(() => {
    void loadRecaptcha().catch(() => {
      // silent preload failure, handled at submit time if token is required
    });
  }, []);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const getRecaptchaToken = async () => {
    if (!RECAPTCHA_SITE_KEY) {
      return undefined;
    }

    await loadRecaptcha();

    return new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA not available"));
        return;
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha?.execute(RECAPTCHA_SITE_KEY, {
            action: "login",
          });

          if (!token) {
            reject(new Error("reCAPTCHA token not generated"));
            return;
          }

          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim() || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      const recaptchaToken = await getRecaptchaToken();

      const nextUser = await login({
        email: form.email.trim(),
        password: form.password,
        recaptchaToken,
      });

      toast.success("Welcome back");

      const role = String(nextUser?.role ?? "");
      if (role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "CREATOR") {
        navigate("/creator-dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <FloatingOrb
        delay={0}
        className="absolute left-10 top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
      />
      <FloatingOrb
        delay={0.8}
        className="absolute bottom-16 right-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl"
      />
      <FloatingOrb
        delay={1.4}
        className="absolute left-1/2 top-1/3 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl"
      />

      <div className="container relative z-10 flex min-h-screen items-center py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <motion.div className="max-w-2xl" {...fadeUp()}>
            <Link to="/" className="inline-flex">
              <BrandLogo />
            </Link>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              See the workflow before you enter
            </div>

            <h1 className="mt-8 font-heading text-4xl font-black leading-tight md:text-6xl">
              Focused practice should feel like a real product.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              AlgoForge is built for serious problem solving, contest pressure,
              progress tracking, and clean learning loops. Static practice is
              useless. Structured momentum is not.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Targeted practice</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Solve with intent instead of randomly clicking around.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Contest pressure</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Train under real constraints, not fake comfort.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/50 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Feedback loops</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  See weak areas fast and stop repeating dumb mistakes.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="ml-auto w-full max-w-md" {...fadeUp(0.08)}>
            <div className="spotlight-card relative overflow-hidden p-7 md:p-8">
              <div className="feature-glow absolute inset-0 opacity-80" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                      Account access
                    </p>
                    <h2 className="mt-3 font-heading text-3xl font-black">
                      Sign in
                    </h2>
                  </div>

                  <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      Secure login
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl border-border/70 bg-background/50 text-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
                    onClick={startGithubLogin}
                    disabled={submitting}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl border-border/70 bg-background/50 text-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
                    onClick={startGoogleLogin}
                    disabled={submitting}
                  >
                    <GoogleIcon />
                    <span className="ml-2">Google</span>
                  </Button>
                </div>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                    Or continue with email
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 h-12 rounded-2xl border-border/70 bg-background/50"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary transition hover:text-primary/80"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-12 rounded-2xl border-border/70 bg-background/50 pr-12"
                        value={form.password}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    className="group h-12 w-full rounded-2xl border-0 bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(100,90,255,0.20)] transition hover:bg-primary/90"
                    type="submit"
                    disabled={
                      submitting ||
                      !form.email.trim() ||
                      !form.password.trim()
                    }
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary transition hover:text-primary/80"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}