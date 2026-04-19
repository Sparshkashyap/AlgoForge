import { useState } from "react";
import { Mail, Save, User2 } from "lucide-react";
import { updateMyProfileApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import AvatarUploader from "@/components/AvatarUploader";
import type { User } from "@/types/user.types";

export default function ProfileForm({
  user,
  onUpdated,
}: {
  user: User;
  onUpdated: (user: User) => void;
}) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    avatarUrl: user.avatarUrl || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const data = await updateMyProfileApi({
        name: form.name,
        email: form.email,
      });

      onUpdated({
        ...data.data,
        avatarUrl: form.avatarUrl || data.data.avatarUrl,
      });

      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Avatar
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Upload a profile image to make your account easier to recognize across the platform.
        </p>

        <div className="mt-5">
          <AvatarUploader
            avatarUrl={form.avatarUrl}
            onUploaded={(nextUrl) => {
              setForm((prev) => ({ ...prev, avatarUrl: nextUrl }));
              onUpdated({ ...user, avatarUrl: nextUrl });
            }}
          />
        </div>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-4 md:p-5">
          <label className="flex items-center gap-2 text-sm font-medium">
            <User2 className="h-4 w-4 text-primary" />
            Name
          </label>
          <Input
            className="mt-3 h-12 rounded-xl border-border/70 bg-background/60"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Your full name"
          />
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-card/70 p-4 md:p-5">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4 text-primary" />
            Email
          </label>
          <Input
            className="mt-3 h-12 rounded-xl border-border/70 bg-background/60"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Keep your identity clean and current across the product.
        </p>

        <Button
          type="submit"
          disabled={saving}
          className="rounded-xl px-5 shadow-[0_14px_34px_rgba(100,90,255,0.18)]"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}