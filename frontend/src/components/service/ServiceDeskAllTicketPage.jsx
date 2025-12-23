//components>service>ServiceDeskAllTicketPage.jsx
import React, { useEffect, useState, Fragment } from "react";
import { Plus, Search, Calendar, ChevronDown, Check, Filter } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore';
import TicketDetailModal from "../ui/TicketDetailModal";
import api from "../../lib/utils";
import { Link, useNavigate } from "react-router";

const ServiceDeskAllTicketPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthenticationStore();
    const { fetchTickets, tickets, loading, error } = useTicketStore();

    const [selectedTicket, setSelectedTicket] = useState(null);
    const [itSupportUsers, setItSupportUsers] = useState([]);
  
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [dateFilter, setDateFilter] = useState("");

    const statusOptions = ["All Status", "Open", "In Progress", "Resolved"];

    useEffect(() => {
        const fetchItSupportUsers = async () => {
          try {
            const res = await api.get("/user/get-it-support");
            setItSupportUsers(res.data.users);
          } catch (err) {
            console.error("Error fetching IT support users:", err);
          }
        };
      
        fetchItSupportUsers();
    }, []);

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
        ticket.issueType.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter !== "All Status" ? ticket.status === statusFilter : true;

        const matchesDate = dateFilter
        ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter
        : true;

        return matchesSearch && matchesStatus && matchesDate;
    });

    const sortedTickets = [...filteredTickets].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
      
  return (
    <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        {user?.name ? `${user.name}'s Tickets` : "My Tickets"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">Manage and track your service requests</p>
                </div>
                <Link to="/servicedesk-dashboard/service-new-ticket" 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                    <Plus size={18} strokeWidth={3} /> New Ticket
                </Link>
            </div>

            {/* Filters Section */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by issue or description..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Status Listbox */}
                <Listbox value={statusFilter} onChange={setStatusFilter}>
                    <div className="relative">
                        <ListboxButton className="relative w-full cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                            <span className="flex items-center gap-2 truncate">
                                <Filter size={16} className="text-gray-400" />
                                {statusFilter}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white dark:bg-gray-800 py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-medium">
                                {statusOptions.map((option) => (
                                    <ListboxOption
                                        key={option}
                                        value={option}
                                        className={({ focus }) => `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${focus ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-900 dark:text-gray-300'}`}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-bold text-blue-600' : 'font-medium'}`}>{option}</span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                        <Check className="h-4 w-4" aria-hidden="true" />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>

                {/* Date Filter */}
                <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Info Message */}
            <div className="mb-4 flex items-center gap-2 px-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Tap a row to view details</p>
            </div>

            {/* Tickets Table */}
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                {["Ticket ID", "Issue Type", "Description", "Urgency", "Assigned", "Status"].map((col) => (
                                    <th key={col} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 border-b border-gray-100 dark:border-gray-800">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading && (
                                <tr><td colSpan={6} className="p-12 text-center font-bold text-gray-400 italic">Loading tickets...</td></tr>
                            )}

                            {!loading && sortedTickets.map((ticket) => (
                                <tr key={ticket._id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:underline">
                                            #{ticket._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider
                                            ${{
                                                "Hardware issue": "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
                                                "Software issue": "bg-green-100 text-green-600 dark:bg-green-900/30",
                                                "Network Connectivity": "bg-red-100 text-red-600 dark:bg-red-900/30",
                                                "Account Access": "bg-orange-100 text-orange-600 dark:bg-orange-900/30",
                                            }[ticket.issueType] || "bg-gray-100 text-gray-500"}
                                        `}>
                                            {ticket.issueType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                                        {ticket.description}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                ticket.urgency === 'Critical' ? 'bg-red-700 animate-ping' 
                                                : ticket.urgency === 'High' ? 'bg-purple-700 animate-bounce' 
                                                : ticket.urgency === 'Medium' ? 'bg-orange-700 animate-pulse' 
                                                : ticket.urgency === 'Low' ? 'bg-gray-500 animate-spin' 
                                                : 'bg-gray-300'}`} />
                                            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{ticket.urgency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 italic">
                                        {ticket.assignedTo?.username || "Pending"}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${{
                                                Open: "bg-blue-500 text-white shadow-md shadow-blue-500/20",
                                                "In Progress": "bg-amber-400 text-white shadow-md shadow-amber-500/20",
                                                Resolved: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
                                            }[ticket.status] || "bg-gray-200 text-gray-700"}
                                        `}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {selectedTicket && (
            <TicketDetailModal
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                itSupportUsers={itSupportUsers}
                allTickets={tickets} />
        )}
    </DashboardLayout>
  )
}

export default ServiceDeskAllTicketPage;