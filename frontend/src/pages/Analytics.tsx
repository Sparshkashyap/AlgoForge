import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import AnalyticsCards from "@/components/AnalyticsCards";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import RevenueChart from "@/components/RevenueChart";

export default function Analytics() {
  const [loading, setLoading] = useState(true);

  const [totals, setTotals] = useState<Record<string, number>>({
    totalUsers: 0,
    totalCreators: 0,
    totalAdmins: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    premiumUsers: 0,
  });

  const [userGrowthData, setUserGrowthData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  const [submissionData, setSubmissionData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  const [revenueData, setRevenueData] = useState<
    Array<{ name: string; value: number }>
  >([]);

  useEffect(() => {
    // Replace this block with your real analytics API later
    const mockTotals = {
      totalUsers: 12450,
      totalCreators: 18,
      totalAdmins: 3,
      totalProblems: 620,
      totalSubmissions: 184230,
      premiumUsers: 1430,
    };

    const mockUserGrowth = [
      { name: "Jan", value: 420 },
      { name: "Feb", value: 610 },
      { name: "Mar", value: 740 },
      { name: "Apr", value: 980 },
      { name: "May", value: 1230 },
      { name: "Jun", value: 1450 },
    ];

    const mockSubmissions = [
      { name: "Mon", value: 2100 },
      { name: "Tue", value: 2450 },
      { name: "Wed", value: 2320 },
      { name: "Thu", value: 2810 },
      { name: "Fri", value: 3190 },
      { name: "Sat", value: 2950 },
      { name: "Sun", value: 2680 },
    ];

    const mockRevenue = [
      { name: "Jan", value: 1200 },
      { name: "Feb", value: 1800 },
      { name: "Mar", value: 2400 },
      { name: "Apr", value: 3200 },
      { name: "May", value: 4100 },
      { name: "Jun", value: 5200 },
    ];

    setTotals(mockTotals);
    setUserGrowthData(mockUserGrowth);
    setSubmissionData(mockSubmissions);
    setRevenueData(mockRevenue);
    setLoading(false);
  }, []);

  const summary = useMemo(() => {
    return {
      users: totals.totalUsers ?? 0,
      submissions: totals.totalSubmissions ?? 0,
      revenue:
        revenueData.reduce((sum, item) => sum + item.value, 0) || 0,
    };
  }, [totals, revenueData]);

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
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                Platform analytics
              </div>

              <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-6xl">
                Signals that show platform movement clearly.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                Track user growth, submissions, and revenue patterns from one clean
                analytics surface that feels like a product dashboard, not an
                afterthought.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Total users
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {summary.users}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Submissions
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                {summary.submissions}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Revenue
              </p>
              <p className="mt-3 font-heading text-4xl font-black">
                ${summary.revenue}
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
              <AnalyticsCards totals={totals} />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <AnalyticsCharts data={userGrowthData} title="User Growth" />
              <AnalyticsCharts
                data={submissionData}
                title="Submission Activity"
              />
            </div>

            <div className="mt-8">
              <RevenueChart data={revenueData} title="Revenue Trend" />
            </div>

            <div className="mt-8 rounded-[1.8rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary/80">
                <Sparkles className="h-3.5 w-3.5" />
                Analytics note
              </div>

              <p className="mt-4 text-sm leading-8 text-muted-foreground">
                Replace the mock state with your backend analytics API and keep the
                chart data normalized in `{`name, value`}` format for all reusable
                chart components.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}