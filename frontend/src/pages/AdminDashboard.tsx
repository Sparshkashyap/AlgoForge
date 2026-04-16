import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { getAdminAnalyticsApi } from "@/api/adminUser.api";
import AnalyticsCards from "@/components/AnalyticsCards";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    getAdminAnalyticsApi().then((data) => setAnalytics(data.data));
  }, []);

  const userChartData = useMemo(() => {
    const recent = analytics?.recentUsers || [];
    return recent.map((item: any, index: number) => ({
      name: `U${index + 1}`,
      value: 1,
    }));
  }, [analytics]);

  const submissionChartData = useMemo(() => {
    const recent = analytics?.recentSubmissions || [];
    return recent.map((item: any, index: number) => ({
      name: `S${index + 1}`,
      value: 1,
    }));
  }, [analytics]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-heading text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Platform control center.</p>

        <div className="mt-8">
          <AnalyticsCards totals={analytics?.totals || {}} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AnalyticsCharts data={userChartData} title="Recent User Signups" />
          <AnalyticsCharts data={submissionChartData} title="Recent Submissions" />
        </div>
      </div>
    </div>
  );
}