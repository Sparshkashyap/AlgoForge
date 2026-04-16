export default function BillingSummary({
  plan,
  status,
  currentPeriodEnd,
}: {
  plan?: string;
  status?: string | null;
  currentPeriodEnd?: string | null;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h3 className="font-heading text-xl font-semibold">Current Billing</h3>
      <p className="mt-4 text-sm text-muted-foreground">Plan</p>
      <p className="mt-1 text-2xl font-bold">{plan || "FREE"}</p>

      <p className="mt-4 text-sm text-muted-foreground">Status</p>
      <p className="mt-1 text-lg font-semibold">{status || "inactive"}</p>

      <p className="mt-4 text-sm text-muted-foreground">Period End</p>
      <p className="mt-1 text-lg font-semibold">
        {currentPeriodEnd ? new Date(currentPeriodEnd).toLocaleDateString() : "-"}
      </p>
    </div>
  );
}