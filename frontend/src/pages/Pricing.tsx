import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  createSubscriptionCheckoutApi,
  getPublicPricingPlansApi,
  loadRazorpayScript,
  type PublicPlan,
} from "@/api/billing.api";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const formatMoney = (amountInPaise: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountInPaise / 100);

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlanCode, setLoadingPlanCode] = useState<string | null>(null);

  const role = user?.role || "USER";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await getPublicPricingPlansApi();
        setPlans(response?.data || []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load pricing plans"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const freePlan = useMemo(
    () => plans.find((plan) => plan.code === "FREE"),
    [plans]
  );

  const paidPlans = useMemo(
    () => plans.filter((plan) => plan.code !== "FREE"),
    [plans]
  );

  const handleBuy = async (planCode: "STANDARD" | "PRO") => {
    try {
      if (!isAuthenticated) {
        toast.info("Login first to continue");
        return;
      }

      setLoadingPlanCode(planCode);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout");
        return;
      }

      const response = await createSubscriptionCheckoutApi(planCode);
      const checkout = response?.data;

      if (!checkout?.razorpayKeyId || !checkout?.subscriptionId) {
        toast.error("Invalid checkout response from server");
        return;
      }

      const razorpay = new (window as any).Razorpay({
        key: checkout.razorpayKeyId,
        subscription_id: checkout.subscriptionId,
        name: "AlgoForge",
        description: `${checkout.plan} subscription`,
        prefill: {
          name: checkout.user?.name || "",
          email: checkout.user?.email || "",
        },
        theme: {
          color: "#7c5cff",
        },
        modal: {
          ondismiss: () => {
            toast.info("Checkout closed");
          },
        },
      });

      razorpay.open();
    } catch (error: any) {
      toast.error(error?.message || "Failed to start subscription checkout");
    } finally {
      setLoadingPlanCode(null);
    }
  };

  if (role === "CREATOR" || role === "ADMIN") {
    return (
      <Navigate
        to={role === "ADMIN" ? "/admin-dashboard" : "/creator-dashboard"}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-12 md:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Pricing
            </div>

            <h1 className="mt-8 font-heading text-4xl font-black md:text-6xl">
              Clean pricing.
              <span className="block text-muted-foreground">
                Only for users who actually need it.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
              Free should be useful. Paid plans should clearly unlock more value.
              Broken checkout is garbage product behavior, so this flow is now direct.
            </p>
          </div>

          <div className="mt-10 rounded-[1.8rem] border border-border/70 bg-card/75 p-5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="font-semibold">Simple conversion path</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Pricing is meant for users. Creator and admin are not the buying persona.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-10 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading pricing...
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {freePlan && (
                <div className="rounded-[1.9rem] border border-border/70 bg-card/80 p-8 backdrop-blur-xl">
                  <h2 className="font-heading text-2xl font-black">
                    {freePlan.name}
                  </h2>
                  <p className="mt-8 text-5xl font-black tracking-tight">
                    {formatMoney(freePlan.amountInPaise, freePlan.currency)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Forever free
                  </p>

                  <div className="mt-8 space-y-3">
                    {freePlan.features.map((item) => (
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
                    Current baseline
                  </Button>
                </div>
              )}

              {paidPlans.map((plan) => (
                <div
                  key={plan.code}
                  className="relative overflow-hidden rounded-[1.9rem] border border-primary/20 bg-card p-8 shadow-[0_20px_60px_rgba(99,102,241,0.10)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_24%)]" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      <Crown className="h-3.5 w-3.5" />
                      {plan.code === "PRO" ? "Most powerful" : "Popular"}
                    </div>

                    <h2 className="mt-5 font-heading text-2xl font-black">
                      {plan.name}
                    </h2>

                    <p className="mt-8 text-5xl font-black tracking-tight">
                      {formatMoney(plan.amountInPaise, plan.currency)}
                      <span className="ml-1 text-lg font-semibold text-muted-foreground">
                        /mo
                      </span>
                    </p>

                    <div className="mt-8 space-y-3">
                      {plan.features.map((item) => (
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
                      onClick={() => handleBuy(plan.code as "STANDARD" | "PRO")}
                      disabled={loadingPlanCode !== null}
                      className="mt-8 h-12 w-full rounded-xl text-sm font-semibold"
                    >
                      {loadingPlanCode === plan.code
                        ? "Opening..."
                        : `Buy ${plan.name}`}
                      {loadingPlanCode !== plan.code && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-[1.8rem] border border-border/70 bg-card/70 p-6 text-sm leading-7 text-muted-foreground backdrop-blur-xl">
            If checkout still fails after this, the error will now be explicit instead of hiding behind a fake generic toast.
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}