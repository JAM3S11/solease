import React, { useEffect, useState, Fragment } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import useTicketStore from '../../store/ticketStore';
import { Inbox, ChevronDown, Check, AlertTriangle, Clock, Calendar, Tickets, Table, List, Grid, Users, Plus, ArrowRight, CheckCircle, MessageSquare } from 'lucide-react';
import api from '../../lib/axios';
import { useNavigate } from 'react-router';
import TicketDetailModal from '../ui/TicketDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { NumberTicker } from '../ui/number-ticker';
import TicketsTable from '../ui/TicketsTable';
import toast from 'react-hot-toast';

const AdminPendingTickets = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [urgencyGetter, setUrgency] = useState("");
  const [dateGetter, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [itSupportUsers, setItSupportUsers] = useState([]);
  
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25];
  const [itemsPerPageOpen, setItemsPerPageOpen] = useState(false);

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
    setCurrentPage(1);
  }, [search, urgencyGetter, dateGetter, statusFilter, viewMode]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const pendingAdminTickets = tickets.filter((ticket) => !ticket.assignedTo);
  const totalPendingTickets = pendingAdminTickets.length;

  const oldTickets = pendingAdminTickets.length
    ? new Date(Math.min(...pendingAdminTickets.map((t) => new Date(t.createdAt)))).toLocaleDateString()
    : 'N/A';

  const now = new Date();
  const slaBreachingTickets = pendingAdminTickets.filter((t) => {
    const created = new Date(t.createdAt);
    const differnceInDays = (now - created) / (1000 * 60 * 60 * 24);
    return differnceInDays > 7;
  }).length;

  const filterPendingTickets = pendingAdminTickets.filter((ticket) => {
    const matchSearch =
      ticket.issueType.toLowerCase().includes(search.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(search.toLowerCase());
    const matchUrgency = urgencyGetter ? ticket.urgency === urgencyGetter : true;
    const matchDate = dateGetter
      ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateGetter
      : true;
    return matchSearch && matchUrgency && matchDate;
  });

  const sortPendingTickets = [...filterPendingTickets].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const urgencyOptions = ["Low", "Medium", "High", "Critical"];

  const getBgGradient = (color) => {
    const maps = {
      blue: "from-blue-50/80 to-transparent dark:from-blue-900/20",
      orange: "from-orange-50/80 to-transparent dark:from-orange-900/20",
      red: "from-red-50/80 to-transparent dark:from-red-900/20",
    };
    return maps[color] || maps.blue;
  };

  const getIconBg = (color) => {
    const maps = {
      blue: "bg-blue-500 shadow-blue-500/30",
      orange: "bg-orange-500 shadow-orange-500/30",
      red: "bg-red-500 shadow-red-500/30",
    };
    return maps[color] || maps.blue;
  };

  const getLiveDotColor = (color) => {
    const maps = {
      blue: "bg-blue-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
    };
    return maps[color] || maps.blue;
  };

  return (
    <DashboardLayout>
      <div className='p-4 sm:p-6 lg:p-8'>
        {/* Header with Motion */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className='flex flex-col items-start mb-6 space-y-3'
        >
          <h3 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200'>
            Pending Tickets
          </h3>
          <p className='text-sm md:text-base text-gray-600 font-normal text-foreground-light dark:text-foreground-dark'>
            Overview of all pending tickets awaiting to be assigned
          </p>
        </motion.div>

{/* Stats Cards with Motion */}
        {totalPendingTickets > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 space-y-4"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Here's an overview of pending tickets awaiting assignment
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Total Pending", val: totalPendingTickets, icon: Tickets, color: "blue" },
              { label: "Oldest Ticket", val: oldTickets, icon: Calendar, color: "orange" },
              { label: "SLA Breach", val: slaBreachingTickets, icon: AlertTriangle, color: "red" },
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
                    {loading ? "..." : <NumberTicker value={stat.val} />}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        )}

        {/* Search and Listbox Filters */}
        {totalPendingTickets > 0 && (
        <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div className='w-full md:w-2/5'>
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search subject, urgency or status...'
              className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
          </div>

          <div className='flex flex-col sm:flex-row w-full md:w-auto justify-end gap-4 z-20'>
            {/* Urgency Listbox */}
            <div className="w-full sm:w-40">
              <Listbox value={urgencyGetter} onChange={setUrgency}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="block truncate">{urgencyGetter || "Urgency"}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                      <ListboxOption value="" className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-gray-300'}`}>
                        All Urgency
                      </ListboxOption>
                      {urgencyOptions.map((opt) => (
                        <ListboxOption key={opt} value={opt} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-gray-300'}`}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>{opt}</span>
                              {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check size={16} /></span>}
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>

            <input
              type='date'
              value={dateGetter}
              onChange={(e) => setDate(e.target.value)}
              className='w-full sm:w-40 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
            />
          </div>
        </div>
        )}

<div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <p className="font-medium">Pro-tip: Click any row to view full ticket details and history.</p>
        </div>

        {/* Table Section */}
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex justify-center items-center py-16'>
              <p className='text-gray-600 dark:text-gray-400 animate-pulse'>Loading tickets...</p>
            </motion.div>
          ) : totalPendingTickets === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-amber-50 dark:from-orange-900/10 dark:via-transparent dark:to-amber-900/10" />
                  <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100 dark:bg-orange-900/20 rounded-full -mr-40 -mt-40 opacity-40" />
                  <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-100 dark:bg-amber-900/20 rounded-full -ml-24 -mb-24 opacity-40" />
                  
                  <div className="relative p-8 sm:p-12 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 -rotate-6">
                        <Inbox className="text-white" size={56} />
                      </div>
                      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Plus className="text-white" size={24} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                      No Pending Tickets
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mb-2 leading-relaxed">
                      Great news! There are no tickets waiting to be assigned right now. All incoming support requests have been assigned to your IT support team members for resolution.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
                      Pending tickets appear here when users submit new support requests that haven't yet been assigned to a specific support agent. Once assigned, tickets move out of this view and into the active ticket management system where progress can be tracked.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-orange-600/25 transition-all"
                      >
                        <Plus size={20} />
                        Create a Sample Ticket
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-3xl p-6 sm:p-8 border border-orange-100 dark:border-orange-800/30">
                <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
                  Understanding Pending Tickets
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center">
                      <Inbox className="text-orange-600 dark:text-orange-400" size={20} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">What Are Pending Tickets?</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pending tickets are support requests that have been submitted by users but haven't yet been assigned to a specific IT support team member for resolution. These tickets require your attention to be routed to the appropriate handler.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="text-amber-600 dark:text-amber-400" size={20} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">SLA Breach Warnings</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        If a pending ticket exceeds 7 days without being assigned, it's flagged as an SLA breach. These are highlighted in red to ensure critical issues don't fall through the cracks and get addressed promptly.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                      <Clock className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Quick Assignment</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You can quickly assign pending tickets to your IT support team members directly from this view. Click on any ticket to open its details and select an assignee from your team list.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                      <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Ticket Lifecycle</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Once assigned, tickets move through stages: Open, In Progress, and Resolved. You can track overall progress from your main dashboard where statistics show ticket resolution rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Total Pending", val: 0, icon: Tickets, color: "blue" },
                  { label: "Oldest Ticket", val: "N/A", icon: Calendar, color: "orange" },
                  { label: "SLA Breach", val: 0, icon: AlertTriangle, color: "red" },
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
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <List className="text-orange-600 dark:text-orange-400" size={18} />
                    </div>
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Pending Tickets List</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Table size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      <Grid size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-8 sm:p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Inbox className="text-gray-300 dark:text-gray-500" size={40} />
                  </div>
                  <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">No pending tickets to display</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    When users submit new support tickets that haven't been assigned yet, they will appear in this list. Use the filters above to search and sort through tickets.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors"
                    >
                      <Plus size={18} />
                      Create Sample Ticket
                    </button>
                    <button
                      onClick={() => navigate("/admin-dashboard/users")}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:border-orange-300 dark:hover:border-orange-500 transition-colors"
                    >
                      <Users size={18} />
                      Manage Team
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-center">
                <h4 className="text-xl font-bold text-white mb-2">Keep Things Running Smoothly</h4>
                <p className="text-orange-100 mb-6 max-w-lg mx-auto">
                  Regularly check this page to ensure new tickets are being assigned promptly. You can also create test tickets to train your team or verify the system is working correctly.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button 
                    onClick={() => navigate("/admin-dashboard/admin-new-ticket")}
                    className="px-5 py-2.5 bg-white text-orange-600 font-medium rounded-xl flex items-center gap-2 hover:bg-orange-50 transition-colors"
                  >
                    <Plus size={18} />
                    Create Ticket
                  </button>
                  <button 
                    onClick={() => navigate("/admin-dashboard/users")}
                    className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-orange-400 transition-colors"
                  >
                    <Users size={18} />
                    Manage Team
                  </button>
                  <button 
                    onClick={() => navigate("/admin-dashboard/admin-tickets")}
                    className="px-5 py-2.5 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-amber-400 transition-colors"
                  >
                    <Tickets size={18} />
                    View All Tickets
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <TicketsTable
              tickets={sortPendingTickets}
              role="admin"
              search={search}
              issueTypeFilter=""
              statusFilter={statusFilter}
              dateFilter={dateGetter}
              onSearchChange={setSearch}
              onIssueTypeChange={() => {}}
              onStatusChange={setStatusFilter}
              onDateChange={setDate}
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
          )}
        </AnimatePresence>
      </div>
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          itSupportUsers={itSupportUsers}
          onUpdate={(updatedTicket) => setSelectedTicket(updatedTicket)}
        />
      )}
    </DashboardLayout>
  )
}

export default AdminPendingTickets;