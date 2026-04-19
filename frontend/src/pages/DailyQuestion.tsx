import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { getDailyQuestionApi } from "@/api/user.api";
import DailyQuestionCard from "@/components/DailyQuestionCard";

export default function DailyQuestion() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDailyQuestionApi()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 flex justify-center">
          <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground">
            Loading daily question...
          </div>
        </div>
      </div>
    );
  }

  if (!data?.daily) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-muted-foreground">
          No daily question available right now.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-10"
      >
        {/* HEADER */}
        <div className="spotlight-card p-6 md:p-7">
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              Daily practice
            </div>

            <h1 className="mt-5 font-heading text-4xl font-black md:text-5xl">
              Daily Question
            </h1>

            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              One problem a day. Consistency matters more than intensity.
              Don’t skip this.
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="mt-10 max-w-xl">
          <DailyQuestionCard
            title={data.daily.problem.title}
            slug={data.daily.problem.slug}
            status={data.myAttempt?.status || null}
          />
        </div>

        {/* CTA / FEEDBACK */}
        <div className="mt-8 rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-xl max-w-xl">
          <div className="flex items-center gap-2 text-primary text-sm">
            <Sparkles className="h-4 w-4" />
            Stay consistent
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Daily repetition builds real problem-solving speed. Missing days kills momentum.
          </p>
        </div>
      </motion.div>
    </div>
  );
}