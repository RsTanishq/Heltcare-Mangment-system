import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Calendar, Users, Stethoscope, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Doctor } from "@/data/mockDoctors";

// Doctor dashboard components
import DoctorActivityChart from "../components/doctor/DoctorActivityChart";
import DoctorAppointmentRequests from "../components/doctor/DoctorAppointmentRequests";
import DoctorAppointments from "../components/doctor/DoctorAppointments";
import DoctorIncome from "../components/doctor/DoctorIncome";
import DoctorProfileCard from "../components/doctor/DoctorProfileCard";
import DoctorRecentPatients from "../components/doctor/DoctorRecentPatients";
import DoctorWelcomeBanner from "../components/doctor/DoctorWelcomeBanner";
import DoctorPatientsList from "../components/doctor/DoctorPatientsList";
import DoctorMedications from "../components/doctor/DoctorMedications";
import DoctorDocuments from "../components/doctor/DoctorDocuments";
import WalletConnect from "../components/blockchain/WalletConnect";
import DoctorWallet from "../components/doctor/DoctorWallet";
import DoctorMessages from "../components/doctor/DoctorMessages";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(localStorage.getItem('doctorActiveTab') || 'dashboard');

  // Get the doctor data from currentUser with default values
  const currentDoctor = currentUser?.type === 'doctor' ? currentUser.data as Doctor : null;

  useEffect(() => {
    // Redirect to login if not authenticated or not a doctor
    if (!currentUser || currentUser.type !== 'doctor') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleDoctorTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('doctorActiveTab', tab);
  };

  // Show loading state while doctor data is being fetched
  if (!currentDoctor) {
    return (
      <Layout role="doctor" sidebarProps={{ activeTab, onDoctorTabChange: handleDoctorTabChange }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctor dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderDoctorContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <DoctorAppointments />;
      case 'patients':
        return <DoctorPatientsList />;
      case 'medications':
        return <DoctorMedications />;
      case 'documents':
        return <DoctorDocuments />;
      case 'messages':
        return <DoctorMessages />;
      case 'wallet':
        return <DoctorWallet />;
      default:
        return (
          <div className="flex flex-col gap-6">
            <DoctorWelcomeBanner 
              doctorName={currentDoctor?.fullName}
              doctorImage={currentDoctor?.profileImage}
              specialty={currentDoctor?.specialization}
              hospital={currentDoctor?.hospitalAffiliation}
              yearsOfExperience={currentDoctor?.yearsOfExperience}
              newAppointments={5}
              newMessages={3}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-600">Total Appointments</h3>
                    </div>
                    <p className="text-4xl font-bold text-blue-600">2,543</p>
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">+12% vs last month</p>
                      <p className="text-sm text-gray-600">This month</p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600">85% of target</p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium text-green-600">Total Patients</h3>
                    </div>
                    <p className="text-4xl font-bold text-green-600">3,567</p>
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">+8% vs last year</p>
                      <p className="text-sm text-gray-600">Lifetime</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium text-purple-600">Consultations</h3>
                    </div>
                    <p className="text-4xl font-bold text-purple-600">13,078</p>
                    <div className="space-y-2">
                      <p className="text-sm text-red-600 font-medium">-3% vs last month</p>
                      <p className="text-sm text-gray-600">Total consultations</p>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600">92% of target</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-orange-600" />
                      <h3 className="font-medium text-orange-600">Return Patients</h3>
                    </div>
                    <p className="text-4xl font-bold text-orange-600">2,736</p>
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">+15% vs last quarter</p>
                      <p className="text-sm text-gray-600">Recurring patients</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DoctorActivityChart />
                  <DoctorAppointmentRequests doctorId={currentDoctor.id} />
                </div>
                
                <DoctorRecentPatients />
              </div>
              
              <div className="space-y-6">
                <DoctorProfileCard 
                  name={currentDoctor?.fullName}
                  specialty={currentDoctor?.specialization}
                  hospital={currentDoctor?.hospitalAffiliation}
                  image={currentDoctor?.profileImage}
                  registrationNumber={currentDoctor?.registrationNumber}
                  yearsOfExperience={currentDoctor?.yearsOfExperience}
                  workAddress={currentDoctor?.workAddress}
                  appointmentLimit={100}
                  appointmentCount={50}
                />
                
                <WalletConnect />
                
                <DoctorIncome />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout role="doctor" sidebarProps={{ activeTab, onDoctorTabChange: handleDoctorTabChange }}>
      {renderDoctorContent()}
    </Layout>
  );
};

export default DoctorDashboard; 