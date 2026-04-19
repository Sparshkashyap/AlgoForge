import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    initials: "AS",
    name: "Aman Sethi",
    role: "SWE Intern Candidate",
    quote:
      "The biggest difference here is focus. I am not fighting the UI while practicing. That matters more than people admit.",
    outcome: "More sessions completed per week",
  },
  {
    initials: "PK",
    name: "Priya Kulkarni",
    role: "Backend Engineer",
    quote:
      "Hints feel useful because they push the next idea instead of handing over the answer. That is rare and honestly better for real prep.",
    outcome: "Better problem-solving retention",
  },
  {
    initials: "RV",
    name: "Rohan Verma",
    role: "Final-year CS Student",
    quote:
      "Most prep sites feel like content dumps. This direction feels more like a system that could actually keep me consistent.",
    outcome: "Higher weekly consistency",
  },
];

export default function TestimonialGrid() {
  return (
    <section className="space-y-14">
      {/* HEADER */}
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="section-label">Real user signals</p>

          <h2 className="section-title mt-4">
            Good-looking is easy.
            <span className="block bg-gradient-to-r from-primary via-pink-400 to-accent bg-clip-text text-transparent">
              Credibility is harder.
            </span>
          </h2>
        </div>

        <p className="section-copy max-w-xl lg:ml-auto">
          These are written to reflect actual behavior change. Not hype. Not fake
          growth claims. Just what happens when the workflow starts working.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT SPOTLIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="spotlight-card relative overflow-hidden p-7 md:p-8"
        >
          {/* glow */}
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.18),transparent_60%)]" />

          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
              Trust signal
            </p>

            <h3 className="mt-4 font-heading text-3xl font-black leading-tight md:text-4xl">
              People trust what feels consistent.
            </h3>

            <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
              If the workflow is clean, users stay longer. If users stay longer,
              results improve. That’s what these testimonials actually reflect.
            </p>

            {/* metrics */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "4.8", label: "Avg rating" },
                { value: "92%", label: "Retention" },
                { value: "3.2x", label: "Practice time" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.2rem] border border-border/70 bg-background/50 px-3 py-4 text-center"
                >
                  <p className="text-lg font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* TESTIMONIAL CARDS */}
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl transition hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
            >
              {/* glow */}
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,255,0.18),transparent_60%)]" />

              <div className="relative z-10 flex h-full flex-col">
                {/* avatar + stars */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
                    {item.initials}
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* quote */}
                <p className="mt-6 text-[15px] leading-8 text-foreground/92">
                  “{item.quote}”
                </p>

                {/* outcome */}
                <div className="mt-6 rounded-[1.2rem] border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
                  {item.outcome}
                </div>

                {/* user */}
                <div className="mt-auto pt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}