import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import BillingSummary from "@/components/BillingSummary";
import {
  cancelMySubscriptionApi,
  createSubscriptionCheckoutApi,
  getMyBillingApi,
  loadRazorpayScript,
} from "@/api/billing.api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

type Tier = "STANDARD" | "PRO";

type BillingData = {
  plan?: string | null;
  subscriptionStatus?: string | null;
  currentPeriodEnd?: string | null;
  razorpaySubscriptionId?: string | null;
};

export default function Billing() {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<Tier | null>(null);

  const loadBilling = async () => {
    try {
      setLoading(true);
      const data = await getMyBillingApi();
      setBilling(data.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load billing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBilling();
  }, []);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelMySubscriptionApi();
      toast.success("Subscription will be cancelled at period end");
      await loadBilling();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  const startCheckout = async (tier: Tier) => {
    try {
      setCheckoutLoading(tier);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout");
        return;
      }

      const response = await createSubscriptionCheckoutApi(tier);
      const checkout = response.data;

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
            void loadBilling();
          },
        },
        handler: () => {
          toast.success("Payment initiated successfully");
          setTimeout(() => {
            void loadBilling();
          }, 2000);
        },
      });

      razorpay.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(null);
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
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="spotlight-card p-6 md:p-8">
            <div className="feature-glow absolute inset-0 opacity-80" />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <CreditCard className="h-3.5 w-3.5 text-primary" />
                Billing
              </div>

              <h1 className="mt-6 font-heading text-4xl font-black leading-tight md:text-5xl">
                Manage your subscription clearly.
              </h1>

              <p className="mt-4 text-sm leading-8 text-muted-foreground md:text-base">
                No hidden state, no confusion. Your plan, billing status, and
                renewal timeline should always be obvious.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Current plan
              </p>
              <p className="mt-3 font-heading text-2xl font-bold">
                {billing?.plan || "FREE"}
              </p>
            </div>

            <div className="metric-card">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Status
              </p>
              <p className="mt-3 font-heading text-2xl font-bold">
                {billing?.subscriptionStatus || "inactive"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_0.92fr]">
          <div>
            {loading ? (
              <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Loading billing details...
              </div>
            ) : (
              <BillingSummary
                plan={billing?.plan}
                status={billing?.subscriptionStatus}
                currentPeriodEnd={billing?.currentPeriodEnd}
                subscriptionId={billing?.razorpaySubscriptionId}
              />
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="spotlight-card p-6">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Standard
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-black">
                    STANDARD
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Better practice flow, paid access, cleaner unlock path.
                  </p>

                  <Button
                    className="mt-6 w-full rounded-xl"
                    onClick={() => void startCheckout("STANDARD")}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === "STANDARD"
                      ? "Opening..."
                      : "Buy Standard"}
                  </Button>
                </div>
              </div>

              <div className="spotlight-card p-6">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Pro
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-black">
                    PRO
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Full premium path with the strongest access layer.
                  </p>

                  <Button
                    className="mt-6 w-full rounded-xl"
                    onClick={() => void startCheckout("PRO")}
                    disabled={checkoutLoading !== null}
                  >
                    {checkoutLoading === "PRO" ? "Opening..." : "Buy Pro"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="spotlight-card p-6 md:p-8">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <AlertTriangle className="h-3.5 w-3.5 text-primary" />
                Subscription controls
              </div>

              <h2 className="mt-6 font-heading text-3xl font-black">
                Cancel if needed
              </h2>

              <p className="mt-3 text-sm leading-8 text-muted-foreground">
                If your subscription is active and you want to stop renewal, you
                can cancel it here.
              </p>

              <Button
                variant="outline"
                className="mt-6 w-full rounded-xl"
                onClick={() => void handleCancel()}
                disabled={cancelling || !billing?.razorpaySubscriptionId}
              >
                {cancelling ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}