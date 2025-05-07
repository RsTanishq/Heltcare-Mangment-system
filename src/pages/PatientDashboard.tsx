import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import WalletConnect from "../components/blockchain/WalletConnect";
import PatientWelcomeBanner from "../components/patient/PatientWelcomeBanner";
import PatientAppointments from "../components/patient/PatientAppointments";
import PatientMedicalRecords from "../components/patient/PatientMedicalRecords";
import PatientMedications from "../components/patient/PatientMedications";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated or not a patient
    if (!currentUser || currentUser.type !== "patient") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <Layout role="patient">
      <div className="space-y-6">
        <PatientWelcomeBanner
          patientName={currentUser?.data?.name || currentUser?.data?.fullName}
          patientImage={currentUser?.data?.profileImage}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PatientAppointments />
            <PatientMedicalRecords />
          </div>
          <div className="space-y-6">
            <PatientMedications />
            <WalletConnect />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
