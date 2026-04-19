import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import SplashScreen from "@/components/SplashScreen";

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

const queryClient = new QueryClient();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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

            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:slug" element={<ProblemDetails />} />
            <Route path="/daily-question" element={<DailyQuestion />} />
            <Route path="/upgrade" element={<Upgrade />} />

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
              path="/creator-dashboard"
              element={
                <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />

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
              path="/manage-problems"
              element={
                <ProtectedRoute allowRoles={["CREATOR", "ADMIN"]}>
                  <ManageProblems />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}