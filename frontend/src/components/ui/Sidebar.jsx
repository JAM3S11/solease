import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Ticket,
  Settings,
  LogOut,
  Menu,
  LucideChartSpline,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuthenticationStore } from "../../store/authStore";
import toast from "react-hot-toast";

const Sidebar = ({ userRole }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { logout } = useAuthenticationStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("We shall miss you..", { duration: 2000, icon: "😭" });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleMenu = (menuName) => {
    if (isCollapsed) return;
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const menuItems = {
    Manager: {
      top: [
        { name: "Dashboard", icon: <Home />, path: "/admin-dashboard" },
        { name: "Users", icon: <Users />, submenu: [{ name: "All Users", path: "/admin-dashboard/users" }] },
        { 
          name: "Tickets", 
          icon: <Ticket />, 
          submenu: [
            { name: "All Tickets", path: "/admin-dashboard/admin-tickets" },
            { name: "Pending", path: "/admin-dashboard/admin-pending-tickets" },
            { name: "New Ticket", path: "/admin-dashboard/admin-new-ticket" },
          ] 
        },
        { name: "Reports", icon: <LucideChartSpline />, path: "/admin-dashboard/admin-reports" },
      ],
      bottom: [
        { name: "Settings", icon: <Settings />, path: "/admin-dashboard/admin-settings" },
        { name: "Logout", icon: <LogOut />, action: handleLogout },
      ],
    },
    Reviewer: {
        top: [
          { name: "Dashboard", icon: <Home />, path: "/reviewer-dashboard" },
          { name: "Tickets", icon: <Ticket />, submenu: [
              {name: "New Ticket", path: "/itsupport-dashboard/new-ticket"},
              {name: "Assigned", path: "/itsupport-dashboard/assigned-ticket"},
          ]},
          { name: "Report", icon: <LucideChartSpline />, path: "/itsupport-dashboard/report" },
        ],
        bottom: [
          { name: "Settings", icon: <Settings />, path: "/itsupport-dashboard/settings" },
          { name: "Logout", icon: <LogOut />, action: handleLogout },
        ],
    },
    Client: {
      top: [
        { name: "Dashboard", icon: <Home />, path: "/client-dashboard" },
        { name: "My Tickets", icon: <Ticket />, submenu: [
            { name: "All Tickets", path: "/client-dashboard/all-tickets" },
            { name: "New Ticket", path: "/client-dashboard/new-ticket" },
        ]},
        { name: "Report", icon: <LucideChartSpline />, path: "/client-dashboard/report" },
      ],
      bottom: [
        { name: "Profile", icon: <Users />, path: "/client-dashboard/profile" },
        { name: "Logout", icon: <LogOut />, action: handleLogout }
      ],
    },
  };

  const renderItem = (item) => {
    const isActiveLink = (path) => window.location.pathname === path;
    
    // UI Logic
    const iconSize = isCollapsed ? 24 : 22;
    const baseItemClasses = `group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full font-medium ${
      isCollapsed ? "justify-center px-0" : "hover:bg-slate-800/50"
    }`;
    const activeClasses = "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20";
    const nonActiveClasses = "text-slate-400 hover:text-white";

    // This is a tooltip Component for the Collapsed States
    const Tooltip = ({ text }) => (
      isCollapsed && (
        <div className="absolute left-16 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-cyan-400 text-xs py-2 px-3 rounded-lg border border-slate-700 whitespace-nowrap z-50 shadow-xl pointer-events-none">
          {text}
        </div>
      )
    );

    if (item.submenu) {
      const isAnySubActive = item.submenu.some(sub => isActiveLink(sub.path));
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleMenu(item.name)}
            className={`${baseItemClasses} ${!isCollapsed && isAnySubActive ? "text-cyan-400" : nonActiveClasses}`}
          >
            <div className="flex items-center gap-3">
              {React.cloneElement(item.icon, { size: iconSize })}
              {!isCollapsed && <span>{item.name}</span>}
            </div>
            {!isCollapsed && (openMenus[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            <Tooltip text={item.name} />
          </button>
          
          {openMenus[item.name] && !isCollapsed && (
            <div className="flex flex-col mt-1 ml-6 border-l border-slate-700 pl-4 space-y-1">
              {item.submenu.map((sub) => (
                <NavLink
                  key={sub.name}
                  to={sub.path}
                  className={({ isActive }) =>
                    `text-sm py-2 transition-colors ${isActive ? "text-cyan-400 font-bold" : "text-slate-500 hover:text-slate-300"}`
                  }
                >
                  {sub.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (item.action) {
      return (
        <button key={item.name} 
          onClick={item.action} 
          className={`${baseItemClasses} text-red-400 hover:bg-red-500/10`}>
          {React.cloneElement(item.icon, { size: iconSize })}
          {!isCollapsed && <span>{item.name}</span>}
          <Tooltip text={item.name} />
        </button>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={
          ({ isActive }) => 
            `${baseItemClasses} ${isActive 
              ? activeClasses 
              : nonActiveClasses}`}
      >
        {React.cloneElement(item.icon, { size: iconSize })}
        {!isCollapsed && <span>{item.name}</span>}
        <Tooltip text={item.name} />
      </NavLink>
    );
  };

  return (
    <aside
      className={`bg-[#020617] text-gray-200 min-h-screen p-4 flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-white/5 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        {/* Header Area */}
        <div className={`flex items-center mb-10 mt-2 ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                <img src="/solease.svg" alt="Logo" className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-black tracking-tighter text-white">SOLEASE</h2>
            </div>
          )}
          <button
            className="p-2 rounded-xl hover:bg-slate-800 transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems[userRole]?.top.map((item) => renderItem(item))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 pt-6 border-t border-white/5">
        {menuItems[userRole]?.bottom.map((item) => renderItem(item))}
      </div>
    </aside>
  );
};

export default Sidebar;