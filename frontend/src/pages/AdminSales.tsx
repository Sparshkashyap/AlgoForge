import { useEffect, useState } from "react";
import { IndianRupee, TrendingUp, Users, Wallet } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { getAdminRevenueAnalyticsApi, getAdminSalesChartApi } from "@/api/admin.analytics.api";
import { toast } from "react-toastify";

export default function AdminSales() {
  const [revenue, setRevenue] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [revenueRes, chartRes] = await Promise.all([
          getAdminRevenueAnalyticsApi(),
          getAdminSalesChartApi(),
        ]);

        setRevenue(revenueRes?.data || null);
        setChart(chartRes?.data || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load sales analytics");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div>
            <div className="mb-6">
              <h1 className="font-heading text-3xl font-black md:text-4xl">
                Sales Analytics
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Admin needs clear visibility into paid users, plans, and revenue.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                Loading sales...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="metric-card">
                    <div className="flex items-center justify-between">
                      <Wallet className="h-5 w-5 text-primary" />
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Revenue
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-black">
                      ₹{revenue?.revenue || 0}
                    </p>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Paid Users
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-black">
                      {revenue?.totalUsers || 0}
                    </p>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-5 w-5 text-amber-400" />
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Standard
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-black">
                      {revenue?.standardUsers || 0}
                    </p>
                  </div>

                  <div className="metric-card">
                    <div className="flex items-center justify-between">
                      <IndianRupee className="h-5 w-5 text-emerald-400" />
                      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Pro
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-black">
                      {revenue?.proUsers || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
                  <h2 className="text-2xl font-black">Monthly sales trend</h2>

                  {chart.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
                      No sales records found.
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-4">
                      {chart.map((item) => (
                        <div
                          key={item.month}
                          className="rounded-xl border border-border bg-background/45 p-4"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <p className="font-semibold">{item.month}</p>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}