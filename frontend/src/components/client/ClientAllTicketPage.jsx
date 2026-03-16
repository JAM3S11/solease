import React, { useEffect, useState, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import {
  Plus, CheckCircle,
  Clock, MessageCircle, Search, Paperclip, Eye, ArrowRight,
  Tickets,
  MessageSquare, List, Grid, Table, MapPin, Calendar, FileText, ChevronDown, Check, ChevronLeft, ChevronRight, Trash2
} from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import useTicketStore from "../../store/ticketStore";
import SelectedTicketModal from "../ui/SelectedTicketModal";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import NoTicketComponent from "../ui/NoTicketComponent";
import TicketsTable from "../ui/TicketsTable";
import DetailedTicketsView from "../ui/DetailedTicketsView";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25];
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, issueTypeFilter, statusFilter, dateFilter, itemsPerPage]);

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const filteredTickets = safeTickets.filter(t =>
    (!search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase())) &&
    (!issueTypeFilter || t.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase()) &&
    (!statusFilter || t.status === statusFilter) &&
    (!dateFilter || new Date(t.createdAt).toISOString().split("T")[0] === dateFilter)
  );

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

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
        {/* Header Section */}
        {!loading && !error && safeTickets.length > 0 && (
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

        {!loading && !error && safeTickets.length > 0 && (
          <div className="space-y-4">
            {/* View Toggle and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => { setViewMode('table'); setCurrentPage(1); }}
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
                    onClick={() => { setViewMode('list'); setCurrentPage(1); }}
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
                    onClick={() => { setViewMode('grid'); setCurrentPage(1); }}
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
                {viewMode === 'table' && filteredTickets.length > 0 && (
                  <div className="hidden md:flex items-center gap-2 flex-wrap lg:flex-nowrap justify-end">
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
                        <span className="hidden lg:inline">{itemsPerPage}</span>
                        <span className="lg:hidden">{itemsPerPage}/pg</span>
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
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <div className="w-full sm:w-44">
                  <Listbox value={issueTypeFilter} onChange={setIssueTypeFilter}>
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-default rounded-xl bg-white dark:bg-gray-800 py-2.5 pl-3 pr-10 text-left border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span className="block truncate">{issueTypeFilter || "All Types"}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown className="h-4 w-4 text-gray-400" /></span>
                      </ListboxButton>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-xs z-50">
                          <ListboxOption value="" className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                            All Types
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={14} /></span>
                          </ListboxOption>
                          {["Hardware Issue", "Software Issue", "Network Connectivity", "Account Access", "Other"].map((type) => (
                            <ListboxOption key={type} value={type} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-bold text-blue-600' : 'font-normal'}`}>{type}</span>
                                  {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={14} /></span>}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <div className="w-full sm:w-40">
                  <Listbox value={statusFilter} onChange={setStatusFilter}>
                    <div className="relative">
                      <ListboxButton className="relative w-full cursor-default rounded-xl bg-white dark:bg-gray-800 py-2.5 pl-3 pr-10 text-left border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span className="block truncate">{statusFilter || "All Status"}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown className="h-4 w-4 text-gray-400" /></span>
                      </ListboxButton>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-xs z-50">
                          <ListboxOption value="" className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                            All Status
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={14} /></span>
                          </ListboxOption>
                          {["Open", "In Progress", "Resolved"].map((status) => (
                            <ListboxOption key={status} value={status} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-bold text-blue-600' : 'font-normal'}`}>{status}</span>
                                  {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={14} /></span>}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>

                <div className="relative w-full sm:w-40">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pagination - Below filters on mobile, inline on desktop */}
            {viewMode === 'table' && filteredTickets.length > 0 && (
              <div className="flex md:hidden items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length}
                  </span>
                  <Listbox value={itemsPerPage} onChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}>
                    <div className="relative">
                      <ListboxButton className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        {itemsPerPage}/pg
                        <ChevronDown size={12} />
                      </ListboxButton>
                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <ListboxOptions className="absolute mt-1 max-h-40 w-24 overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-xs z-50">
                          {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                            <ListboxOption key={num} value={num} className={({ active }) => `relative cursor-pointer select-none py-1.5 pl-8 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-bold text-blue-600' : 'font-normal'}`}>{num}/pg</span>
                                  {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={12} /></span>}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[36px] text-center">
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Filtered Tickets */}
            {(() => {
              if (filteredTickets.length === 0) {
                return (
                  <div className="text-center py-12">
                    <Tickets size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No tickets found matching your filters</p>
                  </div>
                );
              }

              if (viewMode === 'table') {
                const paginatedTickets = filteredTickets.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                );
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
                        {paginatedTickets.map((ticket) => (
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
                              <div className="flex items-center justify-end gap-1">
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
                                <Link
                                  to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 inline-block text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                                  aria-label="View ticket feedback"
                                >
                                  <ArrowRight size={18} />
                                </Link>
                              </div>
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
                            <button
                              onClick={(e) => { e.stopPropagation(); setTicketToDelete(ticket._id); }}
                              disabled={deleteLoading === ticket._id}
                              className="p-1.5 inline-block text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                              aria-label="Delete ticket"
                              title="Delete ticket"
                            >
                              {deleteLoading === ticket._id ? (
                                <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
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
                          <Link
                            to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 flex items-center gap-1 transition-colors"
                          >
                            View Details
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
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

export default ClientAllTicketPage;