import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import BillingSummary from "@/components/BillingSummary";
import {
  cancelMySubscriptionApi,
  getMyBillingApi,
} from "@/api/billing.api";
import { Button } from "@/components/ui/button";

export default function Billing() {
  const [billing, setBilling] = useState<any>(null);

  const loadBilling = async () => {
    const data = await getMyBillingApi();
    setBilling(data.data);
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const handleCancel = async () => {
    await cancelMySubscriptionApi();
    await loadBilling();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16">
        <h1 className="font-heading text-4xl font-bold">Billing</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your current subscription and billing status.
        </p>

        <div className="mt-8 max-w-xl">
          <BillingSummary
            plan={billing?.plan}
            status={billing?.subscriptionStatus}
            currentPeriodEnd={billing?.currentPeriodEnd}
          />

          {billing?.razorpaySubscriptionId ? (
            <Button onClick={handleCancel} variant="outline" className="mt-6 rounded-xl">
              Cancel at end of billing cycle
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}