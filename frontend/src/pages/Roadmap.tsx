import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, Flame, MapPinned, Target } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { getRoadmapApi } from "@/api/roadmap.api";

type RoadmapProblem = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
  isPremium: boolean;
};

type RoadmapSection = {
  key: string;
  title: string;
  description: string;
  problems: RoadmapProblem[];
};

type RoadmapData = {
  summary: {
    totalSolved: number;
    totalAttempted: number;
    strongestDifficulty: string;
    solvedTags: Array<{ tag: string; value: number }>;
    weakTags: Array<{ tag: string; value: number }>;
  };
  sections: RoadmapSection[];
};

export default function Roadmap() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoadmapApi()
      .then((res) => setData(res?.data || null))
      .finally(() => setLoading(false));
  }, []);

  const solvedTags = useMemo(() => data?.summary?.solvedTags || [], [data]);
  const weakTags = useMemo(() => data?.summary?.weakTags || [], [data]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-10">
        <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <MapPinned className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-3xl font-black md:text-4xl">
              Dynamic Learning Roadmap
            </h1>
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-8 text-muted-foreground">
            This is not a fake static topic wall. It changes based on what you solved,
            what you attempted badly, and where your gaps actually are.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            Loading roadmap...
          </div>
        ) : !data ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
            No roadmap available.
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Solved
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.totalSolved}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Flame className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Attempted
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.totalAttempted}
                </p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Strongest
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">
                  {data.summary.strongestDifficulty}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
              <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
                <h2 className="text-xl font-bold">Strong Topics</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {solvedTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No strong topic signal yet.
                    </p>
                  ) : (
                    solvedTags.map((item) => (
                      <span
                        key={item.tag}
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                      >
                        {item.tag} ({item.value})
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-card/70 p-5">
                <h2 className="text-xl font-bold">Weak Topics</h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {weakTags.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No weak topic signal yet.
                    </p>
                  ) : (
                    weakTags.map((item) => (
                      <span
                        key={item.tag}
                        className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-400"
                      >
                        {item.tag} ({item.value})
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              {data.sections.map((section) => (
                <div
                  key={section.key}
                  className="rounded-[1.7rem] border border-border/70 bg-card/70 p-5"
                >
                  <h2 className="text-2xl font-black">{section.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {section.description}
                  </p>

                  {section.problems.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-border/70 bg-background/50 p-4 text-sm text-muted-foreground">
                      Nothing here yet.
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {section.problems.map((problem) => (
                        <Link
                          key={problem.id}
                          to={`/problems/${problem.slug}`}
                          className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/30 hover:bg-primary/5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold">{problem.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {problem.difficulty}
                            </span>
                          </div>

                          {problem.tags?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {problem.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-border/70 px-2 py-1 text-[10px] text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {problem.isPremium && (
                            <div className="mt-3 text-xs text-amber-400">
                              Premium
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}