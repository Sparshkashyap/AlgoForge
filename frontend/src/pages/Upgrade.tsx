import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import PricingCard from "@/components/PricingCard";
import { createSubscriptionCheckoutApi } from "@/api/billing.api";

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
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Failed to load Razorpay checkout");
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
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-16">
        <h1 className="font-heading text-4xl font-bold">Upgrade your plan</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Unlock premium AI hints, AI code review, premium problems, and deeper platform features.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-heading text-xl font-semibold">Free</h3>
            <p className="mt-2 text-muted-foreground">Basic solving access</p>
            <div className="mt-6 text-3xl font-bold">₹0</div>
            <Button className="mt-6 rounded-xl w-full" variant="outline" disabled>
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
    </div>
  );
}