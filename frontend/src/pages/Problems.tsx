import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { getProblemsApi } from "@/api/problem.api";
import type { Problem } from "@/types/problem.types";
import ProblemCard from "@/components/ProblemCard";

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblemsApi()
      .then((data) => setProblems(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredProblems = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return problems;

    return problems.filter((problem) => {
      return (
        problem.title.toLowerCase().includes(q) ||
        problem.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        problem.difficulty.toLowerCase().includes(q)
      );
    });
  }, [problems, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Problem Bank
          </h1>
          <p className="mt-3 text-muted-foreground">
            Browse published problems freely. Login is required only for submitting solutions.
          </p>
        </motion.div>

        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tag, or difficulty"
            className="h-12 rounded-2xl pl-11"
          />
        </div>

        {loading ? (
          <div className="mt-8 text-sm text-muted-foreground">Loading problems...</div>
        ) : filteredProblems.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-muted-foreground">
            No published problems found.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}