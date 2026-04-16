import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import  Footer  from "@/components/Footer";
import {
  ArrowRight,
  Brain,
  BookOpen,
  ChevronRight,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const stats = [
  { value: "2,500+", label: "Coding Problems" },
  { value: "150K+", label: "Active Users" },
  { value: "500+", label: "Companies" },
  { value: "98%", label: "Success Rate" },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Hints",
    desc: "Get intelligent hints that guide you to the solution without giving it away.",
  },
  {
    icon: BookOpen,
    title: "Built-in Code Editor",
    desc: "Professional IDE experience with syntax highlighting and focused execution flow.",
  },
  {
    icon: Trophy,
    title: "Live Contests",
    desc: "Compete in weekly contests and climb the leaderboard with real performance tracking.",
  },
  {
    icon: Target,
    title: "Interview Prep",
    desc: "Curated problem sets designed for top product companies and hiring rounds.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "SWE @ Google",
    text: "AlgoForge's hint flow pushed me to think better instead of depending on direct solutions.",
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "CS Student",
    text: "The product direction is strong. It feels like a serious interview-prep platform, not a toy clone.",
    avatar: "MR",
  },
  {
    name: "Priya Sharma",
    role: "SWE @ Meta",
    text: "Clean UI, focused workflow, and the right idea if executed with real backend depth.",
    avatar: "PS",
  },
];

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div className="max-w-3xl mx-auto text-center" {...fade()}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/80 text-sm text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI-powered coding practice</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Practice Smarter.{" "}
              <span className="gradient-text">Build Faster.</span> Crack Better.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Master DSA, sharpen interview thinking, and train with a platform
              designed to evolve into a serious AI-first coding product.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground border-0 px-8 glow-sm rounded-full"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Practicing Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/problems">
                <Button size="lg" variant="outline" className="rounded-full">
                  Browse Problems
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} className="text-center" {...fade(i * 0.1)}>
                <div className="font-heading text-3xl md:text-4xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <motion.div className="text-center mb-14" {...fade()}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Everything you need to level up
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built with a premium UI direction now, and ready for real backend depth next.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group p-6 rounded-3xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover-lift"
              {...fade(i * 0.08)}
            >
              <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center mb-4 group-hover:glow-sm transition-shadow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-card/30 border-y border-border">
        <div className="container py-20 md:py-28">
          <motion.div className="text-center mb-14" {...fade()}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Loved by ambitious learners
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="p-6 rounded-3xl border border-border bg-card hover-lift"
                {...fade(i * 0.1)}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <motion.div className="max-w-3xl mx-auto text-center" {...fade()}>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-5">
            <Shield className="h-3.5 w-3.5" />
            Auth phase UI is now production-grade
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to forge your future?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Clean auth, polished design, real user data on dashboard. Backend
            problem modules come next.
          </p>

          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button
              size="lg"
              className="gradient-primary text-primary-foreground border-0 px-8 glow-sm rounded-full"
            >
              {isAuthenticated ? "Open Dashboard" : "Get Started for Free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}