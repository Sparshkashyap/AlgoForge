import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import { useEffect, useState, type ReactNode } from "react";

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
import Pricing from "@/pages/Pricing";
import ManageSubscriptions from "@/pages/ManageSubscriptions";
import Leaderboard from "@/pages/Leaderboard";
import ContestRanking from "@/pages/ContestRanking";
import SubmissionAnalytics from "@/pages/SubmissionAnalytics";
import AiMentor from "@/pages/AiMentor";
import Bookmarks from "@/pages/Bookmarks";
import AiChat from "@/pages/AiChat";
import AdminSales from "@/pages/AdminSales";
import AdminProblemReview from "@/pages/AdminProblemReview";
import Roadmap from "@/pages/Roadmap";

const queryClient = new QueryClient();

type Role = "USER" | "CREATOR" | "ADMIN";

function withProtection(children: ReactNode, allowRoles: Role[]) {
  return <ProtectedRoute allowRoles={allowRoles}>{children}</ProtectedRoute>;
}

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
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/upgrade" element={<Upgrade />} />

          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetails />} />

          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:contestId" element={<ContestDetails />} />
          <Route
            path="/contests/:contestId/ranking"
            element={<ContestRanking />}
          />

          <Route path="/daily-question" element={<DailyQuestion />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route
            path="/dashboard"
            element={withProtection(
              <Dashboard />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/roadmap"
            element={withProtection(
              <Roadmap />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/profile"
            element={withProtection(
              <Profile />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/notifications"
            element={withProtection(
              <Notifications />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/bookmarks"
            element={withProtection(
              <Bookmarks />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/ai-chat"
            element={withProtection(
              <AiChat />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/submission-analytics"
            element={withProtection(
              <SubmissionAnalytics />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/ai-mentor"
            element={withProtection(
              <AiMentor />,
              ["USER", "CREATOR", "ADMIN"]
            )}
          />

          <Route
            path="/billing"
            element={withProtection(<Billing />, ["USER"])}
          />

          <Route
            path="/creator-dashboard"
            element={withProtection(
              <CreatorDashboard />,
              ["CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/manage-problems"
            element={withProtection(
              <ManageProblems />,
              ["CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/create-problem"
            element={withProtection(
              <CreateProblemPage />,
              ["CREATOR", "ADMIN"]
            )}
          />
          <Route
            path="/create-problem/:problemId"
            element={withProtection(
              <CreateProblemPage />,
              ["CREATOR", "ADMIN"]
            )}
          />

          <Route
            path="/admin-dashboard"
            element={withProtection(<AdminDashboard />, ["ADMIN"])}
          />
          <Route
            path="/admin-sales"
            element={withProtection(<AdminSales />, ["ADMIN"])}
          />
          <Route
            path="/admin-problem-review"
            element={withProtection(<AdminProblemReview />, ["ADMIN"])}
          />
          <Route
            path="/admin-exports"
            element={withProtection(<AdminExports />, ["ADMIN"])}
          />
          <Route
            path="/admin-users"
            element={withProtection(<AdminUsers />, ["ADMIN"])}
          />
          <Route
            path="/admin-audit-logs"
            element={withProtection(<AdminAuditLogs />, ["ADMIN"])}
          />
          <Route
            path="/admin-subscriptions"
            element={withProtection(<ManageSubscriptions />, ["ADMIN"])}
          />
          <Route
            path="/manage-contests"
            element={withProtection(<ManageContests />, ["ADMIN"])}
          />
          <Route
            path="/create-contest"
            element={withProtection(<CreateContest />, ["ADMIN"])}
          />
          <Route
            path="/create-contest/:contestId"
            element={withProtection(<CreateContest />, ["ADMIN"])}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={2000} theme="colored" />
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