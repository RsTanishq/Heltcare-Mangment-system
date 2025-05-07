import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import MedicalRecords from "./pages/MedicalRecords";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatBox from "./pages/ChatBox";
import Settings from "./pages/Settings";
import Doctors from "./pages/Doctors";
import Shop from "./pages/Shop";
import Wallet from "./pages/Wallet";
import AdminAppointments from "./components/admin/AdminAppointments";
import PatientDashboard from "./pages/PatientDashboard";

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
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Patient routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <Dashboard role="patient" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient-dashboard"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <MedicalRecords role="patient" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <Doctors />
                </ProtectedRoute>
              }
            />

            {/* Doctor routes */}
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-records"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <MedicalRecords role="doctor" />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" content={<AdminAppointments />} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/medical-records"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/messages"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pharmacy"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />

            {/* Shared routes (accessible by any authenticated user) */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatBox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
