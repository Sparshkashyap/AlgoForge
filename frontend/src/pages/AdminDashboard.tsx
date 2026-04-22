import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  FileCode2,
  Send,
  Trophy,
  Bell,
  IndianRupee,
  Crown,
  ClipboardCheck,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { getAdminSummaryApi } from "@/api/admin.api";
import {
  getAdminRevenueAnalyticsApi,
  getAdminSalesChartApi,
} from "@/api/admin.analytics.api";

type Summary = {
  usersCount: number;
  problemsCount: number;
  submissionsCount: number;
  contestsCount: number;
  premiumUsersCount: number;
  blockedUsersCount: number;
  notificationsCount: number;
  totalPaidUsers?: number;
};

type RevenueAnalytics = {
  totalUsers: number;
  standardUsers: number;
  proUsers: number;
  revenue: number;
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [summaryRes, revenueRes, salesRes] = await Promise.all([
          getAdminSummaryApi(),
          getAdminRevenueAnalyticsApi(),
          getAdminSalesChartApi(),
        ]);

        setSummary(summaryRes?.data || null);
        setRevenue(revenueRes?.data || null);
        setSalesChart(salesRes?.data || []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load admin dashboard"
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
      icon: Crown,
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
    {
      label: "Revenue",
      value: `₹${revenue?.revenue || 0}`,
      icon: IndianRupee,
    },
  ];

  const quickLinks = [
    {
      href: "/admin-users",
      label: "Manage users",
      icon: Users,
    },
    {
      href: "/admin-sales",
      label: "Sales analytics",
      icon: IndianRupee,
    },
    {
      href: "/admin-subscriptions",
      label: "Pricing and subscriptions",
      icon: Crown,
    },
    {
      href: "/admin-problem-review",
      label: "Problem review queue",
      icon: ClipboardCheck,
    },
    {
      href: "/admin-exports",
      label: "CSV exports",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div>
            <div className="mb-6">
              <h1 className="font-heading text-3xl font-black md:text-4xl">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                This should be a real operating console. Users, sales, pricing,
                moderation, and exports must all be visible from here.
              </p>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Loading summary...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

                        <p className="mt-4 text-3xl font-black">
                          {card.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
                  <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
                    <h2 className="text-2xl font-black">Quick Actions</h2>

                    <div className="mt-5 grid gap-3">
                      {quickLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/30 hover:bg-primary/5"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
                    <h2 className="text-2xl font-black">Recent sales trend</h2>

                    {salesChart.length === 0 ? (
                      <div className="mt-4 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
                        No sales trend available.
                      </div>
                    ) : (
                      <div className="mt-5 grid gap-3">
                        {salesChart.slice(-6).map((item) => (
                          <div
                            key={item.month}
                            className="rounded-xl border border-border/70 bg-background/50 p-4"
                          >
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <span className="font-medium">{item.month}</span>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span>Standard: {item.STANDARD}</span>
                                <span>Pro: {item.PRO}</span>
                                <span>Revenue: ₹{item.revenue}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}