import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { getMyProfileApi } from "@/api/user.api";
import type { User } from "@/types/user.types";
import ProfileForm from "@/components/ProfileForm";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMyProfileApi().then((data) => setUser(data.data));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10 text-muted-foreground">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-heading text-4xl font-bold">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Update your identity and account photo.
        </p>

        <div className="mt-8 max-w-2xl rounded-3xl border border-border bg-card p-6">
          <ProfileForm user={user} onUpdated={setUser} />
        </div>
      </div>
    </div>
  );
}