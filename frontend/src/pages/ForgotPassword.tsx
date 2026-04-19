import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { forgotPasswordApi } from "@/api/auth.api";
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

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
            action: "forgot_password",
          });
          if (!token) return reject("No token");
          resolve(token);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSending(true);

      const recaptchaToken = await getRecaptchaToken();

      const data = await forgotPasswordApi({
        email,
        recaptchaToken,
      });

      toast.success(data.message || "OTP sent");
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
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

          {/* LEFT UI */}
          <div>
            <div className="inline-flex items-center gap-2 border px-4 py-2 text-xs">
              <Sparkles className="h-3 w-3" />
              Account Recovery
            </div>

            <h1 className="mt-6 text-4xl font-black">
              Reset access without friction
            </h1>

            <p className="mt-4 text-muted-foreground">
              Enter your email, get OTP, and recover access instantly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-xl">
                <Mail />
                <p className="mt-2 font-semibold">Email OTP</p>
              </div>

              <div className="p-4 border rounded-xl">
                <ShieldCheck />
                <p className="mt-2 font-semibold">Secure Flow</p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="max-w-md w-full mx-auto border p-6 rounded-2xl">
            <Link to="/login" className="flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            <h2 className="mt-4 text-2xl font-bold">Forgot Password</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button disabled={sending} className="w-full">
                {sending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}