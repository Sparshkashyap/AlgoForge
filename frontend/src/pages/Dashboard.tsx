import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Flame, Target, Trophy, TrendingUp, BookOpen, Clock, ChevronRight, Zap, Star
} from "lucide-react";
import { motion } from "framer-motion";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const statsCards = [
  { icon: Target, label: "Problems Solved", value: "127", change: "+12 this week", color: "text-primary" },
  { icon: Flame, label: "Daily Streak", value: "14 days", change: "Best: 23 days", color: "text-warning" },
  { icon: Trophy, label: "Global Rank", value: "#1,234", change: "↑ 56 places", color: "text-accent" },
  { icon: TrendingUp, label: "Acceptance Rate", value: "72%", change: "+3% this month", color: "text-success" },
];

const recommendedProblems = [
  { title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Map"], company: "Google" },
  { title: "Longest Substring", difficulty: "Medium", tags: ["Sliding Window", "String"], company: "Amazon" },
  { title: "Merge Intervals", difficulty: "Medium", tags: ["Array", "Sorting"], company: "Meta" },
  { title: "LRU Cache", difficulty: "Hard", tags: ["Design", "Hash Map"], company: "Apple" },
];

const topicProgress = [
  { name: "Arrays", solved: 45, total: 60, pct: 75 },
  { name: "Trees", solved: 28, total: 50, pct: 56 },
  { name: "Dynamic Programming", solved: 15, total: 55, pct: 27 },
  { name: "Graphs", solved: 22, total: 40, pct: 55 },
  { name: "Two Pointers", solved: 17, total: 20, pct: 85 },
];

const diffBadge = (d: string) => {
  const cls = d === "Easy" ? "bg-success/10 text-success" : d === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{d}</span>;
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <motion.div className="mb-8" {...fade()}>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Welcome back, Alex 👋</h1>
          <p className="text-muted-foreground mt-1">Here's your coding progress overview.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((s, i) => (
            <motion.div key={s.label} className="p-5 rounded-xl border border-border bg-card hover-lift" {...fade(i * 0.08)}>
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.change}</span>
              </div>
              <div className="font-heading text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Problems */}
          <motion.div className="lg:col-span-2 rounded-xl border border-border bg-card p-6" {...fade(0.2)}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-semibold text-lg">Recommended for You</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recommendedProblems.map((p) => (
                <div key={p.title} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.tags.map(t => (
                          <span key={t} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:block">{p.company}</span>
                    {diffBadge(p.difficulty)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Topic Mastery */}
          <motion.div className="rounded-xl border border-border bg-card p-6" {...fade(0.3)}>
            <h2 className="font-heading font-semibold text-lg mb-5">Topic Mastery</h2>
            <div className="space-y-4">
              {topicProgress.map((t) => (
                <div key={t.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs text-muted-foreground">{t.solved}/{t.total}</span>
                  </div>
                  <Progress value={t.pct} className="h-2" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Contest & Activity Row */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <motion.div className="rounded-xl border border-border bg-card p-6" {...fade(0.4)}>
            <h2 className="font-heading font-semibold text-lg mb-4">Upcoming Contests</h2>
            <div className="space-y-3">
              {[
                { name: "Weekly Contest #42", time: "Starts in 2h 15m", participants: "1.2K" },
                { name: "Biweekly Challenge", time: "Tomorrow, 9:00 AM", participants: "800" },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {c.time}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="rounded-xl border border-border bg-card p-6" {...fade(0.5)}>
            <h2 className="font-heading font-semibold text-lg mb-4">Activity Heatmap</h2>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.random();
                const cls = intensity > 0.7 ? "bg-primary" : intensity > 0.4 ? "bg-primary/50" : intensity > 0.15 ? "bg-primary/20" : "bg-muted";
                return <div key={i} className={`h-5 rounded-sm ${cls}`} />;
              })}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded-sm bg-muted" />
                <div className="h-3 w-3 rounded-sm bg-primary/20" />
                <div className="h-3 w-3 rounded-sm bg-primary/50" />
                <div className="h-3 w-3 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
