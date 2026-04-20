export default function BillingSummary({
  plan,
  status,
  currentPeriodEnd,
  subscriptionId,
}: {
  plan?: string | null;
  status?: string | null;
  currentPeriodEnd?: string | null;
  subscriptionId?: string | null;
}) {
  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl space-y-5">
      <h3 className="font-heading text-xl font-bold">Billing Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/70 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.12em]">
            Plan
          </p>
          <p className="mt-2 text-lg font-semibold">{plan || "FREE"}</p>
        </div>

        <div className="rounded-xl border border-border/70 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.12em]">
            Status
          </p>
          <p className="mt-2 text-lg font-semibold">{status || "inactive"}</p>
        </div>

        <div className="col-span-2 rounded-xl border border-border/70 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.12em]">
            Billing Period Ends
          </p>
          <p className="mt-2 text-lg font-semibold">
            {currentPeriodEnd
              ? new Date(currentPeriodEnd).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div className="col-span-2 rounded-xl border border-border/70 p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.12em]">
            Subscription ID
          </p>
          <p className="mt-2 break-all text-sm font-semibold">
            {subscriptionId || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}