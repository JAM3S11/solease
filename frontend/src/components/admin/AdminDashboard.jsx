import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { Plus, Search, Ticket, Users, CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowRight, BarChart3, List } from "lucide-react";
import useTicketStore from "../../store/ticketStore";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

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
    const open = t.filter((ticket) => ticket.status === "Open" && !ticket.assignedTo).length;
    const resolved = t.filter((ticket) => ticket.status === "Resolved").length;
    const inProgress = t.filter((ticket) => ticket.status === "In Progress").length;
    const closed = t.filter((ticket) => ticket.status === "Closed").length;
    const pending = t.filter((ticket) => ticket.status === "Open").length;
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
    { label: "Total Tickets", value: totalTickets, icon: Ticket, color: "blue", bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10" },
    { label: "Pending", value: pendingTickets, icon: Clock, color: "orange", bgGradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10" },
    { label: "In Progress", value: inProgressTickets, icon: TrendingUp, color: "violet", bgGradient: "from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/10" },
    { label: "Resolved", value: resolvedTickets, icon: CheckCircle, color: "emerald", bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10" },
  ];

  const quickActions = [
    { label: "Create Ticket", icon: Plus, path: "/admin-dashboard/admin-new-ticket", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "View All Tickets", icon: List, path: "/admin-dashboard/tickets", color: "bg-gray-600 hover:bg-gray-700" },
    { label: "Manage Users", icon: Users, path: "/admin-dashboard/users", color: "bg-purple-600 hover:bg-purple-700" },
    { label: "Pending Tickets", icon: AlertTriangle, path: "/admin-dashboard/pending-tickets", color: "bg-orange-600 hover:bg-orange-700" },
  ];

  if (loading && tickets.length === 0) {
      return (
          <DashboardLayout>
              <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>
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
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
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
                <p className="font-semibold text-red-800 dark:text-red-200">Action Required</p>
                <p className="text-sm text-red-600 dark:text-red-300">{criticalTickets.length} critical ticket{criticalTickets.length > 1 ? 's' : ''} need{criticalTickets.length === 1 ? 's' : ''} attention</p>
              </div>
            </div>
            <button onClick={() => navigate("/admin-dashboard/pending-tickets")} className="text-red-600 dark:text-red-300 font-medium text-sm hover:underline">
              View Now →
            </button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div variants={itemVars} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, idx) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-gradient-to-br ${stat.bgGradient} dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer`}
              onClick={() => navigate("/admin-dashboard/tickets")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/40`}>
                  <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={20} />
                </div>
                <span className="text-2xl font-bold text-gray-800 dark:text-white">{loading ? "..." : stat.value}</span>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVars}>
          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white p-4 rounded-xl flex flex-col items-center gap-2 shadow-lg transition-all`}
              >
                <action.icon size={24} />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
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
          <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Recent Tickets</h4>
              <button onClick={() => navigate("/admin-dashboard/tickets")} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => navigate("/admin-dashboard/tickets")}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-blue-500' : ticket.status === 'In Progress' ? 'bg-yellow-500' : ticket.status === 'Resolved' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{ticket.subject?.slice(0, 25)}{ticket.subject?.length > 25 ? '...' : ''}</p>
                      <p className="text-xs text-gray-500">#{ticket._id?.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${ticket.urgency === 'Critical' ? 'bg-red-100 text-red-700' : ticket.urgency === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>{ticket.urgency}</span>
                  </div>
                </div>
              ))}
              {recentTickets.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No tickets yet</p>
              )}
            </div>
          </motion.div>

          {/* Charts */}
          <div className="space-y-6">
            <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Weekly Activity</h4>
              <BarChart dataset={mergeData} xAxis={[{ dataKey: "day", scaleType: "band" }]} series={[{ dataKey: "open", color: "#3b82f6", label: "Open" }, { dataKey: "resolved", color: "#10b981", label: "Resolved" }]} height={200} />
            </motion.div>

            <motion.div variants={itemVars} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Status Distribution</h4>
              <div className="flex items-center justify-center">
                <PieChart series={[{ data: [
                  { value: openTickets, label: "Open", color: "#3b82f6" },
                  { value: inProgressTickets, label: "In Progress", color: "#f59e0b" },
                  { value: resolvedTickets, label: "Resolved", color: "#10b981" },
                  { value: closedTickets, label: "Closed", color: "#6b7280" },
                ] }]} height={180} width={300} />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;