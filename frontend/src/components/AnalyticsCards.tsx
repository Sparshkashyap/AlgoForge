// AnalyticsCards.tsx

import { Users, Shield, UserCheck, FileText, Send, Sparkles } from "lucide-react";

export default function AnalyticsCards({
  totals,
}: {
  totals: Record<string, number>;
}) {
  const cards = [
    {
      label: "Users",
      value: totals.totalUsers ?? 0,
      icon: Users,
    },
    {
      label: "Creators",
      value: totals.totalCreators ?? 0,
      icon: UserCheck,
    },
    {
      label: "Admins",
      value: totals.totalAdmins ?? 0,
      icon: Shield,
    },
    {
      label: "Problems",
      value: totals.totalProblems ?? 0,
      icon: FileText,
    },
    {
      label: "Submissions",
      value: totals.totalSubmissions ?? 0,
      icon: Send,
    },
    {
      label: "Premium",
      value: totals.premiumUsers ?? 0,
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/85 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
          >
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-pink-500/10" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {card.label}
                </p>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black tracking-tight">
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}