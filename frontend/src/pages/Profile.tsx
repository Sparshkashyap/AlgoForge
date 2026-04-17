import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Camera,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getMyProfileApi } from "@/api/user.api";
import type { User } from "@/types/user.types";
import ProfileForm from "@/components/ProfileForm";

function getInitials(name?: string, email?: string) {
  if (name?.trim()) {
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }

  return (email?.slice(0, 2) || "AF").toUpperCase();
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMyProfileApi().then((data) => setUser(data.data));
  }, []);

  const initials = useMemo(
    () => getInitials(user?.name, user?.email),
    [user?.email, user?.name]
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-8 md:py-10">
          <div className="spotlight-card p-6 text-sm text-muted-foreground">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8 md:py-10"
      >
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="spotlight-card overflow-hidden p-6 md:p-8">
            <div className="feature-glow absolute inset-0 opacity-80" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Personal account space
              </div>

              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[1.6rem] border border-border/70 bg-gradient-to-br from-primary/20 to-accent/10 text-2xl font-bold shadow-[0_12px_30px_rgba(0,0,0,0.12)] md:h-28 md:w-28 md:text-3xl">
                    {initials}
                  </div>

                  <div className="absolute -bottom-2 -right-2 rounded-full border border-border/70 bg-card/90 p-2 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                    Profile
                  </p>
                  <h1 className="mt-3 font-heading text-4xl font-black leading-tight md:text-5xl">
                    {user.name || "Your account"}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                    Update your identity, account photo, and core details from one
                    clean surface. This page should feel like a serious product
                    settings screen, not a plain form dumped on a page.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="metric-card">
                  <UserCircle2 className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-2 text-sm font-semibold break-all">
                    {user.email}
                  </p>
                </div>

                <div className="metric-card">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Role
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {String(user.role || "USER")}
                  </p>
                </div>

                <div className="metric-card">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Account state
                  </p>
                  <p className="mt-2 text-lg font-semibold">Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="spotlight-card p-6 md:p-8">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                Update details
              </p>
              <h2 className="mt-3 font-heading text-3xl font-black">
                Account settings
              </h2>
              <p className="mt-3 text-sm leading-8 text-muted-foreground">
                Keep your identity clean and current. Changes should feel quick and
                safe, not buried inside weak layout.
              </p>

              <div className="mt-8 rounded-[1.6rem] border border-border/70 bg-background/45 p-4 md:p-5">
                <ProfileForm user={user} onUpdated={setUser} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}