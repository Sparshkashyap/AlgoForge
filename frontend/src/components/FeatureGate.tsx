import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles } from "lucide-react";

export default function FeatureGate({
  children,
  fallbackTitle = "Premium feature",
  fallbackText = "Upgrade your plan to access this feature.",
}: {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackText?: string;
}) {
  const { user } = useAuth();

  const allowed =
    user &&
    (user.role === "ADMIN" || ["STANDARD", "PRO"].includes(user.plan || "FREE"));

  if (!allowed) {
    return (
      <div className="rounded-[1.7rem] border border-yellow-500/20 bg-yellow-500/10 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-background/40 px-3 py-1 text-xs uppercase tracking-[0.16em] text-yellow-300">
              <Crown className="h-3.5 w-3.5" />
              Premium only
            </div>

            <h3 className="mt-4 font-heading text-lg font-bold text-yellow-200">
              {fallbackTitle}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-7 text-yellow-100/85">
              {fallbackText}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["AI-powered", "Focused workflow", "Unlocked on upgrade"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-yellow-500/20 bg-background/35 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-yellow-200/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <Link to="/upgrade" className="shrink-0">
            <Button className="rounded-xl bg-primary text-primary-foreground shadow-[0_14px_34px_rgba(100,90,255,0.18)]">
              <Lock className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}