import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { getAllSubscriptionsApi } from "@/api/adminBilling.api";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Crown, Loader2 } from "lucide-react";

export default function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSubscriptionsApi()
      .then((res) => setSubscriptions(res.data || []))
      .finally(() => setLoading(false));
  }, []);

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
                Monitor user plans, subscription status, and billing lifecycle.
              </p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Loading subscriptions...
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                No subscriptions found.
              </div>
            ) : (
              <div className="grid gap-4">
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

                          <Badge
                            variant="outline"
                            className={
                              sub.status === "active"
                                ? "text-emerald-400 border-emerald-400/30"
                                : "text-amber-400 border-amber-400/30"
                            }
                          >
                            {sub.status}
                          </Badge>

                          {sub.plan === "PREMIUM" && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-400">
                              <Crown className="h-3 w-3" />
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="mt-3 text-sm text-muted-foreground space-y-1">
                          <p>
                            Plan: <span className="font-medium">{sub.plan}</span>
                          </p>
                          <p>
                            Started:{" "}
                            {sub.startDate
                              ? new Date(sub.startDate).toLocaleDateString()
                              : "-"}
                          </p>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}