export default function ProblemConstraints({
  constraints,
}: {
  constraints?: string | null;
}) {
  if (!constraints || !constraints.trim()) return null;

  return (
    <div className="rounded-2xl border border-border bg-background/90 p-4 backdrop-blur-sm">
      <h3 className="mb-3 font-semibold text-foreground">Constraints</h3>

      <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
        <pre className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
          {constraints}
        </pre>
      </div>
    </div>
  );
}