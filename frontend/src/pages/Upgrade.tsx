import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import { createSubscriptionCheckoutApi } from "@/api/billing.api";
import { motion } from "framer-motion";
import { Crown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Upgrade() {
  const openCheckout = async (tier: "STANDARD" | "PRO") => {
    try {
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        toast.error("Failed to load Razorpay checkout");
        return;
      }

      const data = await createSubscriptionCheckoutApi(tier);
      const checkout = data.data;

      const options = {
        key: checkout.razorpayKeyId,
        subscription_id: checkout.subscriptionId,
        name: "AlgoForge",
        description: `${tier} Plan`,
        prefill: {
          name: checkout.user.name,
          email: checkout.user.email,
        },
        theme: {
          color: "#6d5efc",
        },
        handler: function () {
          toast.success(`${tier} subscription started successfully`);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to start subscription checkout"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-12 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="spotlight-card overflow-hidden p-6 md:p-8">
              <div className="feature-glow absolute inset-0 opacity-80" />
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Upgrade plans
                </div>

                <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-6xl">
                  Upgrade only when the workflow justifies it.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
                  Unlock premium AI hints, AI code review, premium problems,
                  and deeper platform features without turning pricing into a mess.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "Premium AI access",
                    "Better problem coverage",
                    "Cleaner upgrade path",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/70 bg-background/55 px-4 py-2 text-xs uppercase tracking-[0.16em] text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="metric-card">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Free
                </p>
                <p className="mt-2 text-lg font-semibold">Base access</p>
              </div>

              <div className="metric-card">
                <Zap className="h-5 w-5 text-amber-400" />
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Standard
                </p>
                <p className="mt-2 text-lg font-semibold">₹299 / mo</p>
              </div>

              <div className="metric-card">
                <Crown className="h-5 w-5 text-yellow-400" />
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Pro
                </p>
                <p className="mt-2 text-lg font-semibold">₹599 / mo</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.9rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl">
              <h3 className="font-heading text-xl font-black">Free</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Basic solving access
              </p>
              <div className="mt-6 text-4xl font-black">₹0</div>

              <div className="mt-6 space-y-3">
                {[
                  "Basic solving flow",
                  "Public problems access",
                  "Starter experience",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-border/70 bg-background/50 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <Button
                className="mt-6 w-full rounded-xl"
                variant="outline"
                disabled
              >
                Current Base Plan
              </Button>
            </div>

            <PricingCard
              title="Standard"
              price="₹299/mo"
              description="Premium AI and premium problems"
              highlighted
              onChoose={() => openCheckout("STANDARD")}
            />

            <PricingCard
              title="Pro"
              price="₹599/mo"
              description="All premium features and advanced access"
              onChoose={() => openCheckout("PRO")}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}