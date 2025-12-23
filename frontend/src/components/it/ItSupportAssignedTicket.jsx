import React, { useEffect, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Inbox, Loader2, Search, Calendar, ChevronDown, Check } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { useNavigate } from "react-router";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";

const STATUS_OPTIONS = [
  { name: "All Status", value: "" },
  { name: "Open", value: "Open" },
  { name: "In Progress", value: "In Progress" },
  { name: "Resolved", value: "Resolved" },
];

const ItSupportAssignedTicket = () => {
  const [searchBar, setSearchBar] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const { fetchTickets, tickets, loading, error } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const assignedTickets = tickets.filter(
    (ticket) => ticket.assignedTo?._id === user?._id
  );

  const filteredTickets = assignedTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchBar.toLowerCase()) ||
      ticket.urgency.toLowerCase().includes(searchBar.toLowerCase());

    const matchesStatus = selectedStatus.value ? ticket.status === selectedStatus.value : true;
    const matchesDate = dateFilter
      ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start space-y-1"
          >
            <h3 className="text-xl sm:text-2xl font-black text-foreground-light dark:text-foreground-dark tracking-tight">
              {user?.name ? `${user.name}'s Assigned Tickets` : "Assigned Tickets"}
            </h3>
            <p className="text-sm text-gray-500 font-medium">Overview of your active workload</p>
          </motion.div>
          <div className="flex md:justify-end">
            <button
              onClick={() => navigate("/itsupport-dashboard/new-ticket")}
              className="group flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-200 dark:shadow-none"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={searchBar}
              onChange={(e) => setSearchBar(e.target.value)}
              placeholder="Search subject or urgency..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Headless UI Listbox Status Filter */}
          <Listbox value={selectedStatus} onChange={setSelectedStatus}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-default rounded-xl bg-white dark:bg-gray-800 py-2.5 pl-4 pr-10 text-left border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm">
                <span className="block truncate">{selectedStatus.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <ListboxOptions className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl ring-1 ring-black/5 z-50">
                  {STATUS_OPTIONS.map((option, idx) => (
                    <ListboxOption
                      key={idx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2.5 pl-10 pr-4 text-sm ${
                          active ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-200"
                        }`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? "font-bold text-blue-600" : "font-medium"}`}>
                            {option.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                              <Check className="h-4 w-4" aria-hidden="true" />
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

          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tickets Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center gap-4 py-24">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-gray-400 animate-pulse font-medium">Synchronizing your tickets...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <div className="bg-red-50 text-red-600 px-6 py-3 rounded-xl border border-red-100 font-medium">{error}</div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl max-w-6xl mx-auto"
          >
            <Inbox size={60} className="text-gray-300 mb-4" />
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">No matching tickets</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-background-dark rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden max-w-6xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-50/80 dark:bg-gray-900/50">
                  <tr>
                    {["Ticket ID", "Subject", "Urgency", "Status"].map((col) => (
                      <th key={col} className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <AnimatePresence mode='popLayout'>
                    {filteredTickets.map((ticket) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={ticket._id}
                        onClick={() => navigate(`/itsupport-dashboard/assigned-ticket/${ticket._id}`)}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-5 text-sm font-bold text-blue-600 dark:text-blue-400 font-mono tracking-tighter">
                          #{ticket._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-200">
                          {ticket.subject}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 text-[10px] rounded-lg font-black uppercase tracking-tight
                            ${{
                              Critical: "bg-red-100 text-red-700 dark:bg-red-900/30",
                              High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30",
                              Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
                              Low: "bg-green-100 text-green-700 dark:bg-green-900/30",
                            }[ticket.urgency] || "bg-gray-100 text-gray-500"}
                          `}>
                            {ticket.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 text-[10px] rounded-lg font-black uppercase tracking-tight
                            ${{
                              Open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
                              "In Progress": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30",
                              Resolved: "bg-green-100 text-green-700 dark:bg-green-900/30",
                            }[ticket.status] || "bg-gray-200 text-gray-700"}
                          `}>
                            {ticket.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ItSupportAssignedTicket;