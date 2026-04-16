import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
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
import FloatingIconCloud from "@/components/home/FloatingIconCloud";

const stats = [
  { end: 2500, suffix: "+", label: "Coding Problems" },
  { end: 150, suffix: "K+", label: "Active Users" },
  { end: 500, suffix: "+", label: "Companies" },
  { end: 98, suffix: "%", label: "Success Rate" },
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
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mx-auto max-w-7xl text-center"
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                serious prep, premium workflow
              </div>

              <div className="space-y-6">
                <p className="text-xs font-medium uppercase tracking-[0.42em] text-primary/80 md:text-sm">
                  Build stronger problem-solving skills
                </p>

                <HeroWipeHeadline />

                <p className="mx-auto max-w-3xl text-base leading-7 text-muted-foreground md:text-xl md:leading-8">
                  A sharper coding platform with cleaner thinking, stronger workflows,
                  and a UI that feels built for serious interview prep instead of hobby use.
                </p>
              </div>

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

              <div className="mt-16">
                <FloatingIconCloud />
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
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl md:p-14"
          >
            <p className="text-xs font-medium uppercase tracking-[0.36em] text-primary/80">
              Auth phase UI is now production-grade
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-bold leading-tight md:text-6xl">
              Ready to forge your future?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-lg">
              Clean auth, polished design, real user data on dashboard. Backend
              problem modules come next.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" className="rounded-full px-8 py-6 text-base">
                  {isAuthenticated ? "Open Dashboard" : "Create Account"}
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base"
                >
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}