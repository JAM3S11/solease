import React, { useEffect, useState, Fragment } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import { Plus, ChevronDown, Check } from 'lucide-react'
import useTicketStore from '../../store/ticketStore'
import { useNavigate } from 'react-router'
import SelectedTicketModal from '../ui/SelectedTicketModal'
import ExportData from '../../document/ExportData'
import { motion, AnimatePresence } from 'framer-motion'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';

const AdminTicketsView = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { fetchTickets, tickets, loading, error } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openTickets = tickets.filter(ticket => ticket.status === "Open").length;
  const closedTickets = tickets.filter(ticket => ticket.status === "Closed").length;
  const customerSatisfaction = tickets.length ? ((closedTickets / tickets.length) * 100).toFixed(1) : 0;

  const issueTypes = ["Hardware Issue", "Software Issue", "Network Connectivity", "Account Access", "Other"];
  const statuses = ["Open", "In Progress", "Resolved", "Closed"];

  const fetchTicketsAdmin = tickets.filter((ticket) => {
    const matchSearch = ticket.issueType.toLowerCase().includes(search.toLowerCase()) ||
                        ticket.description.toLowerCase().includes(search.toLowerCase());
    const matchIssueType = issueTypeFilter ? ticket.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase() : true;
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchDate = dateFilter ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter : true;
    return matchSearch && matchIssueType && matchStatus && matchDate;
  });

  const sortedTicketsAdmin = [...fetchTicketsAdmin].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <DashboardLayout>
      <div className='p-4 sm:p-6 lg:p-8 space-y-4'>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div className='flex flex-col items-start space-y-2'>
            <h2 className='text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200'>Tickets Overview</h2>
            <p className='text-sm md:text-base font-normal text-gray-700 dark:text-gray-200'>Manage and analyze all support tickets</p>
          </div>
          <div className='flex sm:justify-start md:justify-end space-x-2'>
            <ExportData data={fetchTicketsAdmin} fileName="admin_tickets.csv" />
            <button onClick={() => navigate("/admin-dashboard/admin-new-ticket")} className='group flex items-center btn btn-primary text-white gap-1 rounded-md shadow-md hover:shadow-lg transition-all active:scale-95'>
              <Plus size={18} className='group-hover:rotate-90 transition-transform duration-300' />
              <span className='text-sm font-normal'>Create New Ticket</span>
            </button>
          </div>
        </motion.div>

        {/* Summation overview */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
          {[
            { label: "Open Tickets", value: openTickets },
            { label: "Closed Tickets", value: closedTickets },
            { label: "Customer Satisfaction", value: `${customerSatisfaction}%` }
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className='group w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-6 rounded-xl shadow-md cursor-pointer relative overflow-hidden'>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className='text-3xl text-center font-bold text-white mb-1'>{loading ? "..." : stat.value}</p>
              <p className='text-xs text-center font-bold text-blue-50 uppercase tracking-widest'>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter and search panel */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-2/5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets by issue type or description..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap justify-end gap-3 z-20">
            {/* Issue Type Listbox */}
            <div className="w-full sm:w-44">
              <Listbox value={issueTypeFilter} onChange={setIssueTypeFilter}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-xl bg-white dark:bg-gray-800 py-2.5 pl-3 pr-10 text-left border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="block truncate">{issueTypeFilter || "Issue Type"}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown className="h-4 w-4 text-gray-400" /></span>
                  </ListboxButton>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-xs z-50">
                      <ListboxOption value="" className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                        All Issues
                      </ListboxOption>
                      {issueTypes.map((type) => (
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

            {/* Status Listbox */}
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
                      </ListboxOption>
                      {statuses.map((s) => (
                        <ListboxOption key={s} value={s} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-900 dark:text-gray-300'}`}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-bold text-blue-600' : 'font-normal'}`}>{s}</span>
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

            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full sm:w-40 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <p className="font-medium">Pro-tip: Click any row to view full ticket details and history.</p>
        </div>

        {/* Table creation */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800'>
          <div className="overflow-x-auto">
            <table className='w-full table-auto border-collapse'>
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  {["TICKET ID", "ISSUE TYPE", "DESCRIPTION", "URGENCY", "ASSIGNED TO", "STATUS", "CREATED AT"].map((col) => (
                    <th key={col} className="px-4 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan={7} className="p-10 text-center animate-pulse text-gray-400">Loading...</td></tr>
                  ) : sortedTicketsAdmin.map((ticket, index) => (
                    <motion.tr
                      key={ticket._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                    >
                      <td className='p-4 text-sm font-bold text-blue-600 dark:text-blue-400'>#{ticket._id.slice(-6).toUpperCase()}</td>
                      <td className='p-4'>
                        <span className={`text-[10px] inline-flex items-center justify-center px-2 py-1 rounded-md font-bold min-w-[90px] uppercase
                          ${{
                            "Hardware issue": "bg-blue-100 text-blue-700",
                            "Software issue": "bg-green-100 text-green-700",
                            "Network Connectivity": "bg-red-100 text-red-700",
                            "Account Access": "bg-orange-100 text-orange-700",
                          }[ticket.issueType] || "bg-slate-200 text-slate-600"}
                        `}>{ticket.issueType}</span>
                      </td>
                      <td className='p-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[150px]'>{ticket.description}</td>
                      <td className='p-4'>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase
                          ${{ Critical: "bg-red-500 text-white", High: "bg-orange-400 text-white", Medium: "bg-yellow-400 text-gray-800", Low: "bg-green-500 text-white" }[ticket.urgency] || "bg-gray-400 text-white"}
                        `}>{ticket.urgency}</span> 
                      </td>
                      <td className='p-4 text-sm font-medium text-gray-700 dark:text-gray-300'>{ticket.assignedTo ? ticket.assignedTo.username : "Unassigned"}</td>
                      <td className='p-4'>
                        <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase
                          ${{ Open: "bg-blue-100 text-blue-600", "In Progress": "bg-yellow-100 text-yellow-700", Resolved: "bg-green-100 text-green-600" }[ticket.status] || "bg-gray-100 text-gray-600"}
                        `}>{ticket.status}</span>
                      </td>
                      <td className='p-4 text-xs font-medium text-gray-500'>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
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