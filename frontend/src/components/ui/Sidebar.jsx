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
    "Service Desk": {
      top: [
        { name: "Dashboard", icon: <Home />, path: "/servicedesk-dashboard" },
        { 
          name: "Tickets", 
          icon: <Ticket />, 
          submenu: [
            {name: "All Tickets", path: "/servicedesk-dashboard/service-tickets" },
            {name: "New Tickets", path: "/servicedesk-dashboard/service-new-ticket" },
            // {name: "Ticket Detail", path: "/servicedesk-dashboard/service-tickets/:id" },
          ]
        },
        { name: "Reports", icon: <FileText />, path: "/servicedesk-dashboard/service-reports" },
      ],
      bottom: [
        { name: "Settings", icon: <Settings />, path: "/servicedesk-dashboard/profile" },
        { name: "Logout", icon: <LogOut />, action: handleLogout }
      ],
    },
    "IT Support": {
      top: [
        { name: "Dashboard", icon: <Home />, path: "/itsupport-dashboard" },
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
    if (item.submenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className="flex justify-between items-center w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </div>
            {!isCollapsed &&
              (openMenus[item.name] ? <ChevronUp /> : <ChevronDown />)}
          </button>
          {openMenus[item.name] && !isCollapsed && (
            <div className="flex flex-col ml-6 mt-1 gap-1">
              {item.submenu.map((sub) => (
                <NavLink
                  key={sub.name}
                  to={sub.path}
                  className={({ isActive }) =>
                    `p-2 rounded hover:bg-gray-700 ${
                      isActive ? "bg-gray-700 font-bold" : ""
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
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 w-full text-left hover:accent-red-500 hover:text-red-500"
        >
          {item.icon}
          {!isCollapsed && <span>{item.name}</span>}
        </button>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded hover:bg-gray-700 ${
            isActive ? "bg-gray-700 font-bold" : ""
          }`
        }
      >
        {item.icon}
        {!isCollapsed && <span>{item.name}</span>}
      </NavLink>
    );
  };

  return (
    <div
      className={`bg-gray-800 text-white min-h-screen p-4 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          {!isCollapsed && <h2 className="text-2xl font-bold tracking-wide">SOLEASE</h2>}
          <button
            className="p-1 rounded hover:bg-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems[userRole]?.top.map((item) => renderItem(item))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col gap-2 border-t border-gray-700 pt-2">
        {menuItems[userRole]?.bottom.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default Sidebar;