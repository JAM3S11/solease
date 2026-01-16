import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Ticket,
  Settings,
  FileText,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  LucideChartSpline,
  icons
} from "lucide-react";
import { useAuthenticationStore } from "../../store/authStore";
import toast from "react-hot-toast";

const Sidebar = ({ userRole }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { logout } = useAuthenticationStore();
  const navigate = useNavigate();

  // Collapse automatically on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("We shall miss you..", { 
        duration: 2000,
        icon: "😭" 
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Separate top and bottom items
  const menuItems = {
    Manager: {
      top: [
        { name: "Dashboard", icon: <Home />, path: "/admin-dashboard" },
        {
          name: "Users",
          icon: <Users />,
          submenu: [
            { name: "All Users", path: "/admin-dashboard/users" },
            // { name: "User Detail", path: "/admin-dashboard/users/:username" },
          ],
        },
        {
          name: "Tickets",
          icon: <Ticket />,
          submenu: [
            { name: "All Tickets", path: "/admin-dashboard/admin-tickets" },
            { name: "Pending Tickets", path: "/admin-dashboard/admin-pending-tickets" },
            { name: "New Ticket", path: "/admin-dashboard/admin-new-ticket" },
          ],
        },
        {
          name: "Reports",
          icon: <LucideChartSpline />,
          path: "/admin-dashboard/admin-reports"
        },
      ],
      bottom: [
        { name: "Settings", icon: <Settings />, path: "/admin-dashboard/admin-settings" },
        { name: "Logout", icon: <LogOut />, action: handleLogout },
      ],
    },
    "Reviewer": {
      top: [
        { name: "Dashboard", icon: <Home />, path: "/reviewer-dashboard" },
        { name: "Tickets", 
          icon: <Ticket />, 
          submenu: [
            {name: "New Ticket", path: "/itsupport-dashboard/new-ticket"},
            {name: "Assigned Tickets", path: "/itsupport-dashboard/assigned-ticket"},
          ] 
        },
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
        { 
          name: "My Tickets", 
          icon: <Ticket />, 
          submenu: [
            { name: "All Tickets", path: "/client-dashboard/all-tickets" },
            { name: "New Ticket", path: "/client-dashboard/new-ticket" },
          ] 
        },
        { name: "Report", icon: <LucideChartSpline />, path: "/client-dashboard/report" },
      ],
      bottom: [
        { name: "Profile", icon: <Users />, path: "/client-dashboard/profile" },
        { name: "Logout", icon: <LogOut />, action: handleLogout }
      ],
    },
  };

  const renderItem = (item) => {
    const itemClasses =
      "flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition-colors duration-200 w-full text-left";
    const activeClasses = "bg-blue-600 text-white shadow-lg";

    if (item.submenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`${itemClasses} justify-between`}
          >
            <div className="flex items-center gap-3">
              {React.cloneElement(item.icon, { size: 20 })}
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </div>
            {!isCollapsed &&
              (openMenus[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>
          {openMenus[item.name] && !isCollapsed && (
            <div className="flex flex-col ml-8 mt-2 space-y-1 pl-3 border-l border-slate-700">
              {item.submenu.map((sub) => (
                <NavLink
                  key={sub.name}
                  to={sub.path}
                  className={({ isActive }) =>
                    `block p-2 rounded-md text-sm hover:bg-slate-700/50 transition-colors ${
                      isActive ? "text-blue-400 font-semibold" : "text-gray-400"
                    }`
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
        <button
          key={item.name}
          onClick={item.action}
          className={`${itemClasses} text-red-400 hover:bg-red-900/50 hover:text-red-300`}
        >
          {React.cloneElement(item.icon, { size: 20 })}
          {!isCollapsed && <span className="font-medium">{item.name}</span>}
        </button>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `${itemClasses} ${isActive ? activeClasses : ""}`
        }
      >
        {React.cloneElement(item.icon, { size: 20 })}
        {!isCollapsed && <span className="font-medium">{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={`bg-slate-900 text-gray-200 min-h-screen p-4 flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top section */}
      <div>
        <div className="flex items-center justify-between mb-6 h-10">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src="/solease.svg" alt="Solease" className="h-8 w-8" />
              <h2 className="text-2xl font-bold tracking-wide text-white">SOLEASE</h2>
            </div>
          )}
          <button
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems[userRole]?.top.map((item) => renderItem(item))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 border-t border-slate-700 pt-4">
        {menuItems[userRole]?.bottom.map((item) => renderItem(item))}
      </div>
    </aside>
  );
};

export default Sidebar;