export default function AnalyticsCards({
  totals,
}: {
  totals: Record<string, number>;
}) {
  const cards = [
    { label: "Users", value: totals.totalUsers ?? 0 },
    { label: "Creators", value: totals.totalCreators ?? 0 },
    { label: "Admins", value: totals.totalAdmins ?? 0 },
    { label: "Problems", value: totals.totalProblems ?? 0 },
    { label: "Submissions", value: totals.totalSubmissions ?? 0 },
    { label: "Premium Users", value: totals.premiumUsers ?? 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-3xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}