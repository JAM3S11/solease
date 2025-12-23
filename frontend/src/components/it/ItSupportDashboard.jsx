import React, { useEffect, useState, Fragment } from "react";
import { Plus, Search, Calendar, ChevronDown, Check } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { Link } from "react-router";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  { id: 1, name: "All Status", value: "" },
  { id: 2, name: "Open", value: "Open" },
  { id: 3, name: "In Progress", value: "In Progress" },
  { id: 4, name: "Resolved", value: "Resolved" },
];

const ItSupportDashboard = () => {
  const { user } = useAuthenticationStore();
  const { fetchTickets, tickets, loading, error } = useTicketStore();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(STATUS_OPTIONS[0]);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.assignedTo?.username?.toLowerCase().includes(search.toLowerCase()) ?? false);

    const matchesStatus = selectedStatus.value ? ticket.status === selectedStatus.value : true;
    const matchesDate = dateFilter
      ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // KPI Calculations
  const assignedTickets = tickets.filter(t => t.assignedTo?._id === user?._id).length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved" && t.assignedTo?._id === user?._id).length;
  const pendingTickets = tickets.filter(t => t.status === "Open" && t.assignedTo?._id === user?._id).length;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
        
        {/* Header - (Structure kept from original) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-b border-gray-100 dark:border-gray-800 pb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome, {user?.name || user?.username}
            </h3>
            <p className="text-sm text-gray-500">Manage and track assigned IT support tickets</p>
          </div>
          <div className="flex justify-end">
            <Link to="/itsupport-dashboard/new-ticket" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
              <Plus size={18} />
              <span>Submit New Ticket</span>
            </Link>
          </div>
        </div>

        {/* Cards Section - (Gradient style kept) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Tickets Assigned", value: assignedTickets, color: "from-blue-500 to-indigo-600" },
            { label: "Tickets Resolved", value: resolvedTickets, color: "from-emerald-500 to-teal-600" },
            { label: "Pending Tickets", value: pendingTickets, color: "from-amber-500 to-orange-600" },
          ].map((card, i) => (
            <div key={i} className={`bg-gradient-to-br ${card.color} p-8 rounded-[2rem] shadow-xl text-white transform hover:scale-[1.02] transition-transform`}>
              <p className="text-5xl font-black">{loading ? "..." : card.value}</p>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">{card.label}</span>
            </div>
          ))}
        </div>

        {/* Filter Section using Headless UI Listbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-end">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1 tracking-widest">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Subject or Technician..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Headless UI Listbox (Status Filter) */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1 tracking-widest">Status Filter</label>
            <Listbox value={selectedStatus} onChange={setSelectedStatus}>
              <div className="relative">
                <ListboxButton className="relative w-full cursor-default rounded-xl bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left border border-gray-200 dark:border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:text-sm shadow-sm font-bold">
                  <span className="block truncate">{selectedStatus.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {STATUS_OPTIONS.map((option) => (
                      <ListboxOption
                        key={option.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-3 pl-10 pr-4 ${
                            active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-200"
                          }`
                        }
                        value={option}
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-black text-blue-600" : "font-medium"}`}>
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
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1 tracking-widest">Created Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table Section - (Animation logic kept) */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {["Ticket ID", "Subject", "Assigned", "Urgency", "Status"].map((h) => (
                  <th key={h} className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-5 font-mono font-bold text-blue-600 tracking-tighter">#{ticket._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-5 font-bold text-gray-700 dark:text-gray-200">{ticket.subject}</td>
                  <td className="px-6 py-5 text-gray-500">{ticket.assignedTo?.username || "Pending"}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      ticket.urgency === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ticket.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ItSupportDashboard;