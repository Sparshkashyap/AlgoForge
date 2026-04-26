import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, Flame, Trophy } from "lucide-react";
import { getMyHeatmapApi } from "@/api/user.api";

type HeatmapCell = {
  date: string;
  solvedCount: number;
  level: number;
};

type HeatmapData = {
  summary: {
    rangeDays: number;
    totalSolvedDays: number;
    maxSolvedInDay: number;
    totalSolvedProblems: number;
  };
  cells: HeatmapCell[];
};

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const rangeOptions = [90, 180, 365];

const getLevelClass = (level: number) => {
  switch (level) {
    case 0:
      return "bg-muted/40 hover:bg-muted/60";
    case 1:
      return "bg-emerald-200 dark:bg-emerald-950";
    case 2:
      return "bg-emerald-400 dark:bg-emerald-800";
    case 3:
      return "bg-emerald-500 dark:bg-emerald-600";
    case 4:
      return "bg-emerald-700 dark:bg-emerald-400";
    default:
      return "bg-muted/40 hover:bg-muted/60";
  }
};

const getMonthMarkers = (weeks: HeatmapCell[][]) => {
  const markers: Array<{ index: number; label: string }> = [];
  let lastMonth = "";

  weeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find((day) => day.date);
    if (!firstValidDay) return;

    const date = new Date(firstValidDay.date);
    const monthLabel = date.toLocaleString(undefined, { month: "short" });

    if (monthLabel !== lastMonth) {
      markers.push({ index: weekIndex, label: monthLabel });
      lastMonth = monthLabel;
    }
  });

  return markers;
};

export default function SolveHeatmap() {
  const [days, setDays] = useState(365);
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getMyHeatmapApi(days)
      .then((res) => setData(res?.data || null))
      .finally(() => setLoading(false));
  }, [days]);

  const weeks = useMemo(() => {
    if (!data?.cells?.length) return [];

    const allCells = [...data.cells];
    const firstDay = new Date(allCells[0].date).getDay();

    for (let i = 0; i < firstDay; i += 1) {
      allCells.unshift({
        date: "",
        solvedCount: 0,
        level: 0,
      });
    }

    const grouped = [];
    for (let i = 0; i < allCells.length; i += 7) {
      grouped.push(allCells.slice(i, i + 7));
    }

    return grouped;
  }, [data]);

  const monthMarkers = useMemo(() => {
    return getMonthMarkers(weeks);
  }, [weeks]);

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/80 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_32%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
              <Activity className="h-3.5 w-3.5" />
              Activity
            </div>

            <h2 className="mt-3 text-2xl font-black">Solve Heatmap</h2>

            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              Daily accepted-problem activity across your selected time range.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/60 p-1">
            {rangeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDays(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  days === option
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {option}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-5 rounded-2xl border border-border/70 bg-background/60 p-5 text-sm text-muted-foreground">
            Loading heatmap...
          </div>
        ) : !data ? (
          <div className="mt-5 rounded-2xl border border-border/70 bg-background/60 p-5 text-sm text-muted-foreground">
            No heatmap data available.
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-emerald-500/30 hover:bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <CalendarDays className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Active
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black">
                  {data.summary.totalSolvedDays}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Solved Days
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-emerald-500/30 hover:bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <Flame className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Peak
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black">
                  {data.summary.maxSolvedInDay}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Max In A Day
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-emerald-500/30 hover:bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <Trophy className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Total
                  </span>
                </div>
                <p className="mt-3 text-3xl font-black">
                  {data.summary.totalSolvedProblems}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Total Solved
                </p>
              </div>
            </div>

           <div className="mt-6 rounded-[1.4rem] border border-border/70 bg-background/45 p-4">
  <div className="w-full overflow-x-auto pb-2">
    <div
      className="inline-block w-fit"
    >
      <div
        className="relative mb-3 h-5 text-xs text-muted-foreground"
        style={{ marginLeft: 36 }}
      >
        {monthMarkers.map((marker) => (
          <span
            key={`${marker.label}-${marker.index}`}
            className="absolute whitespace-nowrap"
            style={{
              left: marker.index * 26,
            }}
          >
            {marker.label}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="grid grid-rows-7 gap-1.5 sm:gap-2 pt-[1px] text-xs sm:text-sm text-muted-foreground">
          {dayLabels.map((label, idx) => (
            <div
              key={`${label}-${idx}`}
             className="flex h-5 w-10 items-center justify-start pl-1 text-xs sm:text-sm"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1.5 sm:gap-2">
              {week.map((cell, cellIndex) => {
                if (!cell.date) {
                  return (
                    <div
                      key={`${weekIndex}-${cellIndex}`}
                      className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] bg-transparent"
                    />
                  );
                }

                return (
                  <div
                    key={cell.date}
                    className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] transition hover:scale-125 hover:ring-2 hover:ring-emerald-400/40 ${getLevelClass(
                      cell.level
                    )}`}
                    title={`${cell.date}: ${cell.solvedCount} solved`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <span className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] bg-muted/40" />
        <span className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] bg-emerald-200 dark:bg-emerald-950" />
        <span className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] bg-emerald-400 dark:bg-emerald-800" />
        <span className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] bg-emerald-500 dark:bg-emerald-600" />
        <span className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 rounded-[3px] bg-emerald-700 dark:bg-emerald-400" />
        <span>More</span>
      </div>
    </div>
  </div>
</div>

          </>
        )}
      </div>
    </div>
  );
}
