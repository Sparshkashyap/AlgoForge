import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import HeroWipeHeadline from "@/components/HeroWipeHeadline";
import HeroCounter from "@/components/HeroCounter";
import FeatureShowcase from "@/components/FeatureShowcase";
import TestimonialGrid from "@/components/TestimonialGrid";
import HeroOrbBackground from "@/components/home/HeroOrbBackground";

const stats = [
  { end: 2500, suffix: "+", label: "Coding Problems" },
  { end: 150, suffix: "K+", label: "Active Users" },
  { end: 500, suffix: "+", label: "Companies" },
  { end: 98, suffix: "%", label: "Success Rate" },
];

const proofChips = [
  "AI hint workflow",
  "Contest mode",
  "Topic progress",
  "Interview prep focus",
];

const previewPoints = [
  {
    icon: BrainCircuit,
    title: "Guided hints",
    copy: "Pushes the next idea instead of spoiling the answer.",
  },
  {
    icon: TimerReset,
    title: "Timed practice",
    copy: "Build pressure tolerance with cleaner contest energy.",
  },
  {
    icon: BarChart3,
    title: "Progress visibility",
    copy: "Make consistency feel real, not invisible.",
  },
];

const promisePoints = [
  "Cleaner UI than generic practice clones",
  "Sharper workflow for actual interview prep",
  "Built to feel like a platform, not a side project",
];

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="relative overflow-hidden">
        <HeroOrbBackground />

        <section className="relative">
          <div className="container relative z-10 pt-24 pb-16 md:pt-32 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mx-auto max-w-7xl"
            >
              <div className="mx-auto max-w-5xl text-center">
                <div className="hero-chip text-[0.9rem] font-semibold tracking-[0.18em] md:text-[1rem]">
  <Sparkles className="h-4 w-4 text-pink-400" />
  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
    serious prep, stronger product direction
  </span>
</div>

<p className="mt-8 text-[1.05rem] font-medium uppercase tracking-[0.18em] md:text-[1.2rem]">
  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
    Practice sharper. Think cleaner. Perform harder.
  </span>
</p>

                <div className="mt-3">
                  <HeroWipeHeadline />
                </div>

                <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground md:text-xl md:leading-9">
                  A coding prep platform that feels focused from the first
                  scroll. Better hierarchy, cleaner workflows, more believable
                  product depth, and a UI that stops looking like every other
                  clone.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                    <Button
                      size="lg"
                      className="group rounded-full px-8 py-6 text-base font-semibold shadow-[0_16px_60px_rgba(100,90,255,0.28)]"
                    >
                      {isAuthenticated ? "Open Dashboard" : "Start Practicing"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <Link to="/problems">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-border/80 bg-background/40 px-8 py-6 text-base backdrop-blur-xl"
                    >
                      Browse Problems
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {proofChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border/70 bg-card/62 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-xl"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-16 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45 }}
                  className="spotlight-card surface-line overflow-hidden p-6 md:p-8"
                >
                  <div className="feature-glow absolute inset-0 opacity-80" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                          Product preview
                        </p>
                        <h3 className="mt-3 font-heading text-3xl font-black leading-tight md:text-4xl">
                          Cleaner practice flow.
                          <span className="block text-muted-foreground">
                            Stronger product signals.
                          </span>
                        </h3>
                      </div>

                      <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        serious workflow
                      </div>
                    </div>

                    <div className="hero-preview-grid mt-8 rounded-[1.7rem] border border-border/70 bg-background/40 p-4 md:p-5">
                      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                        <div className="rounded-[1.4rem] border border-border/70 bg-card/80 p-5">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            session focus
                          </p>
                          <div className="mt-5 space-y-3">
                            {promisePoints.map((item) => (
                              <div
                                key={item}
                                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/45 px-4 py-3 text-sm"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span className="text-foreground/92">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4">
                          {previewPoints.map((item) => {
                            const Icon = item.icon;
                            return (
                              <div
                                key={item.title}
                                className="rounded-[1.4rem] border border-border/70 bg-card/80 p-5"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-white/10 bg-gradient-to-br from-primary/22 to-accent/12 text-primary">
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      {item.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                      {item.copy}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: 0.06 }}
                  className="grid gap-5"
                >
                  <div className="spotlight-card p-6 md:p-7">
                    <div className="feature-glow absolute inset-0 opacity-75" />
                    <div className="relative z-10">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.26em] text-primary/80">
                        Built for trust
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-black leading-tight md:text-3xl">
                        A homepage should sell confidence, not just aesthetics.
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-muted-foreground">
                        Users should understand why the platform feels better
                        within seconds, not only after clicking around.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                    {[
                      {
                        title: "Sharper hierarchy",
                        copy: "Hero, preview, proof, features, and CTA now feel like a story.",
                      },
                      {
                        title: "Less repetitive cards",
                        copy: "One strong spotlight beats six equal blocks fighting for attention.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="metric-card">
                        <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                          {item.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-foreground/90">
                          {item.copy}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 border-y border-border/60 bg-card/35 backdrop-blur-xl">
          <div className="container py-10 md:py-14">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <HeroCounter {...item} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="container relative z-10 py-20 md:py-28">
          <FeatureShowcase />
        </section>

        <section className="border-y border-border/60 bg-card/35">
          <div className="container py-20 md:py-28">
            <TestimonialGrid />
          </div>
        </section>

        <section className="container relative z-10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="spotlight-card overflow-hidden p-8 text-center md:p-14"
          >
            <div className="feature-glow absolute inset-0 opacity-80" />
            <div className="relative z-10">
              <p className="section-label">
                Ready to turn polish into product depth?
              </p>

              <h2 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-black leading-tight md:text-6xl">
                Make the first impression feel expensive.
                <span className="block text-muted-foreground">
                  Then back it up with execution.
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-muted-foreground md:text-lg">
                The front face now looks more intentional. Next step is carrying
                the same design confidence through auth, dashboard, and the
                actual problem solving experience.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-base"
                  >
                    {isAuthenticated ? "Open Dashboard" : "Create Account"}
                  </Button>
                </Link>

                <Link to="/pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-base"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
