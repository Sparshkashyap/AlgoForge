import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  LayoutDashboard,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI that guides, not spoon-feeds",
    description:
      "Hints push your thinking forward instead of revealing full solutions.",
    icon: BrainCircuit,
  },
  {
    title: "Zero-noise coding workspace",
    description:
      "Editor, test cases, and feedback designed for uninterrupted focus.",
    icon: Code2,
  },
  {
    title: "Interview-driven problem set",
    description:
      "Curated for actual hiring patterns, not inflated content volume.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Real contest pressure",
    description:
      "Timed runs, rankings, and repeat loops that simulate real environments.",
    icon: Swords,
  },
];

const utilityStats = [
  { label: "Practice paths", value: "Structured" },
  { label: "Progress", value: "Visible" },
  { label: "Consistency", value: "Rewarded" },
];

export default function FeatureShowcase() {
  return (
    <section className="space-y-14">
      {/* HEADER */}
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="section-label">Why it stands out</p>

          <h2 className="section-title mt-4">
            Built for real prep.
            <span className="block bg-gradient-to-r from-primary via-pink-400 to-accent bg-clip-text text-transparent">
              Not surface-level practice.
            </span>
          </h2>
        </div>

        <p className="section-copy max-w-xl lg:ml-auto">
          Most platforms add features. This one sharpens workflow. That difference
          is what actually improves consistency and results.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* HERO FEATURE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="spotlight-card relative overflow-hidden p-7 md:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.18),transparent_60%)]" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-primary/30 to-accent/20 text-primary">
                  <LayoutDashboard className="h-6 w-6" />
                </div>

                <h3 className="mt-6 font-heading text-3xl font-black leading-tight md:text-4xl">
                  One place for practice, feedback, tracking, and AI.
                </h3>

                <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
                  Instead of jumping between tools, everything is built into one
                  continuous workflow that keeps momentum intact.
                </p>
              </div>

              <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Core system
              </div>
            </div>

            {/* STATS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {utilityStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-border/70 bg-background/50 p-4 text-center"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT FEATURE BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="spotlight-card relative overflow-hidden p-6"
        >
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_80%_20%,rgba(255,105,180,0.18),transparent_60%)]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/30 to-accent/20 text-primary">
              <Trophy className="h-5 w-5" />
            </div>

            <h3 className="mt-5 font-heading text-2xl font-black">
              Feels like a system, not a tool.
            </h3>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The difference shows up in how long users stay focused and how
              consistently they practice.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Cleaner flow",
                "Less friction",
                "More repeat sessions",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-background/50 px-4 py-3 text-sm"
                >
                  <span>{item}</span>
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                Strong workflow = consistent users.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/75 p-6 transition hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,255,0.18),transparent_60%)]" />

              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/30 to-accent/20 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-heading text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}