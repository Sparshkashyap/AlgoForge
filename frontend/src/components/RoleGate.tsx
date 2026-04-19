import { ReactNode, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RoleGate({
  allow,
  children,
}: {
  allow: Array<"USER" | "CREATOR" | "ADMIN">;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();

  const redirectTo = useMemo(() => {
    if (!user) return "/login";

    if (user.role === "ADMIN") return "/admin-dashboard";
    if (user.role === "CREATOR") return "/creator-dashboard";
    return "/dashboard";
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            </div>

            <div>
              <p className="font-semibold">Checking access</p>
              <p className="text-sm text-muted-foreground">
                Verifying your account permissions...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !allow.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}