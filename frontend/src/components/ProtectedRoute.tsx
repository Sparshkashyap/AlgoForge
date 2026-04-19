// import type { ReactNode } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// const ProtectedRoute = ({
//   children,
//   allowRoles,
// }: {
//   children: ReactNode;
//   allowRoles?: Array<"USER" | "CREATOR" | "ADMIN">;
// }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();

//   const getFallbackRoute = () => {
//     if (!user) return "/login";
//     if (user.role === "ADMIN") return "/admin-dashboard";
//     if (user.role === "CREATOR") return "/creator-dashboard";
//     return "/dashboard";
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
//         <div className="rounded-[1.8rem] border border-border/70 bg-card/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
//           <div className="flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10">
//               <Loader2 className="h-5 w-5 animate-spin text-primary" />
//             </div>

//             <div>
//               <p className="font-semibold">Checking your session</p>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 Verifying access and loading your workspace...
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace state={{ from: location.pathname }} />;
//   }

//   if (allowRoles && !allowRoles.includes(user.role)) {
//     return <Navigate to={getFallbackRoute()} replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;








import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({
  children,
  allowRoles,
}: {
  children: ReactNode;
  allowRoles?: Array<"USER" | "CREATOR" | "ADMIN">;
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Checking your session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
