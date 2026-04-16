import { useState } from "react";
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
      <AvatarUploader
        avatarUrl={form.avatarUrl}
        onUploaded={(nextUrl) => {
          setForm((prev) => ({ ...prev, avatarUrl: nextUrl }));
          onUpdated({ ...user, avatarUrl: nextUrl });
        }}
      />

      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          className="mt-2 h-12 rounded-xl"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          className="mt-2 h-12 rounded-xl"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      <Button type="submit" disabled={saving} className="rounded-xl">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}