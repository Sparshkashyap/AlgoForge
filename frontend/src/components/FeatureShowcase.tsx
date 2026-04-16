import {
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Sparkles,
  Swords,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Hints",
    description:
      "Hints that sharpen your reasoning without dumping the answer in your lap.",
    icon: BrainCircuit,
  },
  {
    title: "Built-in Code Editor",
    description:
      "A focused coding flow with language-aware boilerplates and cleaner run feedback.",
    icon: Code2,
  },
  {
    title: "Live Contests",
    description:
      "Weekly pressure-driven practice with real timing, comparison, and leaderboard energy.",
    icon: Swords,
  },
  {
    title: "Interview Prep",
    description:
      "Problem sets shaped around serious hiring patterns, not random filler content.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Premium Motion UI",
    description:
      "A sharper visual system with stronger typography, layered gradients, and polished motion.",
    icon: Wand2,
  },
  {
    title: "Serious Product Direction",
    description:
      "Built to feel like a platform with intent, not a thin clone with generic cards.",
    icon: Sparkles,
  },
];

export default function FeatureShowcase() {
  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.34em] text-primary/80">
          Everything you need to level up
        </p>
        <h2 className="mt-4 font-heading text-4xl font-black leading-tight md:text-6xl">
          Premium UI direction now.
          <span className="block text-muted-foreground">
            Real backend depth next.
          </span>
        </h2>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.9rem] border border-border/70 bg-card/75 p-6 shadow-[0_14px_44px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.14),transparent_24%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-white/10 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 font-heading text-2xl font-bold">
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