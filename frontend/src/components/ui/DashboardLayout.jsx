import React from "react";
import Sidebar from "./Sidebar";
import { useAuthenticationStore } from "../../store/authStore";

const DashboardLayout = ({ children }) => {
  const { user } = useAuthenticationStore();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar changes based on user role */}
      <Sidebar userRole={user?.role} />
      
      {/* Main dashboard content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
