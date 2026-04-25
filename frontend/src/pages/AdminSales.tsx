import { useEffect, useMemo, useState, useRef } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  CalendarDays,
  Crown,
  BarChart2,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Search,
  ChevronUp,
  ChevronDown,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import {
  getAdminRevenueAnalyticsApi,
  getAdminSalesChartApi,
} from "@/api/admin.analytics.api";
import { toast } from "react-toastify";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatMonth = (year: number, month: number) =>
  new Date(year, month).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

const formatMonthShort = (year: number, month: number) =>
  new Date(year, month).toLocaleString("en-IN", {
    month: "short",
    year: "2-digit",
  });

const formatRupee = (v: number) =>
  v >= 100000
    ? `₹${(v / 100000).toFixed(1)}L`
    : v >= 1000
    ? `₹${(v / 1000).toFixed(1)}K`
    : `₹${v}`;

const pct = (a: number, b: number) => {
  if (!b) return null;
  return (((a - b) / b) * 100).toFixed(1);
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-xl text-sm">
      <p className="mb-2 font-bold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mt-1">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">
            {p.name === "revenue" ? `₹${p.value}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  accent,
  prefix = "",
  loading,
}: {
  icon: any;
  label: string;
  value: number | string;
  change?: string | null;
  accent: string;
  prefix?: string;
  loading?: boolean;
}) {
  const up = change && parseFloat(change) > 0;
  const down = change && parseFloat(change) < 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-border`}
    >
      {/* accent glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-20"
        style={{ background: accent }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
          >
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>

          {change !== undefined && change !== null && (
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                up
                  ? "bg-emerald-500/15 text-emerald-400"
                  : down
                  ? "bg-red-500/15 text-red-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {up ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : down ? (
                <ArrowDownRight className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {Math.abs(parseFloat(change || "0"))}%
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-4 h-8 w-24 animate-pulse rounded-lg bg-muted" />
        ) : (
          <p className="mt-4 text-3xl font-black tracking-tight">
            {prefix}
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
        )}

        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── Sort types ────────────────────────────────────────────────────────────────

type SortField = "month" | "revenue" | "STANDARD" | "PRO";
type SortDir = "asc" | "desc";

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminSales() {
  const [revenue, setRevenue] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("month");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const tableRef = useRef<HTMLDivElement>(null);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const [revenueRes, chartRes] = await Promise.all([
        getAdminRevenueAnalyticsApi(),
        getAdminSalesChartApi(),
      ]);

      setRevenue(revenueRes?.data || null);
      setChart(chartRes?.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load sales analytics"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // ── Chart data ──────────────────────────────────────────────────────────────

  const chartData = useMemo(
    () =>
      chart.map((item) => ({
        name: formatMonthShort(item.year, item.month),
        revenue: item.revenue || 0,
        standard: item.STANDARD || 0,
        pro: item.PRO || 0,
      })),
    [chart]
  );

  // ── MoM change for KPI cards (last 2 months) ───────────────────────────────

  const lastTwo = useMemo(() => {
    if (chart.length < 2) return { rev: null, users: null };
    const sorted = [...chart].sort((a, b) =>
      a.year !== b.year ? a.year - b.year : a.month - b.month
    );
    const prev = sorted[sorted.length - 2];
    const curr = sorted[sorted.length - 1];
    return {
      rev: pct(curr.revenue || 0, prev.revenue || 0),
      users: pct(
        (curr.STANDARD || 0) + (curr.PRO || 0),
        (prev.STANDARD || 0) + (prev.PRO || 0)
      ),
    };
  }, [chart]);

  // ── Best month ─────────────────────────────────────────────────────────────

  const bestMonth = useMemo(() => {
    if (!chart.length) return null;
    return chart.reduce((a, b) => ((a.revenue || 0) > (b.revenue || 0) ? a : b));
  }, [chart]);

  // ── Table with search + sort ────────────────────────────────────────────────

  const filteredChart = useMemo(() => {
    let rows = [...chart];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        formatMonth(r.year, r.month).toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      let va: any, vb: any;
      if (sortField === "month") {
        va = a.year * 100 + a.month;
        vb = b.year * 100 + b.month;
      } else {
        va = a[sortField] || 0;
        vb = b[sortField] || 0;
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });

    return rows;
  }, [chart, search, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDir === "asc" ? (
        <ChevronUp className="h-3.5 w-3.5 text-primary" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5 text-primary" />
      )
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40" />
    );

  // ── CSV export ──────────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    if (!chart.length) return;
    const header = "Month,Year,Revenue,Standard,Pro\n";
    const rows = chart
      .map(
        (r) =>
          `${formatMonth(r.year, r.month)},${r.year},${r.revenue || 0},${
            r.STANDARD || 0
          },${r.PRO || 0}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `algoforge-sales-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  // ── Average revenue ────────────────────────────────────────────────────────

  const avgRevenue = useMemo(() => {
    if (!chart.length) return 0;
    const total = chart.reduce((s, r) => s + (r.revenue || 0), 0);
    return Math.round(total / chart.length);
  }, [chart]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-black md:text-4xl">
                  Sales Analytics
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Paid users, plan breakdown, and monthly subscription revenue.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => void fetchData(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {loading ? (
              /* ── Skeleton ─────────────────────────────────────────────── */
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-32 animate-pulse rounded-2xl border border-border/40 bg-card/60"
                    />
                  ))}
                </div>
                <div className="h-80 animate-pulse rounded-2xl border border-border/40 bg-card/60" />
              </div>
            ) : (
              <>
                {/* ── KPI Cards ───────────────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    icon={Wallet}
                    label="Total Revenue"
                    value={revenue?.revenue || 0}
                    change={lastTwo.rev}
                    accent="#7c3aed"
                    prefix="₹"
                  />
                  <MetricCard
                    icon={Users}
                    label="Paid Users"
                    value={revenue?.totalUsers || 0}
                    change={lastTwo.users}
                    accent="#0ea5e9"
                  />
                  <MetricCard
                    icon={TrendingUp}
                    label="Standard Plan"
                    value={revenue?.standardUsers || 0}
                    accent="#3b82f6"
                  />
                  <MetricCard
                    icon={Crown}
                    label="Pro Plan"
                    value={revenue?.proUsers || 0}
                    accent="#10b981"
                  />
                </div>

                {/* ── Secondary stats row ──────────────────────────────────── */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Avg Monthly Revenue
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {formatRupee(avgRevenue)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      Pro / Standard Ratio
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {revenue?.standardUsers
                        ? (
                            (revenue.proUsers / revenue.standardUsers) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </p>
                  </div>

                  {bestMonth && (
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/8 p-4 backdrop-blur-xl">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/15">
                        <Star className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Best Month
                        </p>
                        <p className="mt-0.5 font-bold">
                          {formatMonthShort(bestMonth.year, bestMonth.month)}
                        </p>
                        <p className="text-xs text-amber-400">
                          ₹{(bestMonth.revenue || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Chart ──────────────────────────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl">
                  {/* ambient glow */}
                  <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                  <div className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-emerald-500/8 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-black">Revenue Trend</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Monthly revenue + subscriber breakdown
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {(["area", "bar"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setChartType(t)}
                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                              chartType === t
                                ? "border-primary/60 bg-primary/15 text-primary"
                                : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t === "area" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <BarChart2 className="h-3 w-3" />
                            )}
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === "area" ? (
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient
                                id="gradRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#7c3aed"
                                  stopOpacity={0.35}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#7c3aed"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="gradPro"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#10b981"
                                  stopOpacity={0.25}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#10b981"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis
                              dataKey="name"
                              stroke="rgba(255,255,255,0.3)"
                              tick={{ fontSize: 11 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="rgba(255,255,255,0.3)"
                              tick={{ fontSize: 11 }}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(v) => formatRupee(v)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine
                              y={avgRevenue}
                              stroke="#f59e0b"
                              strokeDasharray="6 3"
                              label={{
                                value: "avg",
                                position: "insideTopRight",
                                fill: "#f59e0b",
                                fontSize: 10,
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#7c3aed"
                              strokeWidth={2.5}
                              fill="url(#gradRevenue)"
                              dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
                              activeDot={{ r: 5 }}
                            />
                            <Area
                              type="monotone"
                              dataKey="pro"
                              stroke="#10b981"
                              strokeWidth={2}
                              fill="url(#gradPro)"
                              dot={false}
                            />
                          </AreaChart>
                        ) : (
                          <BarChart data={chartData} barGap={4}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis
                              dataKey="name"
                              stroke="rgba(255,255,255,0.3)"
                              tick={{ fontSize: 11 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="rgba(255,255,255,0.3)"
                              tick={{ fontSize: 11 }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                            />
                            <Bar
                              dataKey="standard"
                              fill="#3b82f6"
                              radius={[4, 4, 0, 0]}
                              opacity={0.85}
                            />
                            <Bar
                              dataKey="pro"
                              fill="#10b981"
                              radius={[4, 4, 0, 0]}
                              opacity={0.85}
                            />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* ── Table section ────────────────────────────────────────── */}
                <div className="rounded-2xl border border-border/60 bg-card/75 backdrop-blur-xl overflow-hidden">
                  {/* table header */}
                  <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between border-b border-border/50">
                    <div>
                      <h2 className="text-lg font-black">Monthly Breakdown</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {filteredChart.length} of {chart.length} months
                      </p>
                    </div>

                    <div className="relative w-full sm:w-56">
                      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Filter by month…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-border/60 bg-background/60 py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                  </div>

                  {chart.length === 0 ? (
                    <div className="p-10 text-center text-sm text-muted-foreground">
                      No sales records found.
                    </div>
                  ) : (
                    <div ref={tableRef} className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/40 bg-muted/30">
                            {(
                              [
                                ["month", "Month"],
                                ["revenue", "Revenue"],
                                ["STANDARD", "Standard"],
                                ["PRO", "Pro"],
                              ] as [SortField, string][]
                            ).map(([field, label]) => (
                              <th
                                key={field}
                                onClick={() => handleSort(field)}
                                className="cursor-pointer select-none px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
                              >
                                <span className="flex items-center gap-1.5">
                                  {label}
                                  <SortIcon field={field} />
                                </span>
                              </th>
                            ))}
                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              Plan Split
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {filteredChart.map((item) => {
                            const isBest =
                              bestMonth &&
                              item.year === bestMonth.year &&
                              item.month === bestMonth.month;
                            const total =
                              (item.STANDARD || 0) + (item.PRO || 0) || 1;
                            const proPct = Math.round(
                              ((item.PRO || 0) / total) * 100
                            );

                            return (
                              <tr
                                key={`${item.year}-${item.month}`}
                                className={`group transition-colors duration-150 hover:bg-muted/20 ${
                                  isBest ? "bg-amber-500/5" : ""
                                }`}
                              >
                                {/* Month */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/50">
                                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="font-semibold leading-tight">
                                        {formatMonth(item.year, item.month)}
                                        {isBest && (
                                          <Star className="ml-1.5 inline h-3 w-3 text-amber-400" />
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Revenue */}
                                <td className="px-5 py-4">
                                  <span className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 font-bold text-violet-300">
                                    ₹
                                    {(item.revenue || 0).toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>
                                </td>

                                {/* Standard */}
                                <td className="px-5 py-4">
                                  <span className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-semibold text-blue-300">
                                    {item.STANDARD || 0}
                                  </span>
                                </td>

                                {/* Pro */}
                                <td className="px-5 py-4">
                                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-300">
                                    {item.PRO || 0}
                                  </span>
                                </td>

                                {/* Plan split bar */}
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                      <div
                                        className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                                        style={{ width: `${proPct}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {proPct}% Pro
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {filteredChart.length === 0 && (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                          No months match "{search}"
                        </div>
                      )}
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