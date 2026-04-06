import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { Plus, Search, Tickets, Users, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowRight, BarChart3, List, Zap, Calendar, X, FileText, MapPin } from "lucide-react";
import useTicketStore from "../../store/ticketStore";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "react-router-dom";
import { NumberTicker } from "../ui/number-ticker";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showCriticalDialog, setShowCriticalDialog] = useState(false);

  const { fetchTickets, tickets: rawTickets, loading, error } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const tickets = rawTickets || [];

  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return tickets.filter((ticket) =>
      ticket.urgency?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tickets, searchTerm]);

  const { openTickets, resolvedTickets, inProgressTickets, closedTickets, pendingTickets, totalTickets, resolutionRate } = useMemo(() => {
    const t = tickets;
    const open = t.filter((ticket) => {
      const status = ticket.status?.trim();
      return status === "Open" && !ticket.assignedTo;
    }).length;
    const resolved = t.filter((ticket) => {
      const status = ticket.status?.trim();
      return status === "Resolved";
    }).length;
    const inProgress = t.filter((ticket) => {
      const status = ticket.status?.trim();
      return status === "In Progress";
    }).length;
    const closed = t.filter((ticket) => {
      const status = ticket.status?.trim();
      return status === "Closed";
    }).length;
    const pending = t.filter((ticket) => {
      const status = ticket.status?.trim();
      return status === "Open";
    }).length;
    const total = t.length;
    const successfullyClosed = resolved + closed;
    const rate = total ? ((successfullyClosed / total) * 100).toFixed(0) : 0;
    return { openTickets: open, resolvedTickets: resolved, inProgressTickets: inProgress, closedTickets: closed, pendingTickets: pending, totalTickets: total, resolutionRate: rate };
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [tickets]);

  const criticalTickets = useMemo(() => {
    return tickets.filter((ticket) => ticket.urgency === "Critical" && ticket.status !== "Resolved" && ticket.status !== "Closed");
  }, [tickets]);

  const { mergeData } = useMemo(() => {
      const groupTickets = (statusFilter = null) => {
          const counts = { Mon: 0, Tue: 0, Wed: 0, Thur: 0, Fri: 0, Sat: 0, Sun: 0 };
          tickets.forEach((ticket) => {
              const day = new Date(ticket.createdAt).toLocaleDateString("en-us", { weekday: "short" });
              const dayKey = day === "Thu" ? "Thur" : day;
              if (!statusFilter || ticket.status === statusFilter) {
                  counts[dayKey] = (counts[dayKey] || 0) + 1;
              }
          });
          return ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map(day => ({ day, value: counts[day] || 0 }));
      };
      const openD = groupTickets("Open");
      const resolvedD = groupTickets("Resolved");
      return { mergeData: openD.map((o, i) => ({ day: o.day, open: o.value, resolved: resolvedD[i].value })) };
  }, [tickets]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const statsCards = [
    { label: "Total Tickets", value: totalTickets, icon: Tickets, color: "blue", bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10", path: "/admin-dashboard/admin-tickets", clickable: true },
    { label: "Pending", value: pendingTickets, icon: Clock, color: "orange", bgGradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10", path: "/admin-dashboard/admin-pending-tickets", clickable: true },
    { label: "In Progress", value: inProgressTickets, icon: TrendingUp, color: "violet", bgGradient: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/10", path: "/admin-dashboard/admin-tickets?status=In%20Progress", clickable: true },
    { label: "Resolved", value: resolvedTickets, icon: CheckCircle, color: "emerald", bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10", path: "/admin-dashboard/admin-tickets?status=Resolved", clickable: true },
  ];

  const quickActions = [
    { label: "Create Ticket", icon: Plus, path: "/admin-dashboard/admin-new-ticket", color: "blue" },
    { label: "View All Tickets", icon: List, path: "/admin-dashboard/admin-tickets", color: "indigo" },
    { label: "Manage Users", icon: Users, path: "/admin-dashboard/users", color: "purple" },
    { label: "Pending Tickets", icon: AlertTriangle, path: "/admin-dashboard/admin-pending-tickets", color: "orange" },
  ];

  const getBgGradient = (color) => {
    const maps = {
      blue: "from-blue-50/80 to-transparent dark:from-blue-900/20",
      orange: "from-orange-50/80 to-transparent dark:from-orange-900/20",
      green: "from-green-50/80 to-transparent dark:from-green-900/20",
      purple: "from-purple-50/80 to-transparent dark:from-purple-900/20",
      indigo: "from-indigo-50/80 to-transparent dark:from-indigo-900/20",
      violet: "from-violet-50/80 to-transparent dark:from-violet-900/20",
      emerald: "from-emerald-50/80 to-transparent dark:from-emerald-900/20",
    };
    return maps[color] || maps.blue;
  };

  const getIconBg = (color) => {
    const maps = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
      orange: "bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30",
      green: "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30",
      indigo: "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30",
      violet: "bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-500/30",
      emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30",
    };
    return maps[color] || maps.blue;
  };

  const getLiveDotColor = (color) => {
    const maps = {
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      indigo: "bg-indigo-500",
      violet: "bg-violet-500",
      emerald: "bg-emerald-500",
    };
    return maps[color] || maps.blue;
  };

  const renderEmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full -ml-20 -mb-20 opacity-50" />
          
          <div className="relative p-12 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-3">
                <Tickets className="text-white" size={48} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Plus className="text-white" size={20} />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Welcome to Your Support Dashboard
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mb-8">
              Track, manage, and resolve support tickets efficiently. Get started by creating your first ticket or inviting team members to collaborate.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
              >
                <Plus size={20} />
                Create First Ticket
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin-dashboard/users")}
                className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <Users size={20} />
                Invite Team Members
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVars} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 bg-gradient-to-br ${getBgGradient(stat.color)} opacity-60`}
          >
            <div className="relative">
              <div className={`p-3 rounded-xl ${getIconBg(stat.color)}`}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">0</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVars}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-amber-500" />
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Quick actions available</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <div
                onClick={() => navigate(link.path)}
                className="flex flex-col p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 h-full relative overflow-hidden cursor-pointer"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 transition-transform duration-300 group-hover:scale-150 ${link.color === 'blue' ? 'bg-blue-500' : link.color === 'indigo' ? 'bg-indigo-500' : link.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg ${link.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' : link.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30' : link.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30' : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30'}`}>
                  <link.icon size={22} className="text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {link.label}
                </h3>
                <div className="mt-auto pt-3 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span>Click to open</span>
                  <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Tickets className="text-blue-600 dark:text-blue-400" size={18} />
              </div>
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200">Recent Tickets</h4>
            </div>
            <button onClick={() => navigate("/admin-dashboard/admin-tickets")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Tickets className="text-gray-300 dark:text-gray-500" size={32} />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No tickets yet</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Create your first ticket to get started</p>
            <button 
              onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Plus size={14} />
              Create Ticket
            </button>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                  <BarChart3 className="text-violet-600 dark:text-violet-400" size={18} />
                </div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200">Weekly Activity</h4>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-gray-500 dark:text-gray-400">Open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-gray-500 dark:text-gray-400">Resolved</span>
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-center h-[200px]">
              <div className="text-center">
                <BarChart3 className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={32} />
                <p className="text-xs text-gray-500 dark:text-gray-400">No activity data yet</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                  <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
                </div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200">Status Distribution</h4>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">0 total</span>
            </div>
            <div className="p-4 flex items-center justify-center h-[180px]">
              <div className="text-center">
                <CheckCircle className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={32} />
                <p className="text-xs text-gray-500 dark:text-gray-400">No tickets to display</p>
              </div>
            </div>
            <div className="px-5 pb-4 grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Open</span>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">In Progress</span>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Resolved</span>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Closed</span>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center"
      >
        <h4 className="text-xl font-bold text-white mb-2">Need Help Getting Started?</h4>
        <p className="text-blue-100 mb-6 max-w-lg mx-auto">
          Explore our documentation or contact support to learn how to make the most of your ticket management system.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => navigate("/admin-dashboard/users")}
            className="px-5 py-2.5 bg-white text-blue-600 font-medium rounded-xl flex items-center gap-2 hover:bg-blue-50 transition-colors"
          >
            <Users size={18} />
            Manage Team
          </button>
          <button 
            onClick={() => navigate("/admin-dashboard/admin-tickets")}
            className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-blue-400 transition-colors"
          >
            <List size={18} />
            View All Tickets
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading && tickets.length === 0) {
      return (
          <DashboardLayout>
              <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>
          </DashboardLayout>
      );
  }

  if (totalTickets === 0 && !loading) {
    return (
      <DashboardLayout>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVars}
          className="p-4 sm:p-6 lg:p-8 space-y-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 -mt-2">
            <motion.div variants={itemVars} className="flex flex-col">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{getGreeting()},</p>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                {user?.name || user?.username}!
              </h3>
              <p className="text-sm text-gray-500 mt-1">Here's what's happening with your tickets today.</p>
            </motion.div>

            <motion.div variants={itemVars} className="flex items-center gap-3">
              <button onClick={() => navigate("/admin-dashboard/admin-new-ticket")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 h-11">
                <Plus size={18} />
                <span className="hidden sm:inline">New Ticket</span>
              </button>
            </motion.div>
          </div>
          {renderEmptyState()}
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVars}
        className="p-4 sm:p-6 lg:p-8 space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 -mt-2">
          <motion.div variants={itemVars} className="flex flex-col">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{getGreeting()},</p>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
              {user?.name || user?.username}!
            </h3>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your tickets today.</p>
          </motion.div>

          <motion.div variants={itemVars} className="flex items-center gap-3">
            <div className={`flex items-center border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 transition-all duration-300 ${isSearchOpen ? "w-64" : "w-11"} h-11 bg-white dark:bg-gray-800`}>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-500 hover:text-blue-600">
                <Search size={19} />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search urgency..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white"
                  autoFocus
                />
              )}
            </div>
            <button onClick={() => navigate("/admin-dashboard/admin-new-ticket")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 h-11">
              <Plus size={18} />
              <span className="hidden sm:inline">New Ticket</span>
            </button>
          </motion.div>
        </div>

        {/* Critical Alert Banner */}
        {criticalTickets.length > 0 && (
          <motion.div variants={itemVars} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Action Required</p>
                <p className="text-sm text-red-600 dark:text-red-300">{criticalTickets.length} critical ticket{criticalTickets.length > 1 ? 's' : ''} need{criticalTickets.length === 1 ? 's' : ''} attention</p>
              </div>
            </div>
            <button onClick={() => setShowCriticalDialog(true)} className="text-red-600 dark:text-red-300 font-medium text-sm hover:underline">
              View Now →
            </button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div variants={itemVars} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={stat.clickable ? { y: -2, scale: 1.01 } : {}}
              className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 bg-gradient-to-br ${getBgGradient(stat.color)} ${stat.clickable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => stat.clickable && navigate(stat.path)}
            >
              <div className="relative">
                <div className={`p-3 rounded-xl ${getIconBg(stat.color)}`}>
                  <stat.icon size={22} className="text-white" />
                </div>
                {stat.clickable && (
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${getLiveDotColor(stat.color)} border-2 border-white dark:border-gray-800 rounded-full`}>
                    <span className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 animate-ping opacity-75"></span>
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {loading ? "..." : <NumberTicker value={stat.value} />}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVars}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="size-5 text-amber-500" />
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">Quick actions available</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <div
                  onClick={() => navigate(link.path)}
                  className="flex flex-col p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 h-full relative overflow-hidden cursor-pointer"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 transition-transform duration-300 group-hover:scale-150 ${link.color === 'blue' ? 'bg-blue-500' : link.color === 'indigo' ? 'bg-indigo-500' : link.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'}`} />
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg ${link.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' : link.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30' : link.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30' : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/30'}`}>
                    <link.icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.label}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span>Click to open</span>
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search Results - Motion Controlled */}
        <AnimatePresence>
          {searchTerm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Search Results: <span className="text-blue-600">{searchTerm}</span></p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900/30 text-xs font-semibold uppercase text-gray-500">
                    <tr>
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3">Urgency</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-gray-500">No tickets found</td>
                      </tr>
                    ) : (
                      filteredTickets.slice(0, 5).map((t) => (
                        <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate(`/admin-dashboard/tickets`)}>
                          <td className="px-5 py-3 font-mono text-sm text-blue-600">#{t._id?.slice(-6).toUpperCase()}</td>
                          <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">{t.subject}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-md ${t.urgency === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : t.urgency === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                              {t.urgency}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">{t.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Charts & Recent Tickets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Tickets className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200">Recent Tickets</h4>
              </div>
              <button onClick={() => navigate("/admin-dashboard/admin-tickets")} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium">
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {recentTickets.map((ticket, idx) => (
                <motion.div 
                  key={ticket._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all cursor-pointer group"
                  onClick={() => navigate(`/client-dashboard/ticket/${ticket._id}/feedback`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="inline-block font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-md"
                      >
                        #{ticket._id?.slice(-6).toUpperCase()}
                      </motion.span>
                      {ticket.urgency === "Critical" && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical" />
                      )}
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ticket.urgency === "Critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          : ticket.urgency === "High"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {ticket.urgency}
                      </span>
                    </div>
                    <motion.span
                      animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2.5 h-2.5 rounded-full ${
                        ticket.status === "Open"
                          ? "bg-blue-500 shadow-blue-500/50"
                          : ticket.status === "In Progress"
                            ? "bg-yellow-500 shadow-yellow-500/50"
                            : ticket.status === "Resolved"
                              ? "bg-green-500"
                              : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {ticket.subject}
                  </h5>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <FileText size={12} />
                      {ticket.issueType || 'General'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {ticket.location || '-'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {recentTickets.length === 0 && (
                <div className="p-8 text-center">
                  <Tickets className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={32} />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No tickets yet</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="space-y-6">
            {/* Weekly Activity */}
            <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                    <BarChart3 className="text-violet-600 dark:text-violet-400" size={18} />
                  </div>
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200">Weekly Activity</h4>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-gray-500 dark:text-gray-400">Open</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-500 dark:text-gray-400">Resolved</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <BarChart 
                  dataset={mergeData} 
                  xAxis={[{ 
                    dataKey: "day", 
                    scaleType: "band",
                    axisLine: false,
                    tickLine: false,
                  }]} 
                  series={[
                    { dataKey: "open", color: "#3b82f6", label: "Open", barSize: 20 },
                    { dataKey: "resolved", color: "#10b981", label: "Resolved", barSize: 20 }
                  ]} 
                  height={200}
                  grid={{ horizontal: true, vertical: false }}
                  margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
                />
              </div>
            </motion.div>

            {/* Status Distribution */}
            <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
                  </div>
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200">Status Distribution</h4>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{totalTickets} total</span>
              </div>
              <div className="p-4 flex items-center justify-center">
                <div className="relative">
                  <PieChart series={[{ 
                    data: [
                      { value: openTickets, label: "Open", color: "#3b82f6" },
                      { value: inProgressTickets, label: "In Progress", color: "#f59e0b" },
                      { value: resolvedTickets, label: "Resolved", color: "#10b981" },
                      { value: closedTickets, label: "Closed", color: "#6b7280" },
                    ],
                    innerRadius: 50,
                    outerRadius: 80,
                    paddingAngle: 3,
                    cornerRadius: 4,
                  }]} 
                  height={180} 
                  width={280}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      padding: 20,
                      itemMarkWidth: 8,
                      itemMarkHeight: 8,
                      markGap: 8,
                      itemGap: 12,
                      labelStyle: {
                        fontSize: 11,
                        fill: '#6b7280',
                      },
                    },
                  }}
                />
                </div>
              </div>
              {/* Summary Stats */}
              <div className="px-5 pb-4 grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Open</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{openTickets}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">In Progress</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{inProgressTickets}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Resolved</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{resolvedTickets}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Closed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{closedTickets}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Critical Tickets Dialog */}
        {showCriticalDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCriticalDialog(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-red-800 dark:text-red-200">Critical Tickets</h3>
                    <p className="text-sm text-red-600 dark:text-red-300">{criticalTickets.length} ticket{criticalTickets.length > 1 ? 's' : ''} requiring immediate attention</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCriticalDialog(false)} 
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <X className="text-red-600 dark:text-red-400" size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[60vh] p-4">
                <div className="space-y-3">
                  {criticalTickets.map((ticket) => (
                    <div 
                      key={ticket._id}
                      onClick={() => {
                        setShowCriticalDialog(false);
                        navigate(`/client-dashboard/ticket/${ticket._id}/feedback`);
                      }}
                      className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded">
                            #{ticket._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            {ticket.urgency}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'Open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                            ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">{ticket.subject}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{ticket.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <button 
                  onClick={() => {
                    setShowCriticalDialog(false);
                    navigate("/admin-dashboard/pending-tickets");
                  }}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  View All Pending Tickets
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;