import { useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { resetPasswordApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const data = await resetPasswordApi({ token, password });
      toast.success(data.message || "Password reset successful");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Reset failed");
    } finally {
      setSaving(false);
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
              Final recovery step
            </div>

            <h1 className="mt-8 font-heading text-4xl font-black leading-tight md:text-6xl">
              Set a new password and get back to work.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
              The reset step should feel just as clean as the rest of the product.
              Keep it simple, update the password, and move straight back into login.
            </p>

            <div className="mt-8 spotlight-card overflow-hidden p-5 md:p-6">
              <div className="feature-glow absolute inset-0 opacity-80" />
              <div className="relative z-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-lg font-semibold">New password</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Set a secure new password that you can use immediately on login.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <p className="mt-4 text-lg font-semibold">Secure token flow</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    This screen is only meaningful when opened through the reset token link.
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
                  Reset Password
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Set a new password for your account.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      className="mt-2 h-12 rounded-2xl border-border/70 bg-background/50"
                      type="password"
                      placeholder="Create a new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving || !token}
                    className="h-12 w-full rounded-2xl"
                  >
                    {saving ? "Saving..." : "Reset Password"}
                  </Button>

                  {!token && (
                    <p className="text-sm text-rose-400">
                      Reset token is missing or invalid.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}