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
    const baseItemClasses =
      "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-700/80 hover:shadow-md transition-all duration-200 w-full text-left font-medium";
    const activeClasses = "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg";
    const submenuItemClasses =
      "block px-3 py-2 ml-6 text-sm rounded-lg hover:bg-slate-600/50 transition-colors font-normal";
    const submenuActiveClasses = "text-blue-300 font-semibold";

    if (item.submenu) {
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleMenu(item.name)}
            className={`${baseItemClasses} justify-between`}
          >
            <div className="flex items-center gap-3">
              {React.cloneElement(item.icon, { size: 20, className: "text-slate-300" })}
              {!isCollapsed && <span className="text-slate-200">{item.name}</span>}
            </div>
            {!isCollapsed &&
              (openMenus[item.name] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />)}
          </button>
          {openMenus[item.name] && !isCollapsed && (
            <div className="flex flex-col mt-2 space-y-1 border-l-2 border-slate-600 pl-2">
              {item.submenu.map((sub) => (
                <NavLink
                  key={sub.name}
                  to={sub.path}
                  className={({ isActive }) =>
                    `${submenuItemClasses} ${
                      isActive ? submenuActiveClasses : "text-slate-400 hover:text-slate-200"
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
          className={`${baseItemClasses} text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:shadow-md`}
        >
          {React.cloneElement(item.icon, { size: 20, className: "text-red-400" })}
          {!isCollapsed && <span>{item.name}</span>}
        </button>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `${baseItemClasses} ${isActive ? activeClasses : "text-slate-200"}`
        }
      >
        {React.cloneElement(item.icon, { size: 20, className: "text-slate-300" })}
        {!isCollapsed && <span>{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={`bg-gradient-to-b from-slate-900 to-slate-800 text-gray-200 min-h-screen p-5 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-700 ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Top section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src="/solease.svg" alt="Solease" className="h-10 w-10 drop-shadow-lg" />
              <h2 className="text-2xl font-bold tracking-wide text-white drop-shadow-sm">SOLEASE</h2>
            </div>
          )}
          <button
            className="p-2 rounded-xl hover:bg-slate-700/80 hover:shadow-lg transition-all duration-200"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu size={22} className="text-slate-300" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems[userRole]?.top.map((item) => renderItem(item))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-1 border-t border-slate-600 pt-6">
        {menuItems[userRole]?.bottom.map((item) => renderItem(item))}
      </div>
    </aside>
  );
};

export default Sidebar;