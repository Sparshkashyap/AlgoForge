import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Brain, Code2, Trophy, Zap, Target, Users, Sparkles,
  BookOpen, TrendingUp, Shield, Star, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

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
  { icon: Brain, title: "AI-Powered Hints", desc: "Get intelligent hints that guide you to the solution without giving it away." },
  { icon: Code2, title: "Built-in Code Editor", desc: "Professional IDE experience with syntax highlighting, autocomplete, and test running." },
  { icon: Trophy, title: "Live Contests", desc: "Compete in weekly contests and climb the global leaderboard." },
  { icon: Target, title: "Interview Prep", desc: "Curated problem sets from top tech companies with detailed solutions." },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Visual dashboards to track your growth across topics and difficulty levels." },
  { icon: BookOpen, title: "Learning Roadmaps", desc: "Structured paths from beginner to advanced with AI-personalized recommendations." },
];

const categories = [
  { name: "Arrays & Hashing", count: 245, color: "from-blue-500 to-cyan-500" },
  { name: "Two Pointers", count: 120, color: "from-violet-500 to-purple-500" },
  { name: "Trees & Graphs", count: 310, color: "from-emerald-500 to-teal-500" },
  { name: "Dynamic Programming", count: 280, color: "from-orange-500 to-amber-500" },
  { name: "Binary Search", count: 95, color: "from-pink-500 to-rose-500" },
  { name: "Backtracking", count: 150, color: "from-indigo-500 to-blue-500" },
];

const testimonials = [
  { name: "Sarah Chen", role: "SWE @ Google", text: "AlgoForge's AI hints helped me think through problems differently. Landed my dream job in 3 months.", avatar: "SC" },
  { name: "Marcus Rodriguez", role: "CS Student", text: "The roadmap feature is incredible. I went from struggling with basics to solving medium problems consistently.", avatar: "MR" },
  { name: "Priya Sharma", role: "SWE @ Meta", text: "Best coding platform I've used. The contest system keeps me sharp and the community is amazing.", avatar: "PS" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Get started with core features",
    features: ["200+ free problems", "Basic code editor", "Community access", "Weekly contests"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    desc: "Everything you need to crack interviews",
    features: ["All 2,500+ problems", "AI-powered hints", "Company-specific prep", "Premium contests", "Learning roadmaps", "Priority support"],
    cta: "Start Pro Trial",
    featured: true,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
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
              <span className="gradient-text">Build Faster.</span>
              {" "}Crack Better.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Master data structures, algorithms, and system design with AI-guided learning paths,
              real-time contests, and interview-focused problem sets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 glow-sm">
                  Start Practicing Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/problems">
                <Button size="lg" variant="outline">
                  Browse Problems
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} className="text-center" {...fade(i * 0.1)}>
                <div className="font-heading text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <motion.div className="text-center mb-14" {...fade()}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Everything you need to level up</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">A complete platform designed to take you from beginner to interview-ready.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover-lift"
              {...fade(i * 0.08)}
            >
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:glow-sm transition-shadow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-card/30 border-y border-border">
        <div className="container py-20 md:py-28">
          <motion.div className="text-center mb-14" {...fade()}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Explore problem categories</h2>
            <p className="text-muted-foreground">Master every topic with curated problem sets.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="group p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer hover-lift"
                {...fade(i * 0.08)}
              >
                <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${cat.color} mb-4`} />
                <h3 className="font-heading font-semibold mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.count} problems</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="container py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fade()}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-6">
              <Brain className="h-3.5 w-3.5" />
              AI-Powered Learning
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Your personal AI coding mentor
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Get contextual hints, step-by-step breakdowns, and personalized learning recommendations.
              Our AI understands your coding style and adapts to your skill level.
            </p>
            <ul className="space-y-3">
              {["Smart hints without spoilers", "Debug assistance", "Personalized roadmaps", "Natural conversation"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <div className="h-5 w-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <Zap className="h-3 w-3 text-primary-foreground" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="relative" {...fade(0.2)}>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AlgoForge AI</p>
                  <p className="text-xs text-muted-foreground">Your coding assistant</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3 text-sm max-w-[80%]">
                  I'm stuck on this two-pointer problem. How should I approach it?
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-sm max-w-[85%] ml-auto border border-primary/20">
                  Think about maintaining a sliding window. Start with two pointers at the beginning, and expand the right pointer while tracking the condition. What constraint are you trying to satisfy?
                </div>
              </div>
            </div>
            <div className="absolute -z-10 inset-0 blur-3xl bg-primary/5 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card/30 border-y border-border">
        <div className="container py-20 md:py-28">
          <motion.div className="text-center mb-14" {...fade()}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Loved by developers worldwide</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="p-6 rounded-xl border border-border bg-card hover-lift"
                {...fade(i * 0.1)}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
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

      {/* Pricing Teaser */}
      <section className="container py-20 md:py-28">
        <motion.div className="text-center mb-14" {...fade()}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`p-8 rounded-xl border ${
                plan.featured ? "border-primary glow-sm bg-card" : "border-border bg-card"
              } hover-lift relative`}
              {...fade(i * 0.1)}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h3 className="font-heading text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-heading text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.featured ? "gradient-primary text-primary-foreground border-0" : ""}`} variant={plan.featured ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container py-20 md:py-28 text-center">
          <motion.div {...fade()}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">forge your future?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Join 150,000+ developers already practicing on AlgoForge.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 glow-sm">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
