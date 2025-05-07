import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
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
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard role="patient" />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard role="admin" />} />
            <Route path="/admin/doctors" element={<Dashboard role="admin" />} />
            <Route path="/admin/patients" element={<Dashboard role="admin" />} />
            <Route path="/admin/appointments" element={<Dashboard role="admin" content={<AdminAppointments />} />} />
            <Route path="/admin/medical-records" element={<Dashboard role="admin" />} />
            <Route path="/admin/messages" element={<Dashboard role="admin" />} />
            <Route path="/admin/pharmacy" element={<Dashboard role="admin" />} />
            <Route path="/admin/analytics" element={<Dashboard role="admin" />} />
            <Route path="/admin/help" element={<Dashboard role="admin" />} />
            <Route path="/admin/settings" element={<Dashboard role="admin" />} />
            <Route path="/medical-records" element={<MedicalRecords role="patient" />} />
            <Route path="/doctor-records" element={<MedicalRecords role="doctor" />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/chat" element={<ChatBox />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
