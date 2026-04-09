import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Bookmark, CheckCircle2, Circle, LayoutList, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

const difficulties = ["All", "Easy", "Medium", "Hard"];
const tags = ["Array", "String", "DP", "Tree", "Graph", "Binary Search", "Two Pointers", "Backtracking"];

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Map"], acceptance: "49.2%", status: "solved", companies: ["Google", "Amazon"] },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", tags: ["Linked List", "Math"], acceptance: "40.1%", status: "attempted", companies: ["Microsoft"] },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", tags: ["String", "Sliding Window"], acceptance: "33.8%", status: "unsolved", companies: ["Meta", "Amazon"] },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", tags: ["Array", "Binary Search"], acceptance: "35.6%", status: "unsolved", companies: ["Google", "Apple"] },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", tags: ["String", "DP"], acceptance: "32.4%", status: "solved", companies: ["Amazon"] },
  { id: 6, title: "Container With Most Water", difficulty: "Medium", tags: ["Array", "Two Pointers"], acceptance: "54.3%", status: "unsolved", companies: ["Meta"] },
  { id: 7, title: "3Sum", difficulty: "Medium", tags: ["Array", "Two Pointers"], acceptance: "32.2%", status: "attempted", companies: ["Google", "Meta"] },
  { id: 8, title: "Merge K Sorted Lists", difficulty: "Hard", tags: ["Linked List", "Heap"], acceptance: "48.1%", status: "unsolved", companies: ["Amazon", "Apple"] },
  { id: 9, title: "Valid Parentheses", difficulty: "Easy", tags: ["String", "Stack"], acceptance: "40.7%", status: "solved", companies: ["Google"] },
  { id: 10, title: "Trapping Rain Water", difficulty: "Hard", tags: ["Array", "Two Pointers", "DP"], acceptance: "58.7%", status: "unsolved", companies: ["Google", "Amazon"] },
];

const diffColor = (d: string) =>
  d === "Easy" ? "bg-success/10 text-success border-success/20" : d === "Medium" ? "bg-warning/10 text-warning border-warning/20" : "bg-destructive/10 text-destructive border-destructive/20";

const statusIcon = (s: string) =>
  s === "solved" ? <CheckCircle2 className="h-4 w-4 text-success" /> : s === "attempted" ? <Circle className="h-4 w-4 text-warning" /> : <Circle className="h-4 w-4 text-muted-foreground/30" />;

export default function Problems() {
  const [search, setSearch] = useState("");
  const [activeDiff, setActiveDiff] = useState("All");
  const [view, setView] = useState<"list" | "grid">("list");

  const filtered = problems.filter(p => {
    if (activeDiff !== "All" && p.difficulty !== activeDiff) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { All: problems.length, Easy: problems.filter(p => p.difficulty === "Easy").length, Medium: problems.filter(p => p.difficulty === "Medium").length, Hard: problems.filter(p => p.difficulty === "Hard").length };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-1">Problems</h1>
          <p className="text-muted-foreground mb-6">Browse and solve {problems.length} coding challenges.</p>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col md:flex-row gap-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {difficulties.map(d => (
              <Button
                key={d}
                size="sm"
                variant={activeDiff === d ? "default" : "outline"}
                className={activeDiff === d ? "gradient-primary text-primary-foreground border-0" : ""}
                onClick={() => setActiveDiff(d)}
              >
                {d} <span className="ml-1 text-xs opacity-70">({counts[d as keyof typeof counts]})</span>
              </Button>
            ))}
            <div className="ml-auto flex items-center gap-1 border border-border rounded-lg p-0.5">
              <button onClick={() => setView("list")} className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-muted" : ""}`}>
                <LayoutList className="h-4 w-4" />
              </button>
              <button onClick={() => setView("grid")} className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-muted" : ""}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Problem List */}
        {view === "list" ? (
          <motion.div className="rounded-xl border border-border bg-card overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <div className="hidden md:grid grid-cols-[40px_1fr_100px_100px_80px_40px] gap-4 px-5 py-3 text-xs font-medium text-muted-foreground border-b border-border bg-muted/30">
              <span></span>
              <span>Problem</span>
              <span>Difficulty</span>
              <span>Acceptance</span>
              <span>Status</span>
              <span></span>
            </div>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                className="grid grid-cols-1 md:grid-cols-[40px_1fr_100px_100px_80px_40px] gap-4 px-5 py-4 items-center border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <span className="text-xs text-muted-foreground hidden md:block">{p.id}</span>
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{p.title}</p>
                  <div className="flex gap-1.5 mt-1">
                    {p.tags.map(t => <span key={t} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t}</span>)}
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                </div>
                <span className="text-sm text-muted-foreground hidden md:block">{p.acceptance}</span>
                <div className="hidden md:block">{statusIcon(p.status)}</div>
                <button className="hidden md:block text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer hover-lift"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                  {statusIcon(p.status)}
                </div>
                <h3 className="font-heading font-semibold mb-2">{p.title}</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map(t => <span key={t} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.acceptance} acceptance</span>
                  <Bookmark className="h-3.5 w-3.5 hover:text-primary cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
