import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trophy,
  Bot,
  Map,
  Bookmark,
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
  "Leaderboard",
  "Bookmarks",
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

const quickLinks = [
  {
    icon: Trophy,
    title: "Leaderboard",
    href: "/leaderboard",
  },
  {
    icon: Bot,
    title: "AI Chat",
    href: "/ai-chat",
  },
  {
    icon: Map,
    title: "Roadmap",
    href: "/roadmap",
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    href: "/bookmarks",
  },
];

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="relative overflow-hidden">
        <HeroOrbBackground />

        <section className="relative">
          <div className="container relative z-10 pb-14 pt-20 sm:pt-24 md:pb-24 md:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-7xl"
            >
              <div className="mx-auto max-w-5xl text-center">
                <div className="hero-chip mx-auto w-fit max-w-full text-[0.72rem] font-semibold leading-5 tracking-[0.12em] sm:text-[0.82rem] md:text-[1rem] md:tracking-[0.18em]">
                  <Sparkles className="h-4 w-4 shrink-0 text-pink-400" />
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    serious prep, stronger product direction
                  </span>
                </div>

                <p className="mt-7 px-2 text-[0.9rem] font-medium uppercase leading-7 tracking-[0.12em] sm:text-[1rem] md:text-[1.2rem] md:tracking-[0.18em]">
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Practice sharper. Think cleaner. Perform harder.
                  </span>
                </p>

                <div className="mt-4">
                  <HeroWipeHeadline />
                </div>

                <p className="mx-auto mt-4 max-w-3xl px-3 text-base leading-8 text-muted-foreground sm:px-6 md:text-xl md:leading-9">
                  A coding prep platform that feels focused from the first
                  scroll. Problems, AI help, leaderboard, roadmap, bookmarks,
                  contests, and analytics should all feel visible.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/signup"}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      className="group h-14 w-full rounded-full px-8 text-base sm:w-auto sm:px-8 sm:py-6"
                    >
                      {isAuthenticated ? "Open Dashboard" : "Start Practicing"}
                      <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                    </Button>
                  </Link>

                  <Link to="/problems" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-full rounded-full px-8 sm:w-auto sm:py-6"
                    >
                      Browse Problems
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3 px-2">
                  {proofChips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border/70 bg-card/62 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]"
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
                  viewport={{ once: true }}
                  className="spotlight-card p-6 md:p-8"
                >
                  <div className="feature-glow absolute inset-0 opacity-80" />
                  <div className="relative z-10">
                    <h3 className="font-heading text-3xl font-black md:text-4xl">
                      Cleaner practice flow.
                    </h3>

                    <div className="mt-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                      <div className="space-y-3">
                        {promisePoints.map((item) => (
                          <div key={item} className="flex gap-3 text-sm">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-4">
                        {previewPoints.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div key={item.title} className="rounded-xl border p-4">
                              <Icon className="h-5 w-5 text-primary" />
                              <p className="mt-2 font-semibold">{item.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.copy}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-5"
                >
                  <div className="spotlight-card p-6">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 text-2xl font-bold">
                      Product should feel credible fast.
                    </h3>

                    <div className="mt-5 grid gap-3">
                      {quickLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/30 hover:bg-primary/5"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="font-medium">{item.title}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/35">
          <div className="container grid gap-4 py-10 md:grid-cols-2 md:py-14 xl:grid-cols-4">
            {stats.map((item) => (
              <HeroCounter key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section className="container py-20 md:py-28">
          <FeatureShowcase />
        </section>

        <section className="border-y border-border/60 bg-card/35">
          <div className="container py-20 md:py-28">
            <TestimonialGrid />
          </div>
        </section>

        <section className="container py-20 md:py-28">
          <div className="spotlight-card p-10 text-center">
            <h2 className="text-4xl font-black">
              Make the product feel inevitable.
            </h2>

            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button>Create Account</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline">View Pricing</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}