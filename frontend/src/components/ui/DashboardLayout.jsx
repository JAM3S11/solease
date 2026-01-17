import React from "react";
import Sidebar from "./Sidebar";
import { useAuthenticationStore } from "../../store/authStore";

const DashboardLayout = ({ children }) => {
  const { user } = useAuthenticationStore();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar changes based on user role */}
      <Sidebar userRole={user?.role} />
      
      {/* Main dashboard content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
