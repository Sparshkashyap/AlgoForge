import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DailyQuestionCard({
  title,
  slug,
  status,
}: {
  title: string;
  slug: string;
  status?: string | null;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">Daily Question</p>
      <h3 className="mt-2 font-heading text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Status: {status || "Not attempted"}
      </p>
      <Link to={`/problems/${slug}`} className="mt-5 inline-block">
        <Button className="rounded-xl">Open Problem</Button>
      </Link>
    </div>
  );
}