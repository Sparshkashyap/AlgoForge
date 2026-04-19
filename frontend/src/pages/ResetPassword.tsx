import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, ShieldCheck, Sparkles } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { resetPasswordApi, verifyResetOtpApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const loadRecaptcha = () =>
  new Promise<void>((resolve, reject) => {
    if (window.grecaptcha) return resolve();

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));

    document.body.appendChild(script);
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = useMemo(() => {
    return (location.state as { email?: string } | null)?.email || "";
  }, [location.state]);

  const [step, setStep] = useState<"otp" | "password">("otp");
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecaptcha().catch(() => {});
  }, []);

  const getRecaptchaToken = async () => {
    if (!RECAPTCHA_SITE_KEY) throw new Error("Missing reCAPTCHA key");

    await loadRecaptcha();

    return new Promise<string>((resolve, reject) => {
      window.grecaptcha?.ready(async () => {
        try {
          const token = await window.grecaptcha?.execute(RECAPTCHA_SITE_KEY, {
            action: "verify_reset_otp",
          });
          if (!token) return reject("No token");
          resolve(token);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const recaptchaToken = await getRecaptchaToken();

      const data = await verifyResetOtpApi({
        email,
        otp,
        recaptchaToken,
      });

      setVerificationToken(data.verificationToken || data.data?.verificationToken);
      setStep("password");

      toast.success("OTP verified");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

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
      navigate("/login");
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
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* LEFT UI */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs">
              <Sparkles className="h-3 w-3" />
              Secure Recovery
            </div>

            <h1 className="mt-6 text-4xl font-black">
              Reset your password securely
            </h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-xl">
                <KeyRound />
                <p className="mt-2 font-semibold">OTP Verification</p>
              </div>

              <div className="p-4 border rounded-xl">
                <ShieldCheck />
                <p className="mt-2 font-semibold">Secure Reset</p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="max-w-md w-full mx-auto border p-6 rounded-2xl">
            <Link to="/login" className="text-sm flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            <h2 className="mt-4 text-2xl font-bold">Reset Password</h2>

            {step === "otp" ? (
              <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />

                <Button disabled={loading} className="w-full">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="mt-4 space-y-4">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button disabled={loading} className="w-full">
                  {loading ? "Saving..." : "Reset Password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}