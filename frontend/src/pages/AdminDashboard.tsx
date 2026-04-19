// AdminDashboard.tsx

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getAdminAnalyticsApi } from "@/api/adminUser.api";
import AnalyticsCards from "@/components/AnalyticsCards";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalyticsApi()
      .then((data) => setAnalytics(data.data))
      .finally(() => setLoading(false));
  }, []);

  const userChartData = useMemo(() => {
    const recent = analytics?.recentUsers || [];
    return recent.map((item: any, index: number) => ({
      name: item?.name || `U${index + 1}`,
      value: Number(item?.value ?? item?.count ?? 1),
    }));
  }, [analytics]);

  const submissionChartData = useMemo(() => {
    const recent = analytics?.recentSubmissions || [];
    return recent.map((item: any, index: number) => ({
      name: item?.name || `S${index + 1}`,
      value: Number(item?.value ?? item?.count ?? 1),
    }));
  }, [analytics]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8 md:py-10"
      >
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="spotlight-card overflow-hidden p-6 md:p-8">
            <div className="feature-glow absolute inset-0 opacity-80" />
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Admin control center
              </div>

              <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-6xl">
                Platform oversight with cleaner signals.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                Track user growth, submission activity, and system-level movement
                from one surface that feels like a real control layer, not a raw
                internal page.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Total users
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {analytics?.totals?.totalUsers ?? 0}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Total problems
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {analytics?.totals?.totalProblems ?? 0}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Premium users
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {analytics?.totals?.premiumUsers ?? 0}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Submissions
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {analytics?.totals?.totalSubmissions ?? 0}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[1.8rem] border border-border/70 bg-card/70 p-8 text-sm text-muted-foreground backdrop-blur-xl">
            Loading analytics...
          </div>
        ) : (
          <>
            <div className="mt-8">
              <AnalyticsCards totals={analytics?.totals || {}} />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <AnalyticsCharts data={userChartData} title="Recent User Signups" />
              <AnalyticsCharts
                data={submissionChartData}
                title="Recent Submissions"
              />
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary/80">
                <Sparkles className="h-3.5 w-3.5" />
                Admin snapshot
              </div>

              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                This dashboard should help you read platform movement fast. Keep
                charts, cards, and actions tight so the admin side feels as polished
                as the public product.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}