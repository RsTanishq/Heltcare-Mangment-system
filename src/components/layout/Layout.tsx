import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AdminSidebar from '../admin/AdminSidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: ReactNode;
  role: "patient" | "doctor" | "admin";
  sidebarProps?: {
    activeTab?: string;
    onDoctorTabChange?: (tab: string) => void;
  };
}

const Layout: React.FC<LayoutProps> = ({ children, role, sidebarProps }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-50">
      {role === "admin" ? (
        <AdminSidebar />
      ) : (
        <Sidebar 
          role={role} 
          activeTab={sidebarProps?.activeTab}
          onDoctorTabChange={sidebarProps?.onDoctorTabChange}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          role={role} 
          username={currentUser.data?.name || "John Doe"}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
