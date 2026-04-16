import { motion } from "framer-motion";

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
    <section className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="max-w-3xl">
          <p className="section-label">What makes the product feel believable</p>
          <h2 className="section-title mt-4">
            Good-looking is not enough.
            <span className="block text-muted-foreground">
              The workflow has to feel credible too.
            </span>
          </h2>
        </div>

        <p className="section-copy max-w-xl lg:ml-auto">
          Testimonials only work when they sound grounded. These are written to sell
          clarity, focus, and actual prep outcomes instead of fake hype.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.45 }}
          className="spotlight-card p-7 md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
            Why trust matters
          </p>
          <h3 className="mt-4 font-heading text-3xl font-black leading-tight md:text-4xl">
            Users believe products that feel focused.
          </h3>
          <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
            The UI should signal seriousness, but the copy has to back that up.
            Better testimonials are not just prettier cards. They sound like something
            an actual user would say after using the workflow.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {[
              "Sharper wording",
              "More grounded outcomes",
              "Less fake startup energy",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-border/70 bg-background/46 px-4 py-3 text-sm text-foreground/90"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="hover-lift spotlight-card p-6"
            >
              <div className="feature-glow absolute inset-0 opacity-75" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/20 to-accent/10 font-semibold text-primary">
                  {item.initials}
                </div>

                <p className="mt-6 text-base leading-8 text-foreground/92">
                  “{item.quote}”
                </p>

                <div className="mt-6 rounded-[1.2rem] border border-primary/18 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {item.outcome}
                </div>

                <div className="mt-auto pt-6">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}