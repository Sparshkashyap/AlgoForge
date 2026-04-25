import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  UserCircle2,
  Award,
  Flame,
  CalendarDays,
  AtSign,
} from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMyProfileApi, updateMyProfileApi } from "@/api/user.api";
import ProfileAvatarUploader from "@/components/ProfileAvatarUploader";
import SolveHeatmap from "@/components/SolveHeatmap";
import { useAuth } from "@/context/AuthContext";

type ProfileData = {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  role: string;
  plan: string;
  avatarUrl?: string | null;
  provider?: string;
  solvedCount?: number;
  streak?: number;
  createdAt?: string;
};

export default function Profile() {
  const { refreshMe } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const usernameLabel = profile?.username
    ? `@${profile.username}`
    : "@username-not-set";

  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return "-";
    return new Date(profile.createdAt).toLocaleDateString();
  }, [profile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfileApi();
      const data = res?.data;

      setProfile(data);
      setForm({ name: data?.name || "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateMyProfileApi({ name: form.name });

      setProfile(res?.data);
      await refreshMe();

      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdated = async ({
    avatarUrl,
  }: {
    avatarUrl: string | null;
  }) => {
    setProfile((prev) => (prev ? { ...prev, avatarUrl } : prev));
    await refreshMe();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-12">
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-12">
          <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Profile not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container space-y-6 py-8">
        <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-black md:text-4xl">Profile</h1>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <AtSign className="h-4 w-4" />
                {usernameLabel.replace("@", "")}
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                Manage your identity, progress, and presence.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-border/70 px-3 py-1 text-muted-foreground">
                  {profile.role}
                </span>
                <span className="rounded-full border border-border/70 px-3 py-1 text-muted-foreground">
                  {profile.plan}
                </span>
                <span className="rounded-full border border-border/70 px-3 py-1 text-muted-foreground">
                  Provider: {profile.provider || "LOCAL"}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <Award className="h-4 w-4 text-primary" />
                <p className="text-3xl font-black">
                  {profile.solvedCount || 0}
                </p>
                <p className="text-xs text-muted-foreground">Solved</p>
              </div>

              <div className="metric-card">
                <Flame className="h-4 w-4 text-primary" />
                <p className="text-3xl font-black">{profile.streak || 0}</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>

              <div className="metric-card">
                <CalendarDays className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">{memberSince}</p>
                <p className="text-xs text-muted-foreground">Member Since</p>
              </div>
            </div>
          </div>
        </div>

        <ProfileAvatarUploader
          currentName={profile.name}
          currentAvatarUrl={profile.avatarUrl}
          provider={profile.provider}
          onUpdated={handleAvatarUpdated}
        />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
  <SolveHeatmap />

        <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-primary" />
            <p className="font-semibold">Edit profile</p>
          </div>



          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm">Name</label>
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
              <label className="text-sm">Email</label>
              <div className="mt-2 flex h-12 items-center rounded-xl border border-border bg-background px-4 text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {profile.email}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-5 w-full rounded-xl"
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        </div>
      </div>
    </div>
  );
}