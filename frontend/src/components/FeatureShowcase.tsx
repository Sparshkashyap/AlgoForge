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
    title: "AI hints that teach, not spoil",
    description:
      "Push users toward the next correct idea instead of dumping the full answer path.",
    icon: BrainCircuit,
  },
  {
    title: "Focused coding workspace",
    description:
      "Cleaner editor flow, test cases, runtime feedback, and less visual friction while practicing.",
    icon: Code2,
  },
  {
    title: "Interview-first problem curation",
    description:
      "Structured around actual prep outcomes, not random filler made to inflate volume.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Contest energy built in",
    description:
      "Timed pressure, ranking, and repeatable practice loops that feel closer to real environments.",
    icon: Swords,
  },
];

const utilityStats = [
  { label: "Practice paths", value: "Topic-based" },
  { label: "Progress tracking", value: "Visualized" },
  { label: "Daily consistency", value: "Rewarded" },
];

export default function FeatureShowcase() {
  return (
    <section className="space-y-12">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="section-label">Why this product feels stronger</p>
          <h2 className="section-title mt-4">
            Built like a serious prep system.
            <span className="block text-muted-foreground">
              Not another shallow clone.
            </span>
          </h2>
        </div>

        <p className="section-copy max-w-xl lg:ml-auto">
          The problem is not just missing features. Most practice platforms feel flat,
          noisy, or generic. AlgoForge needs sharper hierarchy, better workflow,
          and stronger product proof across the page.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.45 }}
          className="spotlight-card surface-line feature-glow p-7 md:p-8"
        >
          <div className="absolute inset-0 opacity-90" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-primary/22 via-primary/12 to-accent/14 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                  <LayoutDashboard className="h-6 w-6" />
                </div>

                <h3 className="mt-6 font-heading text-3xl font-black leading-tight md:text-4xl">
                  One surface for practice, tracking, contests, and AI guidance.
                </h3>

                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                  The landing page should sell product depth immediately. This section
                  does that by showing one stronger story instead of six equal cards
                  fighting for attention.
                </p>
              </div>

              <div className="rounded-full border border-border/70 bg-background/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary/80 backdrop-blur-xl">
                Premium workflow
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {utilityStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-border/70 bg-background/44 p-4 backdrop-blur-xl"
                >
                  <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          className="spotlight-card overflow-hidden p-6"
        >
          <div className="feature-glow absolute inset-0 opacity-80" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/22 to-accent/12 text-primary">
              <Trophy className="h-5 w-5" />
            </div>

            <h3 className="mt-5 font-heading text-2xl font-black leading-tight">
              The page needs product proof, not decoration.
            </h3>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Better structure beats random motion. A product starts feeling premium
              when the sections sell outcomes clearly.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Cleaner CTA grouping",
                "Sharper section contrast",
                "More believable product depth",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/44 px-4 py-3 text-sm"
                >
                  <span>{item}</span>
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="rounded-[1.4rem] border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                Strong UI should make the product feel inevitable.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="hover-lift spotlight-card p-6"
            >
              <div className="feature-glow absolute inset-0 opacity-75" />
              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/22 to-accent/12 text-primary">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-heading text-2xl font-bold leading-tight">
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

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.45 }}
        className="spotlight-card p-6 md:p-7"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Daily problem loop",
              copy: "A repeatable habit section that should feel more motivating than plain streak counters.",
              icon: Sparkles,
            },
            {
              title: "Company-targeted prep",
              copy: "Users should understand where the platform helps them aim, not just what buttons exist.",
              icon: BriefcaseBusiness,
            },
            {
              title: "Competitive momentum",
              copy: "Contests and rankings should reinforce progress, not sit as disconnected features.",
              icon: Swords,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-border/70 bg-background/46 p-5"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h4 className="mt-4 text-lg font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}