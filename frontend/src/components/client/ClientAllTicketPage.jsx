import React, { useEffect, useState, Fragment } from "react";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import { Plus, Search, Calendar, Ticket, CheckCircle, Clock, ChevronDown, Check } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import useTicketStore from "../../store/ticketStore";
import SelectedTicketModal from "../ui/SelectedTicketModal";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import NoTicketComponent from "../ui/NoTicketComponent";

// Defined status options for the Listbox
const statusOptions = [
  { name: "All Status", value: "" },
  { name: "Open", value: "Open" },
  { name: "In Progress", value: "In Progress" },
  { name: "Resolved", value: "Resolved" },
];

const ClientAllTicketPage = () => {
  const { user } = useAuthenticationStore();
  const { fetchTickets, tickets, loading, error } = useTicketStore();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusOptions[0]); // Set default to "All Status" object
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // Stats for the "amount of cards" section
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status === "Open").length,
    resolved: safeTickets.filter((t) => t.status === "Resolved").length,
  };

  const filteredTickets = safeTickets.filter((ticket) => {
    const matchesSearch =
      (ticket.issueType?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (ticket.description?.toLowerCase() || "").includes(search.toLowerCase());
    
    // Updated to use statusFilter.value from the Listbox object
    const matchesStatus = statusFilter.value ? ticket.status === statusFilter.value : true;
    
    let matchesDate = true;
    if (dateFilter && ticket.createdAt) {
      const ticketDate = new Date(ticket.createdAt);
      if (!isNaN(ticketDate.getTime())) {
        matchesDate = ticketDate.toISOString().split("T")[0] === dateFilter;
      } else {
        matchesDate = false;
      }
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage and track your support requests</p>
          </div>
          <button
            onClick={() => navigate("/client-dashboard/new-ticket")}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
          >
            <Plus size={18} /> New Ticket
          </button>
        </motion.div>

        {/* Amount of Cards Section */}
        {!loading && safeTickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Tickets", value: stats.total, icon: <Ticket className="text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-900/10" },
              { label: "Open Issues", value: stats.open, icon: <Clock className="text-amber-500" />, bg: "bg-amber-50 dark:bg-amber-900/10" },
              { label: "Resolved", value: stats.resolved, icon: <CheckCircle className="text-green-500" />, bg: "bg-green-50 dark:bg-green-900/10" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`${stat.bg} p-5 rounded-2xl border border-white/50 dark:border-gray-800 shadow-sm flex items-center justify-between`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  {stat.icon}
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

        {!loading && !error && safeTickets.length === 0 && <NoTicketComponent noTicket={user?.name} />}

        {!loading && !error && safeTickets.length > 0 && (
          <>
            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                />
              </div>

              {/* Headless UI Listbox */}
              <div className="w-full">
                <Listbox value={statusFilter} onChange={setStatusFilter}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-default rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-4 pr-10 text-left focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm">
                      <span className="block truncate">{statusFilter.name}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </ListboxButton>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {statusOptions.map((status, idx) => (
                          <ListboxOption
                            key={idx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-300"
                              }`
                            }
                            value={status}
                          >
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                  {status.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all sm:text-sm"
                />
              </div>
            </div>

            {/* Alert / Hint Section */}
            <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <p className="font-medium">Pro-tip: Click any row to view full ticket details and history.</p>
            </div>

            {/* Table Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      {["Ticket ID", "Issue Type", "Description", "Urgency", "Assigned To", "Status"].map((col) => (
                        <th key={col} className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                          No tickets found matching your search criteria
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <tr
                          key={ticket._id}
                          onClick={() => setSelectedTicket(ticket)}
                          className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                              #{ticket._id.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm border ${
                                {
                                  "Hardware issue": "bg-blue-100 text-blue-700 border-blue-200",
                                  "Software issue": "bg-emerald-100 text-emerald-700 border-emerald-200",
                                  "Network Connectivity": "bg-rose-100 text-rose-700 border-rose-200",
                                  "Account Access": "bg-amber-100 text-amber-700 border-amber-200",
                                  Other: "bg-gray-100 text-gray-700 border-gray-200",
                                }[ticket.issueType] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {ticket.issueType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 max-w-[200px]">{ticket.description}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                {
                                  Critical: "bg-red-100 text-red-700",
                                  High: "bg-orange-100 text-orange-700",
                                  Medium: "bg-yellow-100 text-yellow-700",
                                  Low: "bg-green-100 text-green-700",
                                }[ticket.urgency] || "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {ticket.urgency}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] text-blue-600">
                                {ticket.assignedTo ? ticket.assignedTo.username.charAt(0).toUpperCase() : "?"}
                              </div>
                              {ticket.assignedTo ? ticket.assignedTo.username : <span className="text-gray-400 italic font-normal">Unassigned</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold shadow-sm ${
                                {
                                  Open: "bg-blue-600 text-white",
                                  "In Progress": "bg-amber-500 text-white",
                                  Resolved: "bg-green-600 text-white",
                                }[ticket.status] || "bg-gray-400 text-white"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {selectedTicket && 
        <SelectedTicketModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)}
         />
      }
    </DashboardLayout>
  );
};

export default ClientAllTicketPage;