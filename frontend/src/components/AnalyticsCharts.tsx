// AnalyticsCharts.tsx

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const BAR_COLORS = [
  "#2dd4bf",
  "#60a5fa",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#22c55e",
  "#38bdf8",
  "#a855f7",
];

export default function AnalyticsCharts({
  data,
  title,
}: {
  data: Array<{ name: string; value: number }>;
  title: string;
}) {
  const safeData =
    data?.map((item) => ({
      name: item.name,
      value: Number(item.value) || 0,
    })) || [];

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/8 bg-[#120f2d] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.32)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_26%)]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-2xl font-black text-white md:text-3xl">
            {title}
          </h3>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
            Analytics
          </div>
        </div>

        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={safeData}
              margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="analyticsGridFade" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="url(#analyticsGridFade)"
                strokeDasharray="3 6"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(226,232,240,0.72)", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(226,232,240,0.52)", fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  boxShadow: "0 16px 50px rgba(0,0,0,0.28)",
                  color: "#fff",
                }}
                labelStyle={{
                  color: "rgba(226,232,240,0.72)",
                  fontSize: 12,
                  marginBottom: 6,
                }}
                itemStyle={{
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />

              <Bar
                dataKey="value"
                radius={[16, 16, 4, 4]}
                barSize={safeData.length <= 4 ? 86 : 42}
              >
                {safeData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}