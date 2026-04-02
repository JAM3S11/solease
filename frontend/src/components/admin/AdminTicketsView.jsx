import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { Plus, Ticket, CheckCircle, Clock, MessageCircle, Table, List, Grid, ChevronLeft, ChevronRight, ChevronDown, MessageSquare, Tickets, Users } from 'lucide-react'
import useTicketStore from '../../store/ticketStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SelectedTicketModal from '../ui/SelectedTicketModal'
import ExportData from '../../document/ExportData'
import TicketsTable from '../ui/TicketsTable'
import DetailedTicketsView from '../ui/DetailedTicketsView'
import { motion } from 'framer-motion';
import { NumberTicker } from '../ui/number-ticker';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const AdminTicketsView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25];
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);
  const [itSupportUsers, setItSupportUsers] = useState([]);

  const { fetchTickets, tickets, loading, error, deleteTicket } = useTicketStore();

  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDeleteTicket = async (ticketId) => {
    setDeleteLoading(ticketId);
    try {
      await deleteTicket(ticketId);
      toast.success("Ticket deleted successfully");
    } catch (error) {
      toast.error("Failed to delete ticket");
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    const fetchItSupportUsers = async () => {
      try {
        const res = await api.get("user/get-reviewers");
        setItSupportUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching reviewers:", err);
      }
    };
    fetchItSupportUsers();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, issueTypeFilter, statusFilter, dateFilter, viewMode]);

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // Card stats
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter(
      (t) => t.status === "Open"
    ).length,
    resolved: safeTickets.filter(
      (t) => t.status === "Resolved"
    ).length,
    feedbackSubmitted: safeTickets.filter(
      (t) => t.comments?.length > 0
    ).length,
    activeChats: safeTickets.filter(
      (t) => t.status === "In Progress"
    ).length,
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


  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Admin Tickets Overview
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage and analyze all support tickets
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ExportData data={safeTickets} fileName="admin_tickets.csv" />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
            <button
              onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Ticket</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        {!loading && safeTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 space-y-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Here's an overview of all support tickets
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Total Tickets", val: stats.total, icon: Tickets, color: "blue" },
                { label: "Pending Help", val: stats.open, icon: Clock, color: "orange" },
                { label: "Resolved", val: stats.resolved, icon: CheckCircle, color: "green" },
                { label: "Feedback", val: stats.feedbackSubmitted, icon: MessageSquare, color: "purple" },
                { label: "Active Chats", val: stats.activeChats, icon: MessageCircle, color: "indigo" },
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

        {/* Loading & Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            Loading tickets...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center text-red-500 border border-red-200 dark:border-red-800">
            Error fetching tickets: {error}
          </div>
        )}

        {!loading && !error && safeTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-40 -mt-40 opacity-40" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -ml-24 -mb-24 opacity-40" />
                
                <div className="relative p-8 sm:p-12 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 -rotate-6">
                      <Ticket className="text-white" size={56} />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Plus className="text-white" size={24} />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    No Support Tickets Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mb-2 leading-relaxed">
                    Your ticket management system is ready to go! This is where you'll view, track, and manage all support requests from your organization. When users submit issues, they will appear here for you to review, assign, and resolve.
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
                    Tickets can be submitted by employees reporting technical issues, software bugs, infrastructure problems, or any other IT-related concerns. Each ticket contains details about the issue, its urgency level, and allows for collaborative resolution with built-in feedback loops.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
                    >
                      <Plus size={20} />
                      Create Your First Ticket
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 sm:p-8 border border-blue-100 dark:border-blue-800/30">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                What You Can Do With This Page
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                    <Ticket className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">View All Tickets</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      See every support ticket submitted by users across your organization in one unified list with filtering and search capabilities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-indigo-600 dark:text-indigo-400" size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Track Resolution Progress</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Monitor the status of each ticket from open to resolved. See pending, in-progress, and completed tickets at a glance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Review User Feedback</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      After resolution, users can provide feedback on their experience. Review these comments to continuously improve your service quality.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                    <Clock className="text-emerald-600 dark:text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Analyze Response Times</h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Track how quickly tickets are being addressed. Identify bottlenecks and improve your team's response efficiency over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Total Tickets", val: 0, icon: Ticket, color: "blue" },
                { label: "Pending Help", val: 0, icon: Clock, color: "orange" },
                { label: "Resolved", val: 0, icon: CheckCircle, color: "green" },
                { label: "Feedback Received", val: 0, icon: MessageSquare, color: "purple" },
                { label: "Active Chats", val: 0, icon: MessageCircle, color: "indigo" },
              ].map((stat, i) => (
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <List className="text-blue-600 dark:text-blue-400" size={18} />
                  </div>
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Ticket List</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Table size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Grid size={18} />
                  </button>
                </div>
              </div>
              <div className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Ticket className="text-gray-300 dark:text-gray-500" size={40} />
                </div>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">No tickets to display</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Once users start submitting support tickets, they will appear here with all their details, status, and urgency levels.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Plus size={18} />
                    Create New Ticket
                  </button>
                  <button
                    onClick={() => navigate("/admin-dashboard/users")}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                  >
                    <Users size={18} />
                    Invite Users
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-center">
              <h4 className="text-xl font-bold text-white mb-2">Ready to Get Started?</h4>
              <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
                The best way to understand how this system works is to create a sample ticket. You can also invite team members to help manage the incoming support requests.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                  className="px-5 py-2.5 bg-white text-indigo-600 font-medium rounded-xl flex items-center gap-2 hover:bg-indigo-50 transition-colors"
                >
                  <Plus size={18} />
                  Create Ticket
                </button>
                <button 
                  onClick={() => navigate("/admin-dashboard/users")}
                  className="px-5 py-2.5 bg-indigo-500 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-indigo-400 transition-colors"
                >
                  <Users size={18} />
                  Manage Team
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && safeTickets.length > 0 && (
          issueTypeFilter ? (
            <DetailedTicketsView
              tickets={safeTickets.filter(t =>
                (!search || t.issueType?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase())) &&
                (t.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase()) &&
                (!statusFilter || t.status === statusFilter) &&
                (!dateFilter || new Date(t.createdAt).toISOString().split("T")[0] === dateFilter)
              )}
              role="admin"
              onRowClick={setSelectedTicket}
            />
          ) : (
            <TicketsTable
              tickets={safeTickets}
              role="admin"
              search={search}
              issueTypeFilter={issueTypeFilter}
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              onSearchChange={setSearch}
              onIssueTypeChange={setIssueTypeFilter}
              onStatusChange={setStatusFilter}
              onDateChange={setDateFilter}
              onRowClick={setSelectedTicket}
              viewMode={viewMode}
              setViewMode={setViewMode}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              itemsPerPageOpen={itemsPerPageOpen}
              setItemsPerPageOpen={setItemsPerPageOpen}
              ITEMS_PER_PAGE_OPTIONS={ITEMS_PER_PAGE_OPTIONS}
              showDelete={true}
              onDelete={handleDeleteTicket}
              deleteLoading={deleteLoading}
            />
          )
        )}
      </div>
      {selectedTicket &&
        <SelectedTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          itSupportUsers={itSupportUsers}
          onUpdate={(updatedTicket) => setSelectedTicket(updatedTicket)}
        />
      }
    </DashboardLayout>
  )
}

export default AdminTicketsView;