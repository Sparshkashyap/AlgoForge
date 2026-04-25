import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { motion } from "framer-motion";
import {
  Crown,
  Loader2,
  IndianRupee,
  Save,
  Users,
  TrendingUp,
} from "lucide-react";
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
        API.get("/admin/billing/subscriptions"),
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

  // 🔥 METRICS
  const activeCount = subscriptions.filter(
    (s) => s.status === "ACTIVE"
  ).length;

  const revenue =
    subscriptions.reduce((acc, s) => {
      if (s.status !== "ACTIVE") return acc;
      if (s.plan === "STANDARD") return acc + 499;
      if (s.plan === "PRO") return acc + 999;
      return acc;
    }, 0) || 0;

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
            {/* HEADER */}
            <div className="mb-6">
              <h1 className="font-heading text-3xl font-black md:text-4xl">
                Subscription Control
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage pricing, monitor users, and track revenue.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border bg-card p-6 flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading...
              </div>
            ) : (
              <>
                {/* 🔥 METRICS */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Active Users
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {activeCount}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      Monthly Revenue
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      ₹{revenue}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-card border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Plans Active
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {subscriptions.length}
                    </p>
                  </div>
                </div>

                {/* 🔥 PRICING CARDS */}
                {pricing && (
                  <div className="grid gap-4 md:grid-cols-3">
                    {(["FREE", "STANDARD", "PRO"] as const).map((code) => (
                      <div
                        key={code}
                        className={`rounded-2xl border p-5 bg-card ${
                          code === "PRO"
                            ? "border-amber-500 shadow-lg"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            {pricing[code].name}
                          </h3>

                          {code === "PRO" && (
                            <Badge className="bg-amber-500 text-black">
                              Best
                            </Badge>
                          )}
                        </div>

                        <div className="mt-4 flex items-center border rounded-xl px-3">
                          <IndianRupee className="h-4 w-4" />
                          <input
                            type="number"
                            className="h-12 w-full bg-transparent outline-none"
                            value={Math.round(
                              pricing[code].amountInPaise / 100
                            )}
                            onChange={(e) =>
                              handlePriceChange(
                                code,
                                Number(e.target.value)
                              )
                            }
                            disabled={code === "FREE"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  className="mt-5"
                  onClick={savePricing}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Pricing"}
                </Button>

                {/* 🔥 SUBSCRIPTIONS */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Active Subscriptions
                  </h2>

                  {subscriptions.length === 0 ? (
                    <div className="p-6 border rounded-2xl text-center text-muted-foreground">
                      No active subscriptions yet.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {subscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-5 rounded-2xl border bg-card hover:shadow-md transition"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {sub.user?.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {sub.user?.email}
                              </p>
                            </div>

                            <Badge
                             className={`
  inline-flex items-center justify-center
  h-8 px-4
  rounded-full
  text-xs font-semibold
  border transition-all duration-300
  ${
    sub.plan === "PRO"
      ? "border-emerald-400/60 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
      : sub.plan === "STANDARD"
      ? "border-blue-400/60 bg-blue-50 text-blue-700"
      : "border-gray-300 bg-gray-100 text-gray-600"
  }
`}
                            >
                              {sub.plan}
                            </Badge>
                          </div>

                          <div className="mt-3 text-sm text-muted-foreground">
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