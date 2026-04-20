import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import SplashScreen from "@/components/SplashScreen";
import { useRealtimeUserChannel } from "@/hooks/useRealtimeUserChannel";

import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Problems from "@/pages/Problems";
import ProblemDetails from "@/pages/ProblemDetails";
import CreateProblemPage from "@/pages/CreateProblem";
import ManageProblems from "@/pages/ManageProblems";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import Upgrade from "@/pages/Upgrade";
import Billing from "@/pages/Billing";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import DailyQuestion from "@/pages/DailyQuestion";
import AdminExports from "@/pages/AdminExports";
import AdminDashboard from "@/pages/AdminDashboard";
import CreatorDashboard from "@/pages/CreatorDashboard";
import Notifications from "@/pages/Notifications";
import Contests from "@/pages/Contests";
import ContestDetails from "@/pages/ContestDetails";
import ManageContests from "@/pages/ManageContests";
import CreateContest from "@/pages/CreateContest";
import AdminUsers from "@/pages/AdminUsers";
import AdminAuditLogs from "@/pages/AdminAuditLogs";

const queryClient = new QueryClient();

function AppShell() {
  const [showSplash, setShowSplash] = useState(true);

  useRealtimeUserChannel();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TooltipProvider>
      <BrowserRouter>
        <SplashScreen show={showSplash} />

        <Routes>
          {/* public */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetails />} />

          <Route path="/daily-question" element={<DailyQuestion />} />
          <Route path="/upgrade" element={<Upgrade />} />

          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:contestId" element={<ContestDetails />} />

          {/* user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowRoles={["USER", "CREATOR", "ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowRoles={["USER", "CREATOR", "ADMIN"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute allowRoles={["USER", "CREATOR", "ADMIN"]}>
                <Billing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowRoles={["USER", "CREATOR", "ADMIN"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* creator */}
          <Route
            path="/creator-dashboard"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <CreatorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-problems"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <ManageProblems />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-problem"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <CreateProblemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-problem/:problemId"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <CreateProblemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-contests"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <ManageContests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-contest"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <CreateContest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-contest/:contestId"
            element={
              <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                <CreateContest />
              </ProtectedRoute>
            }
          />

          {/* admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-exports"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <AdminExports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-users"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-audit-logs"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <AdminAuditLogs />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="colored"
        />
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}