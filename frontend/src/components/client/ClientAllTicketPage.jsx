import React, { useEffect, useState } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import {
  Plus, CheckCircle,
  Clock, MessageCircle, Search, Paperclip, Eye, ArrowRight,
  Tickets,
  MessageSquare, List, Grid, Table, MapPin, Calendar, FileText
} from "lucide-react";
import useTicketStore from "../../store/ticketStore";
import SelectedTicketModal from "../ui/SelectedTicketModal";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import NoTicketComponent from "../ui/NoTicketComponent";
import TicketsTable from "../ui/TicketsTable";
import DetailedTicketsView from "../ui/DetailedTicketsView";
import { NumberTicker } from "../ui/number-ticker";

const ClientAllTicketPage = () => {
  const { user } = useAuthenticationStore();
  const { fetchTickets, tickets, loading, error } = useTicketStore();

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const navigate = useNavigate();

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
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
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

        {!loading && !error
          && safeTickets.length === 0 && <NoTicketComponent noTicket={user?.name} />
        }

        {!loading && !error && safeTickets.length > 0 && (
          <div className="space-y-4">
            {/* View Toggle and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Table view"
                  >
                    <Table size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="List view"
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Grid view"
                  >
                    <Grid size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={issueTypeFilter}
                  onChange={(e) => setIssueTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Types</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing">Billing</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filtered Tickets */}
            {(() => {
              const filteredTickets = safeTickets.filter(t =>
                (!search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase())) &&
                (!issueTypeFilter || t.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase()) &&
                (!statusFilter || t.status === statusFilter) &&
                (!dateFilter || new Date(t.createdAt).toISOString().split("T")[0] === dateFilter)
              );

              if (filteredTickets.length === 0) {
                return (
                  <div className="text-center py-12">
                    <Tickets size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No tickets found matching your filters</p>
                  </div>
                );
              }

              if (viewMode === 'table') {
                return (
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                      <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Urgency</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:table-cell">Location</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Created</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attachments</th>
                          <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Feedback</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {filteredTickets.map((ticket) => (
                          <motion.tr
                            key={ticket._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                            className="group cursor-pointer transition-colors"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded">
                                  #{ticket._id.slice(-6).toUpperCase()}
                                </span>
                                {ticket.priority === "High" || ticket.urgency === "Critical" ? (
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="High Priority" />
                                ) : null}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="max-w-[180px]">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{ticket.subject}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{ticket.description?.slice(0, 50)}...</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                                <FileText size={12} />
                                {ticket.issueType || 'General'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                ticket.urgency === "Critical"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 shadow-sm shadow-red-200/50"
                                  : ticket.urgency === "High"
                                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                                    : ticket.urgency === "Medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                      : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                              }`}>
                                {ticket.urgency}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <motion.span
                                  animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                                    ticket.status === "Open" ? "bg-blue-500 shadow-blue-500/50" :
                                    ticket.status === "In Progress" ? "bg-yellow-500 shadow-yellow-500/50" :
                                    ticket.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
                                  }`}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{ticket.status}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <MapPin size={12} />
                                {ticket.location || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Calendar size={12} />
                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {ticket.attachments && ticket.attachments.length > 0 ? (
                                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-1">
                                  <a
                                    href={`http://localhost:5001/uploads/${ticket.attachments[0].filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    <Paperclip size={12} />
                                    {ticket.attachments.length}
                                  </a>
                                  {ticket.attachments.length > 1 && (
                                    <span className="text-xs text-gray-400">+{ticket.attachments.length - 1}</span>
                                  )}
                                </motion.div>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {ticket.comments && ticket.comments.length > 0 ? (
                                <Link
                                  to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                                >
                                  <MessageCircle size={12} />
                                  <span className="text-xs font-medium">{ticket.comments.length}</span>
                                </Link>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-md">
                                  <MessageCircle size={12} />
                                  <span className="text-xs">0</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <ArrowRight size={18} />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (viewMode === 'grid') {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTickets.map((ticket) => (
                      <motion.div
                        key={ticket._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className="group bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md">
                              #{ticket._id.slice(-6).toUpperCase()}
                            </span>
                            {ticket.urgency === "Critical" && (
                              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase rounded animate-pulse">
                                Critical
                              </span>
                            )}
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
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
                        </div>
                        
                        {/* Subject */}
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h3>
                        
                        {/* Description Preview */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        {/* Status & Type */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <motion.span
                              animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-2.5 h-2.5 rounded-full ${
                                ticket.status === "Open" ? "bg-blue-500" :
                                ticket.status === "In Progress" ? "bg-yellow-500" :
                                ticket.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.status}</span>
                          </div>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FileText size={12} />
                            {ticket.issueType || 'General'}
                          </span>
                        </div>
                        
                        {/* Location & Date */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {ticket.location || 'Not specified'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-3">
                            {ticket.attachments && ticket.attachments.length > 0 ? (
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Paperclip size={14} />
                                <span>{ticket.attachments.length}</span>
                              </div>
                            ) : null}
                            {ticket.comments && ticket.comments.length > 0 ? (
                              <Link
                                to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                              >
                                <MessageCircle size={14} />
                                <span>{ticket.comments.length}</span>
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-400">No feedback</span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 flex items-center gap-1">
                            View Details
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              }

              // List view
              return (
                <div className="space-y-3">
                  {filteredTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedTicket(ticket)}
                      className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer"
                    >
                      {/* Number */}
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-md">
                        {index + 1}
                      </div>
                      
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-md">
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
                          <motion.span
                            animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-2 h-2 rounded-full ${
                              ticket.status === "Open" ? "bg-blue-500" :
                              ticket.status === "In Progress" ? "bg-yellow-500" :
                              ticket.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.status}</span>
                        </div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {ticket.description?.slice(0, 80)}...
                        </p>
                      </div>
                      
                      {/* Meta Info - Hidden on small screens */}
                      <div className="hidden lg:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                      <div className="hidden md:flex items-center gap-3">
                        {ticket.attachments && ticket.attachments.length > 0 && (
                          <a
                            href={`http://localhost:5001/uploads/${ticket.attachments[0].filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <Paperclip size={14} />
                            <span>{ticket.attachments.length}</span>
                          </a>
                        )}
                        {ticket.comments && ticket.comments.length > 0 ? (
                          <Link
                            to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-md text-xs font-medium"
                          >
                            <MessageCircle size={12} />
                            {ticket.comments.length}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-400">No feedback</span>
                        )}
                      </div>
                      
                      {/* Arrow */}
                      <ArrowRight size={18} className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors group-hover:translate-x-1" />
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {selectedTicket && (
        <SelectedTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default ClientAllTicketPage;