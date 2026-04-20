import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

type LoginFormState = {
  email: string;
  password: string;
};

type AuthUser = {
  role?: string;
} | null;

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
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://www.google.com/recaptcha/api.js"]'
    );

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

function getRedirectPath(role: string, fallback: string) {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "CREATOR") return "/creator-dashboard";
  return fallback;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return err.response?.data?.message || err.message || "Login failed";
  }

  return "Login failed";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from || "/dashboard";

  useEffect(() => {
    void loadRecaptcha().catch(() => {});
  }, []);

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const getRecaptchaToken = async (): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY) {
      throw new Error("Missing VITE_RECAPTCHA_SITE_KEY");
    }

    await loadRecaptcha();

    return new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA is not available"));
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

    if (submitting) return;

    try {
      setSubmitting(true);

      const recaptchaToken = await getRecaptchaToken();

      const nextUser = (await login({
        email: form.email.trim(),
        password: form.password,
        recaptchaToken,
      })) as AuthUser;

      toast.success("Welcome back");

      const role = String(nextUser?.role ?? "");
      navigate(getRedirectPath(role, from), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
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

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              This side should sell the experience with a believable preview of
              the workspace users are signing into.
            </p>

            <div className="spotlight-card mt-8 overflow-hidden p-5 md:p-6">
              <div className="feature-glow absolute inset-0 opacity-80" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary/80">
                      Practice snapshot
                    </p>
                    <h2 className="mt-2 font-heading text-2xl font-black md:text-3xl">
                      Cleaner workflow. Better signals.
                    </h2>
                  </div>

                  <div className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    Live preview
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[1.5rem] border border-border/70 bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Today
                    </p>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Daily streak
                          </span>
                          <Target className="h-4 w-4 text-primary" />
                        </div>
                        <p className="mt-3 font-heading text-3xl font-black">
                          12
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          days active
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Contest rank
                          </span>
                          <Trophy className="h-4 w-4 text-accent" />
                        </div>
                        <p className="mt-3 font-heading text-3xl font-black">
                          #214
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          this week
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/70 bg-background/50 p-4">
                    <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          AI Hint Preview
                        </span>
                        <BrainCircuit className="h-4 w-4 text-primary" />
                      </div>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        “Try tracking frequency while scanning once, instead of
                        sorting first.”
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-border/70 bg-card/70 p-4">
                      <p className="text-sm font-semibold">Recent progress</p>
                      <div className="mt-4 grid grid-cols-7 gap-2">
                        {[60, 36, 74, 52, 86, 46, 68].map((value, index) => (
                          <div
                            key={index}
                            className="flex h-24 items-end rounded-full bg-background/60 p-1"
                          >
                            <div
                              className="w-full rounded-full bg-gradient-to-t from-primary via-fuchsia-400 to-accent"
                              style={{ height: `${value}%` }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                          Solved this week
                        </p>
                        <p className="mt-2 text-xl font-bold">18 problems</p>
                      </div>

                      <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                          Interview focus
                        </p>
                        <p className="mt-2 text-xl font-bold">
                          Arrays + Graphs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {[
                    "Focused practice",
                    "Real progress visibility",
                    "Interview-first workflow",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/70 bg-background/55 px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="ml-auto w-full max-w-md" {...fadeUp(0.08)}>
            <div className="spotlight-card overflow-hidden p-7 md:p-8">
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
                    Secure login
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl border-border/70 bg-background/50 text-foreground transition hover:border-white/15 hover:bg-zinc-950 hover:text-white dark:hover:bg-zinc-900"
                    onClick={startGithubLogin}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl border-border/70 bg-background/50 text-foreground transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
                    onClick={startGoogleLogin}
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
                      placeholder="Enter your email address"
                      className="mt-2 h-12 rounded-2xl border-border/70 bg-background/50"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
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
                    className="group h-12 w-full rounded-2xl border-0 bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(100,90,255,0.24)]"
                    type="submit"
                    disabled={submitting}
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

                <div className="mt-6 rounded-2xl border border-border/70 bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-muted-foreground">
                      One login flow is enough. Role-based redirect should happen
                      after authentication, not through separate login pages.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border/70 bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-muted-foreground">
                      This login is protected with reCAPTCHA to reduce abuse and
                      bot-based sign-in attempts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}