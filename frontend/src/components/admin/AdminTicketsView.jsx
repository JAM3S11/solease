import React, { useEffect, useState } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { Plus, Ticket, CheckCircle, Clock, MessageCircle } from 'lucide-react'
import useTicketStore from '../../store/ticketStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SelectedTicketModal from '../ui/SelectedTicketModal'
import ExportData from '../../document/ExportData'
import TicketsTable from '../ui/TicketsTable'
import DetailedTicketsView from '../ui/DetailedTicketsView'
import { motion } from 'framer-motion';

const AdminTicketsView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { fetchTickets, tickets, loading, error } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

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
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Admin Tickets Overview
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Manage and analyze all support tickets
            </p>
          </div>
          <div className="flex gap-2">
            <ExportData data={safeTickets} fileName="admin_tickets.csv" />
            <button
              onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={18} /> Create New Ticket
            </button>
          </div>
        </motion.div>

        {/* Stats Section */}
        {!loading && safeTickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total",
                value: stats.total,
                icon: <Ticket className="text-blue-500" />,
                bg: "bg-blue-50 dark:bg-blue-900/10"
              },
              {
                label: "Open",
                value: stats.open,
                icon: <Clock className="text-amber-500" />,
                bg: "bg-amber-50 dark:bg-amber-900/10"
              },
              {
                label: "Resolved",
                value: stats.resolved,
                icon: <CheckCircle className="text-green-500" />,
                bg: "bg-green-50 dark:bg-green-900/10"
              },
              {
                label: "Feedback",
                value: stats.feedbackSubmitted,
                icon: <MessageCircle className="text-purple-500" />,
                bg: "bg-purple-50 dark:bg-purple-900/10"
              },
              {
                label: "Active",
                value: stats.activeChats,
                icon: <MessageCircle className="text-indigo-500" />,
                bg: "bg-indigo-50 dark:bg-indigo-900/10"
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`${stat.bg} p-4 rounded-2xl border border-white/50 dark:border-gray-800 shadow-sm flex items-center justify-between`}
              >
                <div>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  {React.cloneElement(stat.icon, { size: 20 })}
                </div>
              </motion.div>
            ))}
          </div>
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
            />
          )
        )}
      </div>
      {selectedTicket &&
        <SelectedTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      }
    </DashboardLayout>
  )
}

export default AdminTicketsView;