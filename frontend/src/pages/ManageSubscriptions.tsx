import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { motion } from "framer-motion";
import { Crown, Loader2, IndianRupee, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import API from "@/api/axios";
import { toast } from "react-toastify";

type PricingCatalog = Record<
  "FREE" | "STANDARD" | "PRO",
  {
    code: string;
    name: string;
    amountInPaise: number;
    currency: string;
    active: boolean;
    visibleToRoles: string[];
    features: string[];
  }
>;

export default function ManageSubscriptions() {
  const [pricing, setPricing] = useState<PricingCatalog | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const [pricingRes, subsRes] = await Promise.all([
        API.get("/admin/pricing"),
        API.get("/admin/billing/subscriptions").catch(() => ({ data: { data: [] } })),
      ]);

      setPricing(pricingRes?.data?.data || null);
      setSubscriptions(subsRes?.data?.data || []);
    } catch {
      toast.error("Failed to load subscription controls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handlePriceChange = (
    code: "FREE" | "STANDARD" | "PRO",
    rupees: number
  ) => {
    if (!pricing) return;

    setPricing({
      ...pricing,
      [code]: {
        ...pricing[code],
        amountInPaise: Math.max(0, Number(rupees || 0) * 100),
      },
    });
  };

  const savePricing = async () => {
    if (!pricing) return;

    try {
      setSaving(true);
      await API.put("/admin/pricing", pricing);
      toast.success("Pricing updated");
    } catch {
      toast.error("Failed to save pricing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h1 className="font-heading text-3xl font-black md:text-4xl">
                Manage Subscriptions
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Admin controls pricing. Users buy. Creators do not.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading subscription controls...
              </div>
            ) : (
              <>
                {pricing && (
                  <div className="grid gap-4 md:grid-cols-3">
                    {(["FREE", "STANDARD", "PRO"] as const).map((code) => (
                      <div
                        key={code}
                        className="rounded-2xl border border-border bg-card p-5"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">
                            {pricing[code].name}
                          </h3>
                          {code !== "FREE" && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                              <Crown className="h-3 w-3" />
                              Paid
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <label className="text-sm text-muted-foreground">
                            Monthly price (₹)
                          </label>
                          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border px-3">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <input
                              type="number"
                              className="h-12 w-full bg-transparent outline-none"
                              value={Math.round(
                                pricing[code].amountInPaise / 100
                              )}
                              onChange={(e) =>
                                handlePriceChange(code, Number(e.target.value))
                              }
                              disabled={code === "FREE"}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Visible to
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pricing[code].visibleToRoles.map((role) => (
                              <Badge key={role} variant="outline">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  className="mt-5 rounded-xl"
                  onClick={savePricing}
                  disabled={saving || !pricing}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save pricing"}
                </Button>

                <div className="mt-8">
                  <h2 className="font-heading text-2xl font-black">
                    Active subscriptions
                  </h2>

                  {subscriptions.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                      No subscription records found.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4">
                      {subscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="rounded-2xl border border-border bg-card p-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-lg">
                                  {sub.user?.name || "Unknown User"}
                                </h3>

                                <Badge variant="outline">
                                  {sub.user?.email}
                                </Badge>

                                <Badge variant="outline">{sub.plan}</Badge>
                              </div>

                              <div className="mt-3 text-sm text-muted-foreground space-y-1">
                                <p>Status: {sub.status}</p>
                                <p>
                                  Ends:{" "}
                                  {sub.currentPeriodEnd
                                    ? new Date(
                                        sub.currentPeriodEnd
                                      ).toLocaleDateString()
                                    : "-"}
                                </p>
                              </div>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              ID: {sub.razorpaySubscriptionId || "N/A"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}