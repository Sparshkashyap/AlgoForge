import { BrainCircuit, Briefcase, Code2, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI-Powered Hints",
    description:
      "Get intelligent hints that guide you toward the solution without giving everything away.",
    icon: BrainCircuit,
  },
  {
    title: "Built-in Code Editor",
    description:
      "Professional coding experience with focused execution flow and language-specific templates.",
    icon: Code2,
  },
  {
    title: "Live Contests",
    description:
      "Compete in timed challenges and build pressure-handling skills with real scoring mechanics.",
    icon: Trophy,
  },
  {
    title: "Interview Prep",
    description:
      "Curated problems and workflows designed around product-company hiring patterns.",
    icon: Briefcase,
  },
];

export default function FeatureShowcase() {
  return (
    <section className="mt-20">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
          Everything you need to level up
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
          Built with a premium UI direction now, and ready for real backend depth next.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="group rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-xl transition hover:border-primary/30 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.18)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-105">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 font-heading text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}