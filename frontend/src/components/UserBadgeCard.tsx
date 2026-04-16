export default function UserBadgeCard({
  title,
  description,
  awardedAt,
}: {
  title: string;
  description: string;
  awardedAt: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        Awarded on {new Date(awardedAt).toLocaleDateString()}
      </p>
    </div>
  );
}