import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence for smooth exits
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { Plus, Search } from "lucide-react";
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

  // Animation Variants
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

  const { openTickets, resolvedTickets, inProgressTickets, closedTickets, resolutionRate } = useMemo(() => {
    const t = tickets;
    const open = t.filter((ticket) => ticket.status === "Open").length;
    const resolved = t.filter((ticket) => ticket.status === "Resolved").length;
    const inProgress = t.filter((ticket) => ticket.status === "In Progress").length;
    const closed = t.filter((ticket) => ticket.status === "Closed").length;
    const total = t.length;
    const successfullyClosed = resolved + closed;
    const rate = total ? ((successfullyClosed / total) * 100).toFixed(0) : 0;
    return { openTickets: open, resolvedTickets: resolved, inProgressTickets: inProgress, closedTickets: closed, resolutionRate: rate };
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
        <div className="-mt-3 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <motion.div variants={itemVars} className="flex flex-col items-start space-y-1">
            <h5 className="text-sm font-normal text-gray-400">Manager Dashboard</h5>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Welcome back, {user?.name || user?.username}!
            </h3>
            <p className="text-sm font-normal text-gray-500">Here's an overview of your team's performance</p>
          </motion.div>

          <motion.div variants={itemVars} className="flex md:justify-end items-center gap-3">
            <div className={`flex items-center border border-gray-300 dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 ${isSearchOpen ? "w-64" : "w-11"} h-11`}>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-500 hover:text-blue-600">
                <Search size={19} />
              </button>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search urgency (e.g. Critical)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 w-full bg-transparent outline-none text-sm text-gray-800 dark:text-white"
                  autoFocus
                />
              )}
            </div>
            <button onClick={() => navigate("/admin-dashboard/admin-new-ticket")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md h-10">
              <Plus size={18} />
              <span className="hidden sm:inline">Add Ticket</span>
            </button>
          </motion.div>
        </div>

        {/* Tickets Overview */}
        <div className="flex flex-col space-y-3">
          <p className="text-lg font-bold text-gray-700 dark:text-white">Tickets Overview</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Open Tickets", value: openTickets, grad: "from-blue-500 to-blue-600" },
              { label: "Resolved Tickets", value: resolvedTickets, grad: "from-indigo-500 to-indigo-600" },
              { label: "Resolution Rate", value: `${resolutionRate}%`, grad: "from-emerald-500 to-teal-600" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVars}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${stat.grad} p-6 rounded-2xl shadow-lg text-white cursor-pointer`}
              >
                <p className="text-3xl font-black">{loading ? "..." : stat.value}</p>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Search Results Table - Motion Controlled */}
        <AnimatePresence>
          {searchTerm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl"
            >
              <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Urgency: {searchTerm}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 dark:bg-gray-900/30 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Urgency</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {filteredTickets.map((t) => (
                      <motion.tr 
                        key={t._id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-blue-600 text-sm">#{t._id?.slice(-6).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{t.subject}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${t.urgency === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            {t.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full text-[10px] font-black uppercase">{t.status}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trends Section */}
        <motion.div variants={itemVars} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Weekly Activity</h4>
            <BarChart dataset={mergeData} xAxis={[{ dataKey: "day", scaleType: "band" }]} series={[{ dataKey: "open", color: "#3b82f6" }, { dataKey: "resolved", color: "#10b981" }]} height={250} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Status Mix</h4>
            <PieChart series={[{ data: [{ value: openTickets, label: "Open" }, { value: resolvedTickets, label: "Resolved" }] }]} height={250} />
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;