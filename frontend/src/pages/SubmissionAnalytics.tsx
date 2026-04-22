import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Code2, Flame, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import API from "@/api/axios";

type AnalyticsData = {
  summary: {
    totalSolvedProblems: number;
    totalSubmissions: number;
    totalAcceptedSubmissions: number;
    acceptanceRate: number;
    strongestDifficulty: string;
    mostUsedLanguage: string;
  };
  totals: {
    total: number;
    accepted: number;
    wrongAnswer: number;
    runtimeError: number;
    compilationError: number;
    timeLimitExceeded: number;
    memoryLimitExceeded: number;
    unknown: number;
  };
  difficulty: Record<string, number>;
  verdictBreakdown: Array<{ label: string; value: number }>;
  languageUsage: Array<{ label: string; value: number }>;
  activityTrend: Array<{ date: string; solvedCount: number }>;
  recent: Array<{
    id: string;
    verdict: string;
    createdAt: string;
    language: string;
    runtime?: string | null;
    memory?: string | null;
    passedCount: number;
    totalCount: number;
    problemTitle: string;
    problemSlug: string;
    difficulty: string;
  }>;
};

const getBarWidth = (value: number, max: number) => {
  if (!max) return "0%";
  return `${Math.max((value / max) * 100, value > 0 ? 8 : 0)}%`;
};

export default function SubmissionAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/submissions/analytics/me")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const maxVerdict = useMemo(() => {
    return Math.max(...(data?.verdictBreakdown?.map((item) => item.value) || [0]));
  }, [data]);

  const maxLanguage = useMemo(() => {
    return Math.max(...(data?.languageUsage?.map((item) => item.value) || [0]));
  }, [data]);

  const maxTrend = useMemo(() => {
    return Math.max(...(data?.activityTrend?.map((item) => item.solvedCount) || [0]));
  }, [data]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-6 md:p-8">
          <h1 className="font-heading text-3xl font-black md:text-4xl">
            Submission Analytics
          </h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Real signal only. This page should show what you are actually doing,
            not decorative fake charts.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Loading analytics...
          </div>
        ) : !data ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            No analytics available.
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Solved
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.totalSolvedProblems}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Acceptance
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.acceptanceRate}%
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Flame className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Strongest
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.strongestDifficulty}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Code2 className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Most Used
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.mostUsedLanguage}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
                <h2 className="text-xl font-bold">Verdict Breakdown</h2>

                <div className="mt-5 space-y-4">
                  {data.verdictBreakdown.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>

                      <div className="h-3 rounded-full bg-background">
                        <div
                          className="h-3 rounded-full bg-primary"
                          style={{ width: getBarWidth(item.value, maxVerdict) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
                <h2 className="text-xl font-bold">Language Usage</h2>

                <div className="mt-5 space-y-4">
                  {data.languageUsage.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="text-muted-foreground">{item.value}</span>
                      </div>

                      <div className="h-3 rounded-full bg-background">
                        <div
                          className="h-3 rounded-full bg-primary"
                          style={{ width: getBarWidth(item.value, maxLanguage) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
                <h2 className="text-xl font-bold">Difficulty Wins</h2>

                <div className="mt-5 grid gap-4">
                  {Object.entries(data.difficulty).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-border/70 bg-background/50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
                <h2 className="text-xl font-bold">Accepted Activity Trend</h2>

                <div className="mt-5 flex min-h-[240px] items-end gap-2 overflow-x-auto rounded-xl border border-border/70 bg-background/50 p-4">
                  {data.activityTrend.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No accepted activity yet.
                    </p>
                  ) : (
                    data.activityTrend.map((item) => (
                      <div
                        key={item.date}
                        className="flex min-w-[26px] flex-col items-center justify-end gap-2"
                        title={`${item.date}: ${item.solvedCount} solved`}
                      >
                        <div
                          className="w-6 rounded-t-md bg-primary"
                          style={{
                            height: `${Math.max(
                              (item.solvedCount / (maxTrend || 1)) * 160,
                              item.solvedCount > 0 ? 12 : 2
                            )}px`,
                          }}
                        />
                        <span className="rotate-[-50deg] text-[10px] text-muted-foreground">
                          {item.date.slice(5)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Recent Submissions</h2>
              </div>

              <div className="mt-5 grid gap-4">
                {data.recent.length === 0 ? (
                  <div className="rounded-xl border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
                    No submissions yet.
                  </div>
                ) : (
                  data.recent.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border/70 bg-background/50 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          {item.problemSlug ? (
                            <Link
                              to={`/problems/${item.problemSlug}`}
                              className="font-semibold hover:text-primary"
                            >
                              {item.problemTitle}
                            </Link>
                          ) : (
                            <p className="font-semibold">{item.problemTitle}</p>
                          )}

                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>{item.verdict}</span>
                            <span>{item.language}</span>
                            <span>{item.difficulty}</span>
                            <span>
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <div>Runtime: {item.runtime || "-"}</div>
                          <div>Memory: {item.memory || "-"}</div>
                          <div>
                            Passed: {item.passedCount}/{item.totalCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}