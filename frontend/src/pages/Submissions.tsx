import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { getMySubmissionsApi } from "@/api/submission.api";
import type { Submission } from "@/types/submission.types";

const getStatusColor = (status?: string) => {
  if (status === "Accepted") return "text-emerald-400";
  if (status === "Wrong Answer") return "text-rose-400";
  if (status === "Runtime Error") return "text-amber-400";
  return "text-muted-foreground";
};

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySubmissionsApi()
      .then((data) => setSubmissions(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8 md:py-10">
        <h1 className="font-heading text-4xl font-bold">My Submissions</h1>
        <p className="mt-2 text-muted-foreground">
          Track all your past submissions and performance.
        </p>

        {loading ? (
          <div className="mt-8 text-muted-foreground">
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="mt-8 text-muted-foreground">
            No submissions yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {submissions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">
                      {item.problem?.title || "Unknown Problem"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.language}
                    </p>
                  </div>

                  <div className="text-sm">
                    <span className={getStatusColor(item.verdict || item.status)}>
                      {item.verdict || item.status}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {item.runtime ? `${item.runtime} ms` : "-"} •{" "}
                    {item.memory ? `${item.memory} KB` : "-"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}