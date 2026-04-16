import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastContainer } from "react-toastify";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import CreateProblemPage from "./pages/CreateProblem";
import ManageProblems from "./pages/ManageProblems";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import Upgrade from "./pages/Upgrade";
import Billing from "./pages/Billing";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import DailyQuestion from "./pages/DailyQuestion";
import AdminExports from "./pages/AdminExports";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/upgrade" element={<Upgrade />} />

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/daily-question"
            element={<DailyQuestion />}
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
              <ProtectedRoute>
                <CreateProblemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-problem/:problemId"
            element={
              <ProtectedRoute>
                <CreateProblemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-problems"
            element={
              <ProtectedRoute>
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

export default App;