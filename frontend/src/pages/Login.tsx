import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Github, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const from = (location.state as { from?: string } | null)?.from || "/dashboard";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await login(form);
      navigate(from, { replace: true });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">AlgoForge</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue your practice</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8">
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full" size="lg" type="button" onClick={handleGithubLogin}>
              <Github className="h-4 w-4 mr-2" /> Continue with GitHub
            </Button>
            <Button variant="outline" className="w-full" size="lg" type="button" onClick={handleGoogleLogin}>
              <Mail className="h-4 w-4 mr-2" /> Continue with Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">or</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <Button
              className="w-full gradient-primary text-primary-foreground border-0"
              size="lg"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}