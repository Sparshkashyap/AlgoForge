import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import ProblemCard from "@/components/ProblemCard";
import { getMyBookmarksApi } from "@/api/bookmark.api";
import type { Problem } from "@/types/problem.types";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await getMyBookmarksApi();
        setBookmarks(data.data || []);
      } catch {
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-12"
      >
        <h1 className="font-heading text-4xl font-bold">Bookmarks</h1>
        <p className="mt-2 text-muted-foreground">
          Problems you saved for later practice.
        </p>

        <div className="mt-8">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Loading bookmarks...
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No bookmarks yet. Save problems to revisit them later.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {bookmarks.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}