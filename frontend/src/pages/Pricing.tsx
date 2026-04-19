import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { createOrderApi } from "@/api/billing.api";
import { toast } from "react-toastify";

const freeFeatures = [
  "Basic problem access",
  "Limited AI hints",
  "Basic dashboard",
  "Public practice flow",
];

const proFeatures = [
  "All problems unlocked",
  "Advanced AI hints",
  "Premium roadmaps",
  "Contest access",
  "Priority feature access",
  "Deeper progress workflow",
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);
      const response = await createOrderApi(49900);
      console.log("Razorpay order:", response.data.data);
      toast.success("Order created. Next step: Razorpay checkout integration.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-12 md:py-16"
      >
        <div className="mx-auto max-w-5xl">
          {/* HERO */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Pricing
            </div>

            <h1 className="mt-8 font-heading text-4xl font-black md:text-6xl">
              Simple pricing.
              <span className="block text-muted-foreground">
                Pay only when the product earns it.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
              Start free, use the workflow, then upgrade when you actually need
              deeper AI help, premium practice surfaces, and contest access.
            </p>
          </div>

          {/* TOP NOTE */}
          <div className="mt-10 rounded-[1.8rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="font-semibold">No bloated pricing structure</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  One free tier. One serious paid tier. Cleaner decisions convert
                  better than fake complexity.
                </p>
              </div>
            </div>
          </div>

          {/* CARDS */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* FREE */}
            <div className="rounded-[1.9rem] border border-border/70 bg-card/80 p-8 backdrop-blur-xl">
              <h2 className="font-heading text-2xl font-black">Free</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                For getting started properly
              </p>

              <p className="mt-8 text-5xl font-black tracking-tight">₹0</p>
              <p className="mt-2 text-sm text-muted-foreground">Forever free</p>

              <div className="mt-8 space-y-3">
                {freeFeatures.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/45 px-4 py-3 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-8 h-12 w-full rounded-xl"
              >
                Current Plan
              </Button>
            </div>

            {/* PRO */}
            <div className="relative overflow-hidden rounded-[1.9rem] border border-primary/30 bg-card p-8 shadow-[0_20px_60px_rgba(99,102,241,0.16)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.10),transparent_24%)]" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <Crown className="h-3.5 w-3.5" />
                  Most valuable
                </div>

                <h2 className="mt-5 font-heading text-2xl font-black">Pro</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  For serious interview prep
                </p>

                <p className="mt-8 text-5xl font-black tracking-tight">
                  ₹499
                  <span className="ml-1 text-lg font-semibold text-muted-foreground">
                    /mo
                  </span>
                </p>

                <div className="mt-8 space-y-3">
                  {proFeatures.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/45 px-4 py-3 text-sm"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={handleBuy}
                  disabled={loading}
                  className="mt-8 h-12 w-full rounded-xl text-sm font-semibold"
                >
                  {loading ? "Creating Order..." : "Upgrade to Pro"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* BOTTOM NOTE */}
          <div className="mt-10 rounded-[1.8rem] border border-border/70 bg-card/70 p-6 text-sm leading-7 text-muted-foreground backdrop-blur-xl">
            Free should be useful. Pro should feel obviously worth paying for.
            Anything in between is just confused product strategy.
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}