  import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";

  export default function RevenueChart({
    data,
    title = "Revenue Overview",
  }: {
    data: Array<{ name: string; value: number }>;
    title?: string;
  }) {
    return (
      <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/10 to-pink-500/10" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-2xl font-black">{title}</h3>

            <div className="rounded-full border border-border/70 bg-background/55 px-4 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Revenue
            </div>
          </div>

          <div className="mt-6 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#ec4899" }}
                  activeDot={{ r: 6, fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }