import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import BillingSummary from "@/components/BillingSummary";
import {
  cancelMySubscriptionApi,
  getMyBillingApi,
} from "@/api/billing.api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function Billing() {
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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
    loadBilling();
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
          {/* HEADER / CONTEXT */}
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

          {/* QUICK INFO */}
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

        {/* MAIN CONTENT */}
        <div className="mt-10 max-w-xl">
          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Loading billing details...
            </div>
          ) : (
            <>
              <BillingSummary
                plan={billing?.plan}
                status={billing?.subscriptionStatus}
                currentPeriodEnd={billing?.currentPeriodEnd}
              />

              {billing?.razorpaySubscriptionId ? (
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    Cancelling will stop renewal. Access remains until the end of
                    the current billing cycle.
                  </div>

                  <Button
                    onClick={handleCancel}
                    disabled={cancelling}
                    variant="outline"
                    className="rounded-xl w-full"
                  >
                    {cancelling
                      ? "Cancelling..."
                      : "Cancel at end of billing cycle"}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  No active subscription. Upgrade to unlock premium features.
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}