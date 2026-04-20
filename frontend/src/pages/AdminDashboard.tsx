import { useEffect, useState } from "react";
import { ShieldCheck, Users, FileCode2, Send, Trophy, Bell } from "lucide-react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { getAdminSummaryApi } from "@/api/admin.api";

type Summary = {
  usersCount: number;
  problemsCount: number;
  submissionsCount: number;
  contestsCount: number;
  premiumUsersCount: number;
  blockedUsersCount: number;
  notificationsCount: number;
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getAdminSummaryApi();
        setSummary(res?.data || null);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load admin summary"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const cards = [
    {
      label: "Users",
      value: summary?.usersCount || 0,
      icon: Users,
    },
    {
      label: "Problems",
      value: summary?.problemsCount || 0,
      icon: FileCode2,
    },
    {
      label: "Submissions",
      value: summary?.submissionsCount || 0,
      icon: Send,
    },
    {
      label: "Contests",
      value: summary?.contestsCount || 0,
      icon: Trophy,
    },
    {
      label: "Premium Users",
      value: summary?.premiumUsersCount || 0,
      icon: ShieldCheck,
    },
    {
      label: "Blocked Users",
      value: summary?.blockedUsersCount || 0,
      icon: ShieldCheck,
    },
    {
      label: "Notifications",
      value: summary?.notificationsCount || 0,
      icon: Bell,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-black">Admin Dashboard</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Admin summary should show platform health clearly, not hide signal.
        </p>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading summary...
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-[1.6rem] border border-border/70 bg-card/60 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {card.label}
                    </p>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>

                  <p className="mt-4 text-3xl font-black">{card.value}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}