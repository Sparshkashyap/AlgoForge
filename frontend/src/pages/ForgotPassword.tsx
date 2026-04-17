import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { forgotPasswordApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSending(true);
      const data = await forgotPasswordApi(email);
      toast.success(data.message || "Reset link sent if account exists");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send reset link");
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
        transition={{ duration: 0.28 }}
        className="container py-12 md:py-16"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Account recovery
            </div>

            <h1 className="mt-8 font-heading text-4xl font-black leading-tight md:text-6xl">
              Get back into your account without friction.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              Password recovery should feel simple and trustworthy. Enter your email,
              receive the reset link, and get back to the product without confusion.
            </p>

            <div className="mt-8 spotlight-card overflow-hidden p-5 md:p-6">
              <div className="feature-glow absolute inset-0 opacity-80" />
              <div className="relative z-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5">
                  <Mail className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-lg font-semibold">Reset by email</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    We send a secure password reset link to the email you enter here.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <p className="mt-4 text-lg font-semibold">Clean recovery flow</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    No clutter, no weird branching, just a clear path back to your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="spotlight-card p-8">
              <div className="relative z-10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>

                <h2 className="mt-6 font-heading text-3xl font-black">
                  Forgot Password
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Enter your email and we’ll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      className="mt-2 h-12 rounded-2xl border-border/70 bg-background/50"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="h-12 w-full rounded-2xl"
                  >
                    {sending ? "Sending..." : "Send Reset Link"}
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