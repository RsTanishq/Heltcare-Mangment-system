import { Home, Calendar, FileText, Settings, LogOut, ShoppingCart, Wallet, Users, MessageSquare, Pill } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface SidebarProps {
  role: "patient" | "doctor" | "admin";
  onDoctorTabChange?: (tab: string) => void;
  activeTab?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onDoctorTabChange, activeTab = 'dashboard' }) => {
  const isPatient = role === "patient";
  const isDoctor = role === "doctor";
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  
  useEffect(() => {
    // Set active tab based on URL path or localStorage on component mount
    if (location.pathname === "/doctor-dashboard") {
      const storedTab = localStorage.getItem('doctorActiveTab');
      if (isDoctor && storedTab) {
        setCurrentTab(storedTab);
        if (onDoctorTabChange) onDoctorTabChange(storedTab);
      } else {
        setCurrentTab('dashboard');
        if (onDoctorTabChange) onDoctorTabChange('dashboard');
      }
    }
  }, [location.pathname, isDoctor, onDoctorTabChange]);

  // Handle tab click for doctor dashboard
  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    localStorage.setItem('doctorActiveTab', tab);
    if (onDoctorTabChange) onDoctorTabChange(tab);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-indigo-800 text-white w-64 flex flex-col">
      <div className="p-4 border-b border-indigo-500">
        <h2 className="text-xl font-bold flex items-center text-white">
          <span className="mr-2 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="8" height="8" rx="2" fill="#ffffff" />
              <rect x="4" y="16" width="8" height="8" rx="2" fill="#ffffff" />
              <rect x="16" y="4" width="8" height="8" rx="2" fill="#ffffff" />
              <rect x="16" y="16" width="8" height="8" rx="2" fill="#FB7185" />
            </svg>
          </span>
          {isDoctor ? "Doctor App" : "HOSCARE"}
        </h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {isDoctor ? (
            // Doctor navigation items
            <>
              <li>
                <button 
                  onClick={() => handleTabClick('dashboard')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'dashboard' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => handleTabClick('appointments')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'appointments' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <Calendar size={20} />
                  <span>Appointments</span>
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => handleTabClick('patients')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'patients' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <Users size={20} />
                  <span>Patients</span>
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => handleTabClick('messages')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'messages' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => handleTabClick('medications')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'medications' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <Pill size={20} />
                  <span>Medications</span>
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => handleTabClick('documents')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'documents' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <FileText size={20} />
                  <span>Documents</span>
                </button>
              </li>
              
              <li>
                <button 
                  onClick={() => handleTabClick('wallet')}
                  className={`flex w-full items-center gap-3 p-2 rounded-md ${
                    currentTab === 'wallet' 
                      ? 'bg-indigo-700 text-white font-medium' 
                      : 'hover:bg-indigo-700 transition-colors'
                  }`}
                >
                  <Wallet size={20} />
                  <span>Wallet</span>
                </button>
              </li>
            </>
          ) : (
            // Patient navigation items
            <>
              <li>
                <Link 
                  to={isPatient ? "/dashboard" : "/admin-dashboard"} 
                  className="flex items-center gap-3 p-2 rounded-md bg-indigo-700 text-white font-medium"
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to={isPatient ? "/doctors" : "#"} 
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Calendar size={20} />
                  <span>Appointment</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to={isPatient ? "/medical-records" : "/doctor-records"}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <FileText size={20} />
                  <span>Medical Report</span>
                </Link>
              </li>
              
              {isPatient && (
                <>
                  <li>
                    <Link 
                      to="/wallet"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Wallet size={20} />
                      <span>Wallet</span>
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      to="/shop"
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingCart size={20} />
                      <span>Medicine Shop</span>
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-indigo-700">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/settings"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 p-2 rounded-md hover:bg-indigo-700 transition-colors text-red-300 hover:text-red-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
