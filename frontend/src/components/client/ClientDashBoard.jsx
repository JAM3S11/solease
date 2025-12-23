import React, { useEffect, useState } from "react";
import { Plus, ArrowRight, Ticket, Clock, CheckCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { Link } from "react-router"; 
import useTicketStore from "../../store/ticketStore";
import WelcomeMessage from "../ui/WelcomeMessage";

const ClientDashboard = () => {
  const { user } = useAuthenticationStore();
  const { tickets, fetchTickets, loading, error } = useTicketStore();
  const [searchTerm, setSearchTerm] = useState("");

  const userName = user?.name || user?.username || "Client";
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // Derived the Stat Cards
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter(t => t.status === "Open" || t.status === "In Progress").length,
    resolved: safeTickets.filter(t => t.status === "Resolved").length
  };

  const showWelcome = !loading && !error && safeTickets.length === 0;

  useEffect(() => {
    fetchTickets("Client");
  }, [fetchTickets]);

  const displayTickets = safeTickets
    .filter(t => t.subject?.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {showWelcome 
                ? "Let's submit your first support request and get started!" 
                : "Manage and track your active support requests here."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to="/client-dashboard/new-ticket"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Submit New Ticket
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        {!loading && !error && safeTickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Tickets", val: stats.total, icon: Ticket, color: "blue" },
              { label: "Pending Help", val: stats.open, icon: Clock, color: "orange" },
              { label: "Resolved", val: stats.resolved, icon: CheckCircle, color: "green" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.val}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-500 animate-pulse">Synchronizing your dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
             <span className="font-bold">Error:</span> {error}
          </div>
        ) : showWelcome ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10">
            <WelcomeMessage userName={userName} />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Table Header with Search */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Tickets</h2>
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Quick search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                  <tr>
                    {["Ticket ID", "Subject", "Urgency", "Location", "Status", "Submitted", ""].map((header) => (
                      <th key={header} className="px-6 py-4 text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {displayTickets.map((ticket, index) => (
                    <tr
                      key={ticket._id}
                      className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-default"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded">
                          #{ticket._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200 max-w-[200px] truncate">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          ticket.urgency === "Critical" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
                          ticket.urgency === "High" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" :
                          ticket.urgency === "Medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
                          "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        }`}>
                          {ticket.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {ticket.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            ticket.status === "Open" ? "bg-blue-500" :
                            ticket.status === "In Progress" ? "bg-yellow-500" :
                            ticket.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
                          }`} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{ticket.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/client-dashboard/all-tickets`} 
                          className="p-2 inline-block text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <ArrowRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View All Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center">
              <Link to="/client-dashboard/all-tickets" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                View All Support Tickets
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;