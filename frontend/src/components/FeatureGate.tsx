import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
      <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
        <h3 className="font-semibold text-amber-300">{fallbackTitle}</h3>
        <p className="mt-2 text-sm text-amber-200/90">{fallbackText}</p>
        <Link to="/upgrade" className="mt-4 inline-block">
          <Button className="rounded-xl">Upgrade</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}