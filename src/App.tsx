import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
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
import DiagnosticTest from "./pages/DiagnosticTest";
import Chat from "./pages/Chat";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import OnboardingResult from "./pages/OnboardingResult";

// Parent pages
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentChild from "./pages/parent/ParentChild";
import ParentMedical from "./pages/parent/ParentMedical";

// Club pages
import ClubDashboard from "./pages/club/ClubDashboard";
import Roster from "./pages/club/Roster";
import TrainingLoad from "./pages/club/TrainingLoad";
import Reports from "./pages/club/Reports";
import Communication from "./pages/club/Communication";

// Classroom pages
import Classroom from "./pages/Classroom";
import ClassroomModule from "./pages/ClassroomModule";
import ClassroomLesson from "./pages/ClassroomLesson";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminCourses from "./pages/admin/Courses";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DemoProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<RouteGuard allowedRoles={['player','parent','coach','club_admin','admin']}><Onboarding /></RouteGuard>} />
              <Route path="/onboarding-result" element={<RouteGuard allowedRoles={['player','parent','coach','club_admin','admin']}><OnboardingResult /></RouteGuard>} />
              <Route path="/register" element={<Register />} />

              {/* Player routes */}
              <Route path="/dashboard" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Dashboard /></RouteGuard>} />
              <Route path="/profile" element={<RouteGuard allowedRoles={['player', 'parent', 'coach', 'club_admin', 'admin']}><Profile /></RouteGuard>} />
              <Route path="/calendar" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Calendar /></RouteGuard>} />
              <Route path="/training" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Training /></RouteGuard>} />
              <Route path="/chat" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Chat /></RouteGuard>} />
              <Route path="/settings" element={<RouteGuard allowedRoles={['player', 'parent', 'coach', 'club_admin', 'admin']}><Settings /></RouteGuard>} />
              <Route path="/leaderboard" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Leaderboard /></RouteGuard>} />
              <Route path="/achievements" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Achievements /></RouteGuard>} />
              <Route path="/diagnostic" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><DiagnosticTest /></RouteGuard>} />

              {/* Classroom routes */}
              <Route path="/classroom" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><Classroom /></RouteGuard>} />
              <Route path="/classroom/:moduleId" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><ClassroomModule /></RouteGuard>} />
              <Route path="/classroom/:moduleId/lesson/:lessonId" element={<RouteGuard allowedRoles={['player', 'coach', 'club_admin', 'admin']}><ClassroomLesson /></RouteGuard>} />

              {/* Parent routes */}
              <Route path="/parent/dashboard" element={<RouteGuard allowedRoles={['parent']}><ParentDashboard /></RouteGuard>} />
              <Route path="/parent/child" element={<RouteGuard allowedRoles={['parent']}><ParentChild /></RouteGuard>} />
              <Route path="/parent/child/:childId" element={<RouteGuard allowedRoles={['parent']}><ParentChild /></RouteGuard>} />
              <Route path="/parent/medical" element={<RouteGuard allowedRoles={['parent']}><ParentMedical /></RouteGuard>} />

              {/* Club routes */}
              <Route path="/club/dashboard" element={<RouteGuard allowedRoles={['coach', 'club_admin', 'admin']}><ClubDashboard /></RouteGuard>} />
              <Route path="/club/roster" element={<RouteGuard allowedRoles={['coach', 'club_admin', 'admin']}><Roster /></RouteGuard>} />
              <Route path="/club/reports" element={<RouteGuard allowedRoles={['coach', 'club_admin', 'admin']}><Reports /></RouteGuard>} />
              <Route path="/club/training-load" element={<RouteGuard allowedRoles={['coach', 'club_admin', 'admin']}><TrainingLoad /></RouteGuard>} />
              <Route path="/club/communication" element={<RouteGuard allowedRoles={['coach', 'club_admin', 'admin']}><Communication /></RouteGuard>} />

              {/* Admin routes */}
              <Route path="/admin/dashboard" element={<RouteGuard allowedRoles={['admin']}><AdminDashboard /></RouteGuard>} />
              <Route path="/admin/users" element={<RouteGuard allowedRoles={['admin']}><Users /></RouteGuard>} />
              <Route path="/admin/analytics" element={<RouteGuard allowedRoles={['admin']}><Analytics /></RouteGuard>} />
              <Route path="/admin/settings" element={<RouteGuard allowedRoles={['admin']}><AdminSettings /></RouteGuard>} />
              <Route path="/admin/courses" element={<RouteGuard allowedRoles={['admin']}><AdminCourses /></RouteGuard>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </DemoProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
