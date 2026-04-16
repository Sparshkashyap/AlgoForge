import { motion } from "framer-motion";

const testimonials = [
  {
    initials: "SC",
    name: "Sarah Chen",
    role: "SWE @ Google",
    quote:
      "AlgoForge's hint flow pushed me to think better instead of depending on direct solutions.",
  },
  {
    initials: "MR",
    name: "Marcus Rodriguez",
    role: "CS Student",
    quote:
      "The product direction is strong. It feels like a serious interview-prep platform, not a toy clone.",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "SWE @ Meta",
    quote:
      "Clean UI, focused workflow, and the right idea if executed with real backend depth.",
  },
];

export default function TestimonialGrid() {
  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.34em] text-primary/80">
          Loved by ambitious learners
        </p>
        <h2 className="mt-4 font-heading text-4xl font-black leading-tight md:text-6xl">
          Strong workflow.
          <span className="block text-muted-foreground">
            Clear visual direction.
          </span>
        </h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-[1.9rem] border border-border/70 bg-card/75 p-6 shadow-[0_14px_44px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.13),transparent_26%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_24%)] opacity-80" />

            <div className="relative z-10">
              <p className="text-base leading-8 text-foreground/92">“{item.quote}”</p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}