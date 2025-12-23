import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, LayoutDashboard, Ticket, Clock, User, ClipboardList, Megaphone } from "lucide-react";
import { Link } from "react-router";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";

const ServiceDeskDashboard = () => {
  const { user } = useAuthenticationStore();
  const { fetchTickets, tickets, loading } = useTicketStore();

  useEffect(() => {
    fetchTickets(); 
  }, [fetchTickets]);

  const totalTickets = tickets.length;
  const assignedTickets = tickets.filter(
    (ticket) => ticket.assignedTo && ticket.status !== "Resolved"
  ).length;
  const pendingTickets = tickets.filter(
    (ticket) => (!ticket.assignedTo || ticket.assignedTo === "") &&
      ticket.status === "Open"
  ).length;

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header - Added subtle divider and refined typography */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || user?.username}
            </h3>
            <p className="text-sm font-medium text-gray-500 italic">
              System Status: Active • {new Date().toLocaleDateString()}
            </p>
          </div>
          <Link to="/servicedesk-dashboard/service-new-ticket" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95">
            <Plus size={20} strokeWidth={3} />
            <span>New Ticket</span>
          </Link>
        </div>

        {/* System Announcements - Refined with Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shadow-xl shadow-indigo-500/20"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
              <Megaphone className="text-white" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                System Announcements
              </h3>
              <p className="text-sm md:text-base text-blue-50 font-medium leading-relaxed">
                <span className="text-yellow-300 font-bold">🚧 Scheduled Maintenance:</span> Our systems will be undergoing maintenance on <span className="underline decoration-yellow-300/50">Friday, 10 PM – 12 AM</span>. Please save your work.
              </p>
            </div>
          </div>
          {/* Decorative Background Circles */}
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Cards Section - Added Icons and Glass Effects */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Ticket Analytics</h3>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { label: "Total Tickets", val: totalTickets, color: "from-emerald-400 to-teal-600", icon: LayoutDashboard },
              { label: "Assigned", val: assignedTickets, color: "from-blue-400 to-indigo-600", icon: Ticket },
              { label: "Pending", val: pendingTickets, color: "from-amber-400 to-orange-600", icon: Clock },
            ].map((card, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`relative group overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br ${card.color} shadow-lg transition-all cursor-default`}
              >
                <div className="relative z-10 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-4xl font-black text-white">{loading ? "..." : card.val}</p>
                    <span className="text-xs font-black text-white/80 uppercase tracking-widest">{card.label}</span>
                  </div>
                  <card.icon className="text-white/20 group-hover:scale-110 transition-transform duration-500" size={56} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Quick Actions - Converted to semantic Grid with Icons */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Operations</h3>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <QuickActionButton 
                to="/servicedesk-dashboard/service-new-ticket" 
                icon={<Plus />} 
                label="Create Ticket" 
                color="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20" 
            />
            <QuickActionButton 
                to="/servicedesk-dashboard/service-tickets" 
                icon={<ClipboardList />} 
                label="View All Tickets" 
                color="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20" 
            />
            <QuickActionButton 
                to="/servicedesk-dashboard/profile" 
                icon={<User />} 
                label="Manage Profile" 
                color="bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20" 
            />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper component for cleaner Quick Actions
const QuickActionButton = ({ to, icon, label, color }) => (
  <Link to={to} className="w-full">
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-4 p-5 rounded-2xl border ${color} shadow-sm transition-all hover:shadow-md active:shadow-inner`}
    >
      <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
        {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
      </div>
      <span className="font-bold tracking-tight">{label}</span>
    </motion.div>
  </Link>
);

export default ServiceDeskDashboard;