import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RoleGate({
  allow,
  children,
}: {
  allow: Array<"USER" | "CREATOR" | "ADMIN">;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}