export default function ProblemConstraints({
  constraints,
}: {
  constraints?: string | null;
}) {
  if (!constraints) return null;

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <h3 className="mb-2 font-semibold">Constraints</h3>
      <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
        {constraints}
      </pre>
    </div>
  );
}