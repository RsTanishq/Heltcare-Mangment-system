import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  MessageSquare,
  ShoppingBag,
  Settings,
  LogOut,
  LineChart,
  BadgeHelp
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold flex items-center text-indigo-600">
          <span className="mr-2 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="8" height="8" rx="2" fill="#4F46E5" />
              <rect x="4" y="16" width="8" height="8" rx="2" fill="#4F46E5" />
              <rect x="16" y="4" width="8" height="8" rx="2" fill="#4F46E5" />
              <rect x="16" y="16" width="8" height="8" rx="2" fill="#FB7185" />
            </svg>
          </span>
          HOSCARE Admin
        </h2>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Main</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin-dashboard" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin-dashboard") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/doctors" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/doctors") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <Users size={20} />
                <span>Doctors</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/patients" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/patients") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <Users size={20} />
                <span>Patients</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/appointments" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/appointments") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <CalendarDays size={20} />
                <span>Appointments</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Data</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin/medical-records" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/medical-records") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <FileText size={20} />
                <span>Medical Records</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/analytics" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/analytics") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <LineChart size={20} />
                <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/messages" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/messages") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <MessageSquare size={20} />
                <span>Messages</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Commerce</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin/pharmacy" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/pharmacy") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <ShoppingBag size={20} />
                <span>Pharmacy</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-xs uppercase font-semibold mb-2">Support</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin/help" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/help") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <BadgeHelp size={20} />
                <span>Help Center</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${isActiveLink("/admin/settings") ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
