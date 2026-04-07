import React, { useEffect, useState } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import {
  Plus, CheckCircle,
  Clock, MessageCircle, Paperclip, Eye, ArrowRight,
  Tickets,
  MessageSquare, MapPin, Calendar, FileText, Trash2
} from "lucide-react";
import useTicketStore from "../../store/ticketStore";
import SelectedTicketModal from "../ui/SelectedTicketModal";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import NoTicketComponent from "../ui/NoTicketComponent";
import TicketsTable from "../ui/TicketsTable";
import { NumberTicker } from "../ui/number-ticker";
import toast from "react-hot-toast";
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

const ClientAllTicketPage = () => {
  const { user } = useAuthenticationStore();
  const { fetchTickets, tickets, loading, error, deleteTicket } = useTicketStore();

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    setSelectedTicket(null);
  }, [search, issueTypeFilter, statusFilter, dateFilter]);

  const safeTickets = Array.isArray(tickets) ? tickets.filter(t => t && t._id) : [];

  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter(
      (t) => t.status === "Open" || t.status === "OPEN"
    ).length,
    resolved: safeTickets.filter(
      (t) => t.status === "Resolved" || t.status === "RESOLVED"
    ).length,
    feedbackSubmitted: safeTickets.filter(
      (t) => t.comments?.length > 0
    ).length,
    activeChats: safeTickets.filter(
      (t) => t.status === "In Progress" || t.status === "IN_PROGRESS"
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

  const handleDeleteTicket = async (ticketId) => {
    if (!ticketId) return;
    
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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header Section */}
        {!loading && !error && safeTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                {user?.name ? `${user.name}'s Tickets` : "My Tickets"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Manage and track your support requests
              </p>
            </div>
            <button
              onClick={() => navigate("/client-dashboard/new-ticket")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={18} /> New Ticket
            </button>
          </motion.div>
        )}

        {/* No Tickets State */}
        {!loading && !error && safeTickets.length === 0 && (
          <NoTicketComponent noTicket={user?.name} type="client" />
        )}

        {/* Stats Section */}
        {!loading && safeTickets.length > 0 && (
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
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

        {!loading && !error && safeTickets.length > 0 && (
          <>
            <TicketsTable
              tickets={safeTickets}
              role="client"
              search={search}
              issueTypeFilter={issueTypeFilter}
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              onSearchChange={setSearch}
              onIssueTypeChange={setIssueTypeFilter}
              onStatusChange={setStatusFilter}
              onDateChange={setDateFilter}
              onRowClick={setSelectedTicket}
              showDelete={true}
              onDelete={handleDeleteTicket}
              deleteLoading={deleteLoading}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </>
        )}
      </div>

      {selectedTicket && (
        <SelectedTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

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
              onClick={() => handleDeleteTicket(ticketToDelete)}
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

export default ClientAllTicketPage;