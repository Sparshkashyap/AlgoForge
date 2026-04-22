import { useEffect, useMemo, useState } from "react";
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

const dayLabels = ["Sun", "", "Tue", "", "Thu", "", ""];

const getLevelClass = (level: number) => {
  switch (level) {
    case 0:
      return "bg-muted/40";
    case 1:
      return "bg-green-200 dark:bg-green-900";
    case 2:
      return "bg-green-400 dark:bg-green-700";
    case 3:
      return "bg-green-500 dark:bg-green-600";
    case 4:
      return "bg-green-700 dark:bg-green-500";
    default:
      return "bg-muted/40";
  }
};

const getMonthMarkers = (cells: HeatmapCell[]) => {
  const markers: Array<{ index: number; label: string }> = [];
  let lastMonth = "";

  cells.forEach((cell, index) => {
    const date = new Date(cell.date);
    const monthLabel = date.toLocaleString(undefined, { month: "short" });

    if (monthLabel !== lastMonth) {
      markers.push({ index, label: monthLabel });
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

  const flatCells = useMemo(() => {
    return weeks.flat();
  }, [weeks]);

  const monthMarkers = useMemo(() => {
    const realCells = flatCells.filter((cell) => cell.date);
    return getMonthMarkers(realCells);
  }, [flatCells]);

  return (
    <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Solve Heatmap</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Green blocks show how many unique accepted problems you solved each day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDays(90)}
            className={`rounded-xl px-3 py-2 text-sm ${
              days === 90
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background"
            }`}
          >
            90d
          </button>

          <button
            type="button"
            onClick={() => setDays(180)}
            className={`rounded-xl px-3 py-2 text-sm ${
              days === 180
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background"
            }`}
          >
            180d
          </button>

          <button
            type="button"
            onClick={() => setDays(365)}
            className={`rounded-xl px-3 py-2 text-sm ${
              days === 365
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background"
            }`}
          >
            365d
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-5 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
          Loading heatmap...
        </div>
      ) : !data ? (
        <div className="mt-5 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
          No heatmap data available.
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Solved Days
              </p>
              <p className="mt-2 text-2xl font-black">
                {data.summary.totalSolvedDays}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Max In A Day
              </p>
              <p className="mt-2 text-2xl font-black">
                {data.summary.maxSolvedInDay}
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Total Solved
              </p>
              <p className="mt-2 text-2xl font-black">
                {data.summary.totalSolvedProblems}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[880px]">
              <div className="mb-3 flex pl-10 text-xs text-muted-foreground">
                {monthMarkers.map((marker) => (
                  <div
                    key={`${marker.label}-${marker.index}`}
                    className="w-[56px] shrink-0"
                  >
                    {marker.label}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="grid grid-rows-7 gap-2 pt-1 text-[10px] text-muted-foreground">
                  {dayLabels.map((label, idx) => (
                    <div
                      key={`${label}-${idx}`}
                      className="flex h-4 items-center justify-end pr-1"
                    >
                      {label}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-rows-7 gap-2">
                      {week.map((cell, cellIndex) => {
                        if (!cell.date) {
                          return (
                            <div
                              key={`${weekIndex}-${cellIndex}`}
                              className="h-4 w-4 rounded-[4px] bg-transparent"
                            />
                          );
                        }

                        return (
                          <div
                            key={cell.date}
                            className={`h-4 w-4 rounded-[4px] ${getLevelClass(
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
                <span className="h-4 w-4 rounded-[4px] bg-muted/40" />
                <span className="h-4 w-4 rounded-[4px] bg-green-200 dark:bg-green-900" />
                <span className="h-4 w-4 rounded-[4px] bg-green-400 dark:bg-green-700" />
                <span className="h-4 w-4 rounded-[4px] bg-green-500 dark:bg-green-600" />
                <span className="h-4 w-4 rounded-[4px] bg-green-700 dark:bg-green-500" />
                <span>More</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}