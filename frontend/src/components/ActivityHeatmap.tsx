import { useMemo } from "react";

type ActivityItem = {
  date: string; // YYYY-MM-DD
  count: number;
};

export default function ActivityHeatmap({
  data,
}: {
  data: ActivityItem[];
}) {
  const dateMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((item) => {
      map.set(item.date, item.count);
    });
    return map;
  }, [data]);

  const getPastDays = (days: number) => {
    const result: string[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      result.push(d.toISOString().split("T")[0]);
    }

    return result;
  };

  const days = getPastDays(140); // ~20 weeks

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count < 2) return "bg-emerald-900";
    if (count < 4) return "bg-emerald-700";
    if (count < 7) return "bg-emerald-500";
    return "bg-emerald-400";
  };

  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-2xl font-black">
            Activity Heatmap
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your daily consistency over time
          </p>
        </div>

        <div className="text-xs text-muted-foreground uppercase tracking-[0.16em]">
          Last 20 weeks
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="grid grid-rows-7 grid-flow-col gap-1">
          {days.map((day) => {
            const count = dateMap.get(day) || 0;

            return (
              <div
                key={day}
                title={`${day} • ${count} submissions`}
                className={`h-3 w-3 rounded-sm transition hover:scale-125 ${getColor(
                  count
                )}`}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-muted" />
        <div className="h-3 w-3 rounded-sm bg-emerald-900" />
        <div className="h-3 w-3 rounded-sm bg-emerald-700" />
        <div className="h-3 w-3 rounded-sm bg-emerald-500" />
        <div className="h-3 w-3 rounded-sm bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  );
}