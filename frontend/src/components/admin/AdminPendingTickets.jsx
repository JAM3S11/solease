import React, { useEffect, useState, Fragment } from 'react'
import DashboardLayout from '../ui/DashboardLayout'
import useTicketStore from '../../store/ticketStore';
import { Inbox, ChevronDown, Check } from 'lucide-react';
import api from '../../lib/axios';
import { useNavigate } from 'react-router';
import TicketDetailModal from '../ui/TicketDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';

const AdminPendingTickets = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [urgencyGetter, setUrgency] = useState("");
  const [dateGetter, setDate] = useState("");

  const [seletedTicket, setSelectedTicket] = useState(null);
  const [itSupportUsers, setItSupportUsers] = useState([]);

  const { fetchTickets, tickets, loading, error } = useTicketStore();

  useEffect(() => {
    const fetchItSupportUsers = async () => {
      try {
        const res = await api.get("user/get-it-support");
        setItSupportUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching IT support users:", err);
      }
    };
    fetchItSupportUsers();
  }, []);

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
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6'>
          {[
            { label: "Total Pending", value: totalPendingTickets },
            { label: "Oldest Tickets", value: oldTickets },
            { label: "SLA Breach", value: slaBreachingTickets }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className='group w-full bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 flex flex-col items-center justify-center space-y-2 p-6 rounded-lg shadow-md transition cursor-pointer'
            >
              <p className='text-2xl text-center font-semibold text-gray-900 dark:text-white group-hover:text-white'>
                {loading ? "..." : stat.value}
              </p>
              <span className='text-md text-center font-bold text-gray-700 dark:text-gray-200 uppercase group-hover:text-white'>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Search and Listbox Filters */}
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
          ) : filterPendingTickets.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='flex flex-col items-center justify-center py-16 bg-gradient-to-r from-slate-300 via-slate-500 to-slate-600 rounded-2xl shadow-lg max-w-6xl mx-auto'>
              <Inbox size={48} className="text-blue-400 mb-4" />
              <p className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2'>There are no pending tickets</p>
              <p className='text-sm text-white'>Check back later</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-6xl mx-auto'>
              <div className="overflow-x-auto">
                <table className='w-full table-auto border-collapse'>
                  <thead className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700'>
                    <tr>
                      {["TICKET ID", "ISSUE TYPE", "SUBJECT", "URGENCY", "ASSIGNED TO", "STATUS", "OLDEST"].map((col) => (
                        <th key={col} className='px-4 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider'>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {sortPendingTickets.map((ticket, index) => (
                      <motion.tr
                        key={ticket._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/20" : "bg-white dark:bg-gray-800"}`}
                      >
                        <td className='p-4 text-sm font-medium text-blue-500 dark:text-blue-400'>#{ticket._id.slice(-6).toUpperCase()}</td>
                        <td className='p-4'>
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg uppercase
                            ${{
                                "Hardware issue": "bg-blue-100 text-blue-600",
                                "Software issue": "bg-green-100 text-green-600",
                                "Network Connectivity": "bg-red-100 text-red-600",
                                "Account Access": "bg-orange-100 text-orange-600",
                            }[ticket.issueType] || "bg-slate-200 text-slate-600"}
                          `}>{ticket.issueType}</span>
                        </td>
                        <td className='p-4 text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs'>{ticket.subject}</td>
                        <td className='p-4'>
                          <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase
                            ${{ Critical: "bg-red-500 text-white", High: "bg-orange-400 text-white", Medium: "bg-yellow-400 text-gray-800", Low: "bg-green-500 text-white" }[ticket.urgency] || "bg-gray-400 text-white"}
                          `}>{ticket.urgency}</span>
                        </td>
                        <td className='p-4 text-sm font-medium text-blue-500 dark:text-blue-300'>{ticket.assignedTo ? ticket.assignedTo.username : "Pending"}</td>
                        <td className='p-4'>
                          <span className='px-3 py-1 text-[10px] rounded-full font-bold uppercase bg-blue-100 text-blue-600'>{ticket.status}</span>
                        </td>
                        <td className='p-4 text-sm font-medium text-gray-500'>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {seletedTicket && (
        <TicketDetailModal
          ticket={seletedTicket}
          onClose={() => setSelectedTicket(null)}
          itSupportUsers={itSupportUsers}
        />
      )}
    </DashboardLayout>
  )
}

export default AdminPendingTickets;