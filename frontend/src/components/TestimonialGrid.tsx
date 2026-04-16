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
    <section className="mt-20">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
          Loved by ambitious learners
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold md:text-4xl">
          Clean product direction matters when the workflow is the product.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            className="rounded-3xl border border-border bg-card/75 p-6 backdrop-blur-xl"
          >
            <p className="text-sm leading-7 text-foreground/90">"{item.quote}"</p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 font-semibold text-primary">
                {item.initials}
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}