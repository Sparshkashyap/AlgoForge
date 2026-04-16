import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import HeroCounter from "@/components/HeroCounter";
import HeroWipeHeadline from "@/components/HeroWipeHeadline";
import FeatureShowcase from "@/components/FeatureShowcase";
import TestimonialGrid from "@/components/TestimonialGrid";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="container pt-16 pb-10 md:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs text-muted-foreground backdrop-blur-xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Auth phase UI is now production-grade
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mt-8 font-heading text-5xl font-bold tracking-tight md:text-7xl"
            >
              Ready to forge your future?
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-5 text-2xl font-semibold md:text-4xl"
            >
              <HeroWipeHeadline />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg"
            >
              Clean auth, polished design, coding workspace flow, and a serious foundation for real interview prep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link to="/dashboard">
                <Button className="h-12 rounded-xl border-0 bg-primary px-6 text-primary-foreground">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/problems">
                <Button variant="outline" className="h-12 rounded-xl px-6">
                  Browse Problems
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            <HeroCounter end={2500} suffix="+" label="Coding Problems" />
            <HeroCounter end={150} suffix="K+" label="Active Users" />
            <HeroCounter end={500} suffix="+" label="Companies" />
            <HeroCounter end={98} suffix="%" label="Success Rate" />
          </div>

          <FeatureShowcase />
          <TestimonialGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}