import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ChartColumn,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getAdminAnalyticsApi } from "@/api/adminUser.api";
import AnalyticsCards from "@/components/AnalyticsCards";
import AnalyticsCharts from "@/components/AnalyticsCharts";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    getAdminAnalyticsApi().then((data) => setAnalytics(data.data));
  }, []);

  const userChartData = useMemo(() => {
    const recent = analytics?.recentUsers || [];
    return recent.map((_: any, index: number) => ({
      name: `U${index + 1}`,
      value: 1,
    }));
  }, [analytics]);

  const submissionChartData = useMemo(() => {
    const recent = analytics?.recentSubmissions || [];
    return recent.map((_: any, index: number) => ({
      name: `S${index + 1}`,
      value: 1,
    }));
  }, [analytics]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 md:py-10">
        <motion.div className="spotlight-card overflow-hidden p-6 md:p-8" {...fade()}>
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Platform control center
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                Admin dashboard
              </p>
              <h1 className="mt-4 font-heading text-4xl font-black leading-tight md:text-6xl">
                See the platform clearly, then manage it fast.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Admin pages should feel like command surfaces, not raw charts dumped
                on a blank page. This version gives hierarchy, clarity, and cleaner
                control flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { label: "System health", value: "Stable", icon: ShieldCheck },
                { label: "Growth pulse", value: "Visible", icon: Users },
                { label: "Ops rhythm", value: "Active", icon: Activity },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="metric-card">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-4 text-xs uppercase tracking-[0.26em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div className="mt-6" {...fade(0.08)}>
          <AnalyticsCards totals={analytics?.totals || {}} />
        </motion.div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.div className="spotlight-card p-6 md:p-7" {...fade(0.14)}>
            <div className="flex items-center gap-2">
              <ChartColumn className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-black">Growth patterns</h2>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Recent signups become useful when the view feels readable and intentional.
            </p>

            <div className="mt-6">
              <AnalyticsCharts data={userChartData} title="Recent User Signups" />
            </div>
          </motion.div>

          <motion.div className="spotlight-card p-6 md:p-7" {...fade(0.18)}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-heading text-2xl font-black">Submission activity</h2>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Admins need a fast read on platform usage, not just total numbers.
            </p>

            <div className="mt-6">
              <AnalyticsCharts data={submissionChartData} title="Recent Submissions" />
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-6 spotlight-card p-6 md:p-7" {...fade(0.24)}>
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                Fast admin actions
              </p>
              <h2 className="mt-3 font-heading text-3xl font-black leading-tight">
                Jump straight into moderation and publishing.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/manage-users">
                <Button variant="outline" className="rounded-full px-6">
                  Manage Users
                </Button>
              </Link>
              <Link to="/manage-problems">
                <Button variant="outline" className="rounded-full px-6">
                  Manage Problems
                </Button>
              </Link>
              <Link to="/create-problem">
                <Button className="rounded-full px-6">Create Problem</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}