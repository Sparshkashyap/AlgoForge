import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8">
          <h1 className="font-heading text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Set a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                className="mt-2 h-12 rounded-xl"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={saving || !token} className="w-full rounded-xl">
              {saving ? "Saving..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}