import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ArrowLeft,
  Clock3,
  KeyRound,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import {
  forgotPasswordApi,
  resetPasswordApi,
  verifyResetOtpApi,
} from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const OTP_EXPIRY_SECONDS = 10 * 60;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const captchaRef = useRef<ReCAPTCHA | null>(null);

  const initialEmail = useMemo(() => {
    return (location.state as { email?: string } | null)?.email || "";
  }, [location.state]);

  const [step, setStep] = useState<"otp" | "password">("otp");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);

  const timerExpired = timeLeft <= 0;

  useEffect(() => {
    if (step !== "otp") return;
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, timeLeft]);

  const resetCaptcha = () => {
    captchaRef.current?.reset();
    setRecaptchaToken("");
  };

  const handleOtpChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setOtp(digitsOnly);
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(pasted);

    if (pasted.length === 6) {
      toast.info("OTP pasted");
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      toast.error("Please complete captcha before resending OTP");
      return;
    }

    try {
      setResending(true);

      await forgotPasswordApi({
        email: email.trim(),
        recaptchaToken,
      });

      setOtp("");
      setTimeLeft(OTP_EXPIRY_SECONDS);
      resetCaptcha();

      toast.success("New OTP sent");
    } catch (err: any) {
      resetCaptcha();
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    if (timerExpired) {
      toast.error("OTP expired. Please resend OTP.");
      return;
    }

    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      toast.error("Please complete captcha");
      return;
    }

    try {
      setLoading(true);

      const data = await verifyResetOtpApi({
        email: email.trim(),
        otp,
        recaptchaToken,
      });

      const token = data.verificationToken || data.data?.verificationToken;

      if (!token) {
        throw new Error("Verification token missing");
      }

      setVerificationToken(token);
      setStep("password");
      resetCaptcha();

      toast.success("OTP verified");
    } catch (err: any) {
      resetCaptcha();
      toast.error(err?.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationToken) {
      toast.error("OTP verification is required");
      setStep("otp");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPasswordApi({
        verificationToken,
        password,
        confirmPassword,
      });

      toast.success("Password reset successful");
      navigate("/login", { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
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
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Secure Recovery
            </div>

            <h1 className="mt-6 max-w-xl font-heading text-4xl font-black leading-tight md:text-6xl">
              Reset your password securely.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              Verify your OTP before it expires, then create a new password.
              Paste detection, resend protection, and captcha checks keep the
              flow safe without making it painful.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
                <KeyRound className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">OTP Verification</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  OTP is valid for 10 minutes. Resend is available after expiry.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">Protected Reset</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  reCAPTCHA blocks automated reset abuse.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_36%)]" />

              <div className="relative z-10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                      {step === "otp" ? "Verify OTP" : "New Password"}
                    </p>
                    <h2 className="mt-2 font-heading text-3xl font-black">
                      Reset Password
                    </h2>
                  </div>

                {step === "otp" && (
  <div className="relative shrink-0 overflow-hidden rounded-[1.4rem] border border-border/70 bg-background/70 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_38%)]" />

    <div className="relative flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
          timerExpired
            ? "border-red-500/25 bg-red-500/10 text-red-500"
            : "border-primary/25 bg-primary/10 text-primary"
        }`}
      >
        <Clock3 className="h-5 w-5" />
      </div>

      <div className="text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          OTP expires in
        </p>

        <p
          className={`mt-1 font-heading text-2xl font-black tabular-nums leading-none ${
            timerExpired ? "text-red-500" : "text-foreground"
          }`}
        >
          {formatTime(timeLeft)}
        </p>

        <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-muted/60">
          <motion.div
            className={`h-full rounded-full ${
              timerExpired
                ? "bg-red-500"
                : "bg-gradient-to-r from-primary via-fuchsia-500 to-emerald-400"
            }`}
            initial={{ width: "100%" }}
            animate={{ width: `${Math.max((timeLeft / OTP_EXPIRY_SECONDS) * 100, 0)}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  </div>
)}

                </div>

                {step === "otp" ? (
                  <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                    <Input
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-2xl border-border/70 bg-background/50"
                      autoComplete="email"
                      required
                    />

                    <Input
                      placeholder="Enter 6-digit OTP"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => handleOtpChange(e.target.value)}
                      onPaste={handleOtpPaste}
                      maxLength={6}
                      className="h-12 rounded-2xl border-border/70 bg-background/50 tracking-[0.35em]"
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

                    <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">
                            Didn&apos;t get the OTP?
                          </p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            You can resend only after the current OTP expires.
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendOtp}
                          disabled={!timerExpired || resending}
                          className="shrink-0 rounded-xl"
                        >
                          <RefreshCcw
                            className={`mr-2 h-4 w-4 ${
                              resending ? "animate-spin" : ""
                            }`}
                          />
                          {resending ? "Sending" : "Resend"}
                        </Button>
                      </div>
                    </div>

                    <Button
                      disabled={
                        loading ||
                        !email.trim() ||
                        otp.length !== 6 ||
                        timerExpired ||
                        (Boolean(RECAPTCHA_SITE_KEY) && !recaptchaToken)
                      }
                      className="h-12 w-full rounded-2xl"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                    <Input
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-2xl border-border/70 bg-background/50"
                      autoComplete="new-password"
                      required
                    />

                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-2xl border-border/70 bg-background/50"
                      autoComplete="new-password"
                      required
                    />

                    <Button
                      disabled={
                        loading ||
                        !password ||
                        !confirmPassword ||
                        password !== confirmPassword
                      }
                      className="h-12 w-full rounded-2xl"
                    >
                      {loading ? "Saving..." : "Reset Password"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}