import { ReactNode } from "react";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import AdminDashboard from "./AdminDashboard";

interface DashboardProps {
  role: "patient" | "doctor" | "admin";
  content?: ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ role, content }) => {
  switch (role) {
    case "doctor":
      return <DoctorDashboard />;
    case "admin":
      return <AdminDashboard />;
    case "patient":
      return <PatientDashboard />;
    default:
      return null;
  }
};

export default Dashboard;
