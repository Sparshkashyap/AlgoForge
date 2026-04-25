import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { forgotPasswordApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const captchaRef = useRef<ReCAPTCHA | null>(null);

  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !recaptchaToken || sending) return;

    try {
      setSending(true);

      const data = await forgotPasswordApi({
        email: email.trim(),
        recaptchaToken,
      });

      toast.success(data.message || "OTP sent");
      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (err: any) {
      captchaRef.current?.reset();
      setRecaptchaToken("");

      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-12 md:py-16"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Account Recovery
            </div>

            <h1 className="mt-6 max-w-xl font-heading text-4xl font-black leading-tight md:text-6xl">
              Reset access without friction.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              Enter your email, complete the verification, and we’ll send you an
              OTP to reset your password securely.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
                <Mail className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">Email OTP</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Receive a short-lived one-time code on your registered email.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">Secure Flow</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  reCAPTCHA protects the reset flow from automated abuse.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_38%)]" />

              <div className="relative z-10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>

                <h2 className="mt-5 font-heading text-3xl font-black">
                  Forgot Password
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  We’ll send an OTP if this email exists in our system.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 rounded-2xl border-border/70 bg-background/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />

                  {RECAPTCHA_SITE_KEY ? (
                    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/50 p-3">
                      <ReCAPTCHA
                        ref={captchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={(token) => setRecaptchaToken(token || "")}
                        onExpired={() => setRecaptchaToken("")}
                      />
                    </div>
                  ) : null}

                  <Button
                    disabled={
                      sending ||
                      !email.trim() ||
                      (Boolean(RECAPTCHA_SITE_KEY) && !recaptchaToken)
                    }
                    className="h-12 w-full rounded-2xl"
                  >
                    {sending ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}