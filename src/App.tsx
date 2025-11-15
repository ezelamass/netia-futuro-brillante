import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/RouteGuard";

// Public pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Student pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import Training from "./pages/Training";
import Chat from "./pages/Chat";

// Club pages
import ClubDashboard from "./pages/club/ClubDashboard";
import Roster from "./pages/club/Roster";
import Reports from "./pages/club/Reports";
import Communication from "./pages/club/Communication";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student routes */}
            <Route
              path="/dashboard"
              element={
                <RouteGuard allowedRoles={['student', 'coach', 'admin']}>
                  <Dashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <RouteGuard allowedRoles={['student', 'coach', 'admin']}>
                  <Profile />
                </RouteGuard>
              }
            />
            <Route
              path="/calendar"
              element={
                <RouteGuard allowedRoles={['student', 'coach', 'admin']}>
                  <Calendar />
                </RouteGuard>
              }
            />
            <Route
              path="/training"
              element={
                <RouteGuard allowedRoles={['student', 'coach', 'admin']}>
                  <Training />
                </RouteGuard>
              }
            />
            <Route
              path="/chat"
              element={
                <RouteGuard allowedRoles={['student', 'coach', 'admin']}>
                  <Chat />
                </RouteGuard>
              }
            />

            {/* Club routes */}
            <Route
              path="/club/dashboard"
              element={
                <RouteGuard allowedRoles={['coach', 'admin']}>
                  <ClubDashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/club/roster"
              element={
                <RouteGuard allowedRoles={['coach', 'admin']}>
                  <Roster />
                </RouteGuard>
              }
            />
            <Route
              path="/club/reports"
              element={
                <RouteGuard allowedRoles={['coach', 'admin']}>
                  <Reports />
                </RouteGuard>
              }
            />
            <Route
              path="/club/communication"
              element={
                <RouteGuard allowedRoles={['coach', 'admin']}>
                  <Communication />
                </RouteGuard>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <Users />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <Analytics />
                </RouteGuard>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RouteGuard allowedRoles={['admin']}>
                  <Settings />
                </RouteGuard>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
