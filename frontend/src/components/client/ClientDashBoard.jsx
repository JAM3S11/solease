import React, { useEffect, useState } from "react";
import {
  Plus,
  ArrowRight,
  Tickets,
  Clock,
  CheckCircle,
  Search,
  MessageCircle,
  Eye,
  Paperclip,
  ArrowUp,
  ArrowDown,
  BookOpen,
  HelpCircle,
  Headphones,
  Zap,
  MessageSquare,
  List,
  Grid,
  Table,
  MapPin,
  Calendar,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import useTicketStore from "../../store/ticketStore";
import WelcomeMessage from "../ui/WelcomeMessage";
import { NumberTicker } from "../ui/number-ticker";
import toast from "react-hot-toast";

// Profile Avatar Helper
const getProfileAvatar = (user, size = "md") => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const role = user?.role?.toLowerCase();
  const gradientClass = role === "manager" || role === "admin"
    ? "bg-gradient-to-br from-purple-500 to-purple-600"
    : role === "reviewer"
      ? "bg-gradient-to-br from-green-500 to-emerald-600"
      : "bg-gradient-to-br from-blue-500 to-blue-600";
  const initials = user?.name?.charAt(0) || user?.username?.charAt(0) || "?";

  if (user?.profilePhoto) {
    return (
      <img
        src={`${import.meta.env.VITE_API_URL}${user.profilePhoto}`}
        alt={user?.name || user?.username}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold ${gradientClass}`}>
      {initials.toUpperCase()}
    </div>
  );
};
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "../ui/alert-dialog";

const ClientDashboard = () => {
  const { user } = useAuthenticationStore();
  const { tickets, fetchTickets, loading, error, deleteTicket } = useTicketStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25];
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);

  const userName = user?.name || user?.username || "Client";
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const showWelcome = !loading && !error && safeTickets.length === 0;
  const isNewUser = safeTickets.length === 0;

  useEffect(() => {
    fetchTickets("Client");
  }, [fetchTickets]);

  // Reset to page 1 when search, sort, or view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig, viewMode]);

  const filteredTickets = safeTickets
    .filter((t) => t.subject?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortConfig.key === "ticketId") {
        const aId = a._id.slice(-6).toUpperCase();
        const bId = b._id.slice(-6).toUpperCase();
        return sortConfig.direction === "asc"
          ? aId.localeCompare(bId)
          : bId.localeCompare(aId);
      }
      if (sortConfig.key === "urgency") {
        const urgencyOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        const aUrgency = urgencyOrder[a.urgency] || 0;
        const bUrgency = urgencyOrder[b.urgency] || 0;
        return sortConfig.direction === "asc"
          ? aUrgency - bUrgency
          : bUrgency - aUrgency;
      }
      if (sortConfig.key === "updatedAt") {
        return sortConfig.direction === "asc"
          ? new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt)
          : new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
      return 0;
    });

  // Pagination for table view
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = viewMode === 'table' 
    ? filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredTickets;
  
  const displayTickets = paginatedTickets;

  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status === "Open" || t.status === "In Progress").length,
    resolved: safeTickets.filter((t) => t.status === "Resolved").length,
    feedbackSubmitted: safeTickets.filter((t) => t.feedbackSubmitted).length,
    activeChats: safeTickets.filter((t) => t.chatEnabled).length,
  };

  const getColorClasses = (color) => {
    const maps = {
      blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
      orange: "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400",
      green: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
      indigo: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400",
    };
    return maps[color] || maps.blue;
  };

  const getBgGradient = (color) => {
    const maps = {
      blue: "from-blue-50/80 to-transparent dark:from-blue-900/20",
      orange: "from-orange-50/80 to-transparent dark:from-orange-900/20",
      green: "from-green-50/80 to-transparent dark:from-green-900/20",
      purple: "from-purple-50/80 to-transparent dark:from-purple-900/20",
      indigo: "from-indigo-50/80 to-transparent dark:from-indigo-900/20",
    };
    return maps[color] || maps.blue;
  };

  const getIconBg = (color) => {
    const maps = {
      blue: "bg-blue-500 shadow-blue-500/30",
      orange: "bg-orange-500 shadow-orange-500/30",
      green: "bg-green-500 shadow-green-500/30",
      purple: "bg-purple-500 shadow-purple-500/30",
      indigo: "bg-indigo-500 shadow-indigo-500/30",
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
    };
    return maps[color] || maps.blue;
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    
    setDeleteLoading(ticketToDelete);
    try {
      await deleteTicket(ticketToDelete);
      toast.success("Ticket deleted successfully");
      setTicketToDelete(null);
    } catch (error) {
      toast.error("Failed to delete ticket");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">
              {isNewUser ? `Welcome to SOLEASE, ${userName}!` : `Welcome back, ${userName}!`}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isNewUser
                ? "Let's get you started with your first support request!"
                : "Manage and track your active support requests here."}
            </p>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Link
              to="/client-dashboard/new-ticket"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Submit New Ticket
            </Link>
          </motion.div> */}
        </div>

        {!loading && !error && safeTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-5 text-amber-500" />
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Quick actions available
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  label: "Submit Ticket", 
                  description: "Create a new support request",
                  icon: Plus, 
                  to: "/client-dashboard/new-ticket", 
                  color: "blue" 
                },
                { 
                  label: "My Tickets", 
                  description: "View all your tickets",
                  icon: Tickets, 
                  to: "/client-dashboard/all-tickets", 
                  color: "indigo" 
                },
                { 
                  label: "FAQ", 
                  description: "Get quick answers",
                  icon: HelpCircle, 
                  to: "/client-dashboard/faq", 
                  color: "emerald" 
                },
                { 
                  label: "Help Center", 
                  description: "Browse articles",
                  icon: BookOpen, 
                  to: "/help-support", 
                  color: "violet" 
                },
              ].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link
                    to={link.to}
                    className="flex flex-col p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 h-full relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-10 transition-transform duration-300 group-hover:scale-150 ${link.color === 'blue' ? 'bg-blue-500' : link.color === 'indigo' ? 'bg-indigo-500' : link.color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500'}`} />
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-lg ${link.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30' : link.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/30' : link.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-500/30'}`}>
                      <link.icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {link.description}
                    </p>
                    <div className="mt-auto pt-3 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <span>Learn more</span>
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && !error && safeTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 space-y-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Here's and overview of your support tickets
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Total Tickets", val: stats.total, icon: Tickets, color: "blue" },
                { label: "Pending Help", val: stats.open, icon: Clock, color: "orange" },
                { label: "Resolved", val: stats.resolved, icon: CheckCircle, color: "green" },
                { label: "Feedback", val: stats.feedbackSubmitted, icon: MessageSquare, color: "purple" },
                { label: "Active Chats", val: stats.activeChats, icon: MessageCircle, color: "blue" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 bg-gradient-to-br ${getBgGradient(stat.color)}`}
                >
                  <div className="relative">
                    <div className={`p-3 rounded-xl ${getIconBg(stat.color)}`}>
                      <stat.icon size={22} className="text-white" />
                    </div>
                    <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${getLiveDotColor(stat.color)} border-2 border-white dark:border-gray-800 rounded-full`}>
                      <span className="absolute inset-0 rounded-full bg-white dark:bg-gray-800 animate-ping opacity-75"></span>
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {<NumberTicker value={stat.val} />}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-2"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-2"></div>
            <p>Loading tickets...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center text-red-500 border border-red-200 dark:border-red-800"
          >
            Error fetching tickets: {error}
          </motion.div>
        ) : showWelcome ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-10"
          >
            <WelcomeMessage />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <p className="font-medium">Pro-tip: Click on Ticket ID, Urgency, and Updated headers to sort.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-800/40">
                <h2 className="text-sm font-medium text-gray-900 dark:text-white tracking-tight">Recent Tickets</h2>
                
                {/* Mobile: Stack vertically, Desktop: Horizontal */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Row 1: Search + View Mode Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <motion.div className="relative flex-1 sm:w-64" whileFocus={{ scale: 1.02 }}>
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300"
                      />
                      <input
                        type="text"
                        placeholder="Search by subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                        aria-label="Search tickets"
                      />
                    </motion.div>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                          viewMode === 'table'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        aria-label="Table view"
                        aria-pressed={viewMode === 'table'}
                      >
                        <Table size={18} />
                        <span className="text-xs font-medium hidden sm:inline">Table</span>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                          viewMode === 'list'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        aria-label="List view"
                        aria-pressed={viewMode === 'list'}
                      >
                        <List size={18} />
                        <span className="text-xs font-medium hidden sm:inline">List</span>
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                        aria-label="Grid view"
                        aria-pressed={viewMode === 'grid'}
                      >
                        <Grid size={18} />
                        <span className="text-xs font-medium hidden sm:inline">Grid</span>
                      </button>
                    </div>
                  </div>

                  {/* Row 2 (mobile) / Inline (desktop): Pagination + Items per page */}
                  {viewMode === 'table' && filteredTickets.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTickets.length)} / {filteredTickets.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        
                        {totalPages <= 5 ? (
                          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {page}
                            </button>
                          ))
                        ) : (
                          <>
                            {currentPage > 2 && (
                              <button
                                onClick={() => setCurrentPage(1)}
                                className="min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                1
                              </button>
                            )}
                            {currentPage > 3 && <span className="px-1 text-gray-400 text-xs">...</span>}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter(page => Math.abs(page - currentPage) <= 1)
                              .map((page) => (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium transition-colors ${
                                      currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                  {page}
                                </button>
                              ))
                            }
                            {currentPage < totalPages - 2 && <span className="px-1 text-gray-400 text-xs">...</span>}
                            {currentPage < totalPages - 1 && (
                              <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {totalPages}
                              </button>
                            )}
                          </>
                        )}

                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages}
                          className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Next page"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                      
                      {/* Items per page selector */}
                      <div className="relative">
                        <button
                          onClick={() => setItemsPerPageOpen(!itemsPerPageOpen)}
                          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                          <span className="hidden sm:inline">{itemsPerPage}</span>
                          <span className="sm:hidden">{itemsPerPage}/pg</span>
                          <ChevronDown size={12} className={`transition-transform ${itemsPerPageOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {itemsPerPageOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setItemsPerPageOpen(false)} 
                            />
                            <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20 min-w-[70px]">
                              {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                                <button
                                  key={num}
                                  onClick={() => { setItemsPerPage(num); setCurrentPage(1); setItemsPerPageOpen(false); }}
                                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                    itemsPerPage === num ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  {num} per page
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                    <tr>
                      {["Ticket", "Subject", "Type", "Urgency", "Location", "Status", "Updated", "Attachments", "Feedback", "Actions", "Delete"].map(
                        (header) => {
                          const sortKey = header === "Ticket" ? "ticketId" : header === "Urgency" ? "urgency" : header === "Updated" ? "updatedAt" : null;
                          return (
                            <th
                              key={header}
                              className={`px-6 py-4 text-[10px] text-left font-bold text-gray-400 uppercase tracking-widest ${
                                sortKey ? "cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" : ""
                              }`}
                              onClick={() => sortKey && handleSort(sortKey)}
                            >
                              {sortKey && sortConfig.key === sortKey ? (
                                <span className="inline-flex items-center gap-1 align-middle">
                                  <span>{header}</span>
                                  {sortConfig.direction === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                </span>
                              ) : (
                                <span>{header}</span>
                              )}
                            </th>
                          );
                        }
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {displayTickets.map((ticket) => (
                      <motion.tr
                        key={ticket._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                        className="group transition-colors duration-200 cursor-default dark:hover:bg-blue-900/5"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="inline-block font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md transition-all duration-200"
                            >
                              #{ticket._id.slice(-6).toUpperCase()}
                            </motion.span>
                            {ticket.urgency === "Critical" && (
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-normal text-gray-700 dark:text-gray-300 max-w-[200px] truncate text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{ticket.description?.slice(0, 40)}...</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <FileText size={12} />
                            {ticket.issueType || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <motion.span
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className={`inline-block px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                              ticket.urgency === "Critical"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 shadow-sm shadow-red-200/50 dark:shadow-red-900/30"
                                : ticket.urgency === "High"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 shadow-sm shadow-orange-200/50 dark:shadow-orange-900/30"
                                  : ticket.urgency === "Medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 shadow-sm shadow-yellow-200/50 dark:shadow-yellow-900/30"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-sm shadow-green-200/50 dark:shadow-green-900/30"
                            }`}
                          >
                            {ticket.urgency}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate font-normal group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-200">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} />
                            {ticket.location || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.span
                              animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-3 h-3 rounded-full shadow-sm ${
                                ticket.status === "Open"
                                  ? "bg-blue-500 shadow-blue-500/50"
                                  : ticket.status === "In Progress"
                                    ? "bg-yellow-500 shadow-yellow-500/50"
                                    : ticket.status === "Resolved"
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                              }`}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                              {ticket.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
                          <span className="inline-flex items-center gap-1 truncate">
                            <Calendar size={12} />
                            {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {ticket.attachments?.length > 0 ? (
                            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-1">
                              <a
                                href={`http://localhost:5001/uploads/${ticket.attachments[0].filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 transition-all duration-200"
                                title={ticket.attachments[0].originalName || ticket.attachments[0].filename}
                                aria-label={`Download ${ticket.attachments[0].originalName || ticket.attachments[0].filename}`}
                              >
                                <Paperclip size={14} />
                                <span className="text-xs font-medium max-w-[100px] truncate">
                                  {ticket.attachments[0].originalName || ticket.attachments[0].filename}
                                </span>
                              </a>
                              {ticket.attachments.length > 1 && (
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  +{ticket.attachments.length - 1} more
                                </span>
                              )}
                            </motion.div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {ticket.comments && ticket.comments.length > 0 ? (
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Link
                                to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                                className="inline-flex items-center justify-center p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                title="View feedback"
                                aria-label="View ticket feedback"
                              >
                                <Eye size={16} />
                              </Link>
                            </motion.div>
                          ) : (
                            <div className="inline-flex items-center justify-center p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg opacity-60">
                              <MessageCircle size={16} />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.div whileHover={{ x: 4 }}>
                            <Link
                              to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                              className="p-2 inline-block text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label="View ticket feedback"
                            >
                              <ArrowRight size={18} />
                            </Link>
                          </motion.div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <button
                              onClick={() => setTicketToDelete(ticket._id)}
                              disabled={deleteLoading === ticket._id}
                              className="p-2 inline-block text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                              aria-label="Delete ticket"
                              title="Delete ticket"
                            >
                              {deleteLoading === ticket._id ? (
                                <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              ) : viewMode === 'grid' ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayTickets.map((ticket) => (
                      <motion.div
                        key={ticket._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className="inline-block font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md"
                            >
                              #{ticket._id.slice(-6).toUpperCase()}
                            </motion.span>
                            {ticket.urgency === "Critical" && (
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical" />
                            )}
                          </div>
                          <motion.span
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              ticket.urgency === "Critical"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : ticket.urgency === "High"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                  : ticket.urgency === "Medium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            }`}
                          >
                            {ticket.urgency}
                          </motion.span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h3>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{ticket.description?.slice(0, 80)}...</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <motion.span
                            animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-2.5 h-2.5 rounded-full ${
                              ticket.status === "Open"
                                ? "bg-blue-500"
                                : ticket.status === "In Progress"
                                  ? "bg-yellow-500"
                                  : ticket.status === "Resolved"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                            }`}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.status}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                            <FileText size={10} />
                            {ticket.issueType || 'General'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={10} />
                            {ticket.location || '-'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            {ticket.attachments?.length > 0 ? (
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <Paperclip size={12} />
                                <span>{ticket.attachments.length}</span>
                              </div>
                            ) : null}
                            {ticket.comments && ticket.comments.length > 0 ? (
                              <Link
                                to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              >
                                <MessageCircle size={12} />
                                <span>{ticket.comments.length}</span>
                              </Link>
                            ) : null}
                          </div>
                           <Link
                             to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                             className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                           >
                             View
                             <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </Link>
                           <button
                             onClick={() => setTicketToDelete(ticket._id)}
                             disabled={deleteLoading === ticket._id}
                             className="text-sm font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors disabled:opacity-50"
                           >
                             {deleteLoading === ticket._id ? (
                               <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                             ) : (
                               <>
                                 <Trash2 size={14} />
                                 Delete
                               </>
                             )}
                           </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                      className="group flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer"
                    >
                      {/* Number */}
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-md">
                        {index + 1}
                      </div>
                      
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
                            #{ticket._id.slice(-6).toUpperCase()}
                          </span>
                          {ticket.urgency === "Critical" && (
                            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[9px] font-bold uppercase rounded animate-pulse">
                              Critical
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ticket.urgency === "Critical"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : ticket.urgency === "High"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                : ticket.urgency === "Medium"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          }`}>
                            {ticket.urgency}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.status === "Open"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : ticket.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                : ticket.status === "Resolved"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              ticket.status === "Open" ? "bg-blue-500" :
                              ticket.status === "In Progress" ? "bg-yellow-500" :
                              ticket.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
                            } ${ticket.status !== "Resolved" ? "animate-pulse" : ""}`} />
                            <span className="hidden sm:inline">{ticket.status}</span>
                            <span className="sm:hidden">{ticket.status === "In Progress" ? "Progress" : ticket.status}</span>
                          </span>
                        </div>
                        <h3 className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 hidden sm:block">
                          {ticket.description?.slice(0, 60)}...
                        </p>
                      </div>
                      
                      {/* Meta Info - Hidden on small screens */}
                      <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          <FileText size={12} />
                          {ticket.issueType || 'General'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {ticket.location || 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      
                      {/* Attachments & Feedback */}
                      <div className="hidden md:flex items-center gap-2">
                        {ticket.attachments && ticket.attachments.length > 0 && (
                          <a
                            href={`http://localhost:5001/uploads/${ticket.attachments[0].filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Paperclip size={14} />
                            <span>{ticket.attachments.length}</span>
                          </a>
                        )}
                        {ticket.comments && ticket.comments.length > 0 ? (
                          <Link
                            to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium"
                          >
                            <MessageCircle size={12} />
                            {ticket.comments.length}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400 hidden sm:inline">No feedback</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); setTicketToDelete(ticket._id); }}
                          disabled={deleteLoading === ticket._id}
                          className="p-1.5 sm:p-2 inline-block text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                          aria-label="Delete ticket"
                          title="Delete ticket"
                        >
                          {deleteLoading === ticket._id ? (
                            <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                className="p-5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-center transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Link
                  to="/client-dashboard/all-tickets"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  View All Support Tickets
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-600 dark:text-blue-400" />
                  Recent Conversations
                </h2>
              </div>

              <div className="p-5 space-y-6">
                {(() => {
                  const allMessages = [];
                  safeTickets.forEach((ticket) => {
                    ticket.comments?.forEach((comment) => {
                      if (!comment.isHidden) {
                        allMessages.push({
                          ...comment,
                          type: "comment",
                          ticketId: ticket._id,
                          ticketSubject: ticket.subject,
                          createdAt: comment.createdAt,
                        });
                        comment.replies?.forEach((reply) => {
                          allMessages.push({
                            ...reply,
                            type: "reply",
                            ticketId: ticket._id,
                            ticketSubject: ticket.subject,
                            createdAt: reply.createdAt,
                          });
                        });
                      }
                    });
                  });

                  allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  const roleGroups = { Client: [], Reviewer: [], Manager: [] };
                  allMessages.forEach((msg) => {
                    const role = msg.user?.role || "Unknown";
                    if (roleGroups[role] && roleGroups[role].length < 2) {
                      roleGroups[role].push(msg);
                    }
                  });

                  const hasMessages = Object.values(roleGroups).some((group) => group.length > 0);

                  return hasMessages ? (
                    <>
                      {["Client", "Reviewer", "Manager"].map(
                        (role) =>
                          roleGroups[role].length > 0 && (
                            <div key={role} className="space-y-3">
                              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    role === "Client"
                                      ? "bg-blue-500"
                                      : role === "Reviewer"
                                        ? "bg-green-500"
                                        : "bg-purple-500"
                                  }`}
                                />
                                {role} Conversations
                              </h3>
                              <div className="space-y-3">
                                {roleGroups[role].map((msg, idx) => (
                                  <Link
                                    key={`${role}-${idx}`}
                                    to={`/client-dashboard/ticket/${msg.ticketId}/feedback`}
                                    className="block p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <div className="flex items-start gap-3">
                                      {getProfileAvatar(msg.user, "sm")}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                                            {msg.user?.name || msg.user?.username || "Unknown"}
                                          </span>
                                          <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                            {msg.ticketSubject}
                                          </span>
                                          {msg.aiGenerated && (
                                            <span className="px-1 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold uppercase rounded">
                                              AI
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                                          {msg.type === "reply" && "-> "}
                                          {msg.content}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                          {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )
                      )}
                    </>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <MessageCircle size={32} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        No Conversations Yet
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Your active tickets will show recent conversations here once feedback is exchanged.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <AlertDialog open={!!ticketToDelete} onOpenChange={() => setTicketToDelete(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <Trash2 size={24} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this ticket. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              variant="destructive"
              onClick={handleDeleteTicket}
              disabled={deleteLoading === ticketToDelete}
            >
              {deleteLoading === ticketToDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ClientDashboard;
