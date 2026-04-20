import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  Flame,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyProfileApi, updateMyProfileApi } from "@/api/user.api";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  avatarUrl?: string | null;
  provider?: string;
  solvedCount?: number;
  streak?: number;
  lastSolvedAt?: string | null;
  createdAt?: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({
    name: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfileApi();
      const data = res?.data;

      setProfile(data);
      setForm({
        name: data?.name || "",
        avatarUrl: data?.avatarUrl || "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const res = await updateMyProfileApi(form);
      const data = res?.data;
      setProfile(data);
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
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
        {loading ? (
          <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading profile...
          </div>
        ) : !profile ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            Profile not found
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/70 bg-card/60 p-6 md:p-8">
                <div className="flex items-center gap-4">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/70 bg-background/50">
                      <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}

                  <div>
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Role
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {profile.role}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Plan
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {profile.plan}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      <Award className="h-3.5 w-3.5" />
                      Solved
                    </div>
                    <p className="mt-3 text-lg font-semibold">
                      {profile.solvedCount || 0}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      <Flame className="h-3.5 w-3.5" />
                      Streak
                    </div>
                    <p className="mt-3 text-lg font-semibold">
                      {profile.streak || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Provider: {profile.provider || "LOCAL"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Joined:{" "}
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-card/60 p-6 md:p-8">
              <h2 className="text-2xl font-bold">Edit profile</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Keep your profile clean and current. Don’t let stale user data
                sit around.
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleSave}>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    className="mt-2 h-12 rounded-xl"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Avatar URL</label>
                  <Input
                    className="mt-2 h-12 rounded-xl"
                    value={form.avatarUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        avatarUrl: e.target.value,
                      }))
                    }
                  />
                </div>

                <Button className="w-full rounded-xl" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}