import React, { Fragment } from "react";
 import { Search, Calendar, ChevronDown, Check, MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

const TicketsTable = ({
  tickets = [],
  role = 'admin',
  search = "",
  issueTypeFilter = "",
  statusFilter = "",
  dateFilter = "",
  onSearchChange = () => {},
  onIssueTypeChange = () => {},
  onStatusChange = () => {},
  onDateChange = () => {},
  onRowClick = () => {},
}) => {
  // Filter logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch = 
      ticket.issueType?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());
    const matchIssueType = issueTypeFilter ? ticket.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase() : true;
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchDate = dateFilter ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter : true;
    return matchSearch && matchIssueType && matchStatus && matchDate;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const issueTypes = ["Hardware Issue", "Software Issue", "Network Connectivity", "Account Access", "Other"];
  const statuses = role === 'admin' || role === 'reviewer' ? ["Open", "In Progress", "Resolved", "Closed"] : ["Open", "In Progress", "Resolved"];

  // Define filters based on role
  const showIssueTypeFilter = role === 'admin' || role === 'reviewer';
  const showStatusFilter = true;
  const showDateFilter = true;

  const getColumns = () => {
    // Same columns for both admin and client roles for consistency
    return [
      { key: 'id', label: 'TICKET ID', render: (ticket) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded">
          #{ticket._id.slice(-6).toUpperCase()}
        </span>
      ) },
      {
        key: role === 'client' ? 'subject' : 'issueType',
        label: role === 'client' ? 'SUBJECT' : 'ISSUE TYPE',
        render: (ticket) => role === 'client' ? (
          <span className='font-normal text-gray-700 dark:text-gray-400 max-w-[200px] truncate text-sm' title={ticket.subject}>
            {ticket.subject}
          </span>
        ) : (
          <span className={`text-[10px] inline-flex items-center justify-center px-2 py-1 rounded-md font-bold min-w-[100px] uppercase
            ${{
              "Hardware Issue": "bg-blue-100 text-blue-700",
              "Software Issue": "bg-green-100 text-green-700",
              "Network Connectivity": "bg-red-100 text-red-700",
              "Account Access": "bg-orange-100 text-orange-700",
            }[ticket.issueType] || "bg-slate-200 text-slate-600"}
          `}>{ticket.issueType}</span>
        )
      },
      { key: 'urgency', label: 'URGENCY', render: (ticket) => (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
          ticket.urgency === "Critical" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" :
          ticket.urgency === "High" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" :
          ticket.urgency === "Medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" :
          "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
        }`}>
          {ticket.urgency}
        </span>
      ) },
      {
        key: role === 'client' ? 'location' : 'assignedTo',
        label: role === 'client' ? 'LOCATION' : 'ASSIGNED TO',
        render: (ticket) => role === 'client' ? (
          <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.location}</span>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">
                {ticket.assignedTo ? ticket.assignedTo.username[0].toUpperCase() : "?"}
            </div>
            <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
              {ticket.assignedTo ? ticket.assignedTo.username : "Unassigned"}
            </span>
          </div>
        )
      },
      { key: 'status', label: 'STATUS', render: (ticket) => (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            ticket.status === "Open" ? "bg-blue-500" :
            ticket.status === "In Progress" ? "bg-yellow-500" :
            ticket.status === "Resolved" ? "bg-green-500" : "bg-gray-400"
          }`} />
          <span className="text-sm font-normal text-gray-700 dark:text-gray-300">{ticket.status}</span>
        </div>
      ) },
      { key: 'createdAt', label: role === 'client' ? 'SUBMITTED' : 'CREATED AT', render: (ticket) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
        </span>
      ) },
      {
        key: role === 'client' ? 'feedback' : 'description',
        label: role === 'client' ? 'FEEDBACK' : 'DESCRIPTION',
        render: (ticket) => role === 'client' ? (
          ticket.comments && ticket.comments.length > 0 ? (
            <Link
              to={`/client-dashboard/ticket/${ticket._id}/feedback`}
              className="inline-flex items-center justify-center p-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
              title="View feedback"
            >
              <Eye size={16} />
            </Link>
          ) : (
            <div className="inline-flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg">
              <MessageCircle size={16} />
            </div>
          )
        ) : (
          <p className='font-normal text-gray-600 dark:text-gray-400 max-w-xs md:max-w-md line-clamp-2 text-sm leading-relaxed' title={ticket.description}>
            {ticket.description}
          </p>
        )
      }
    ];
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {showIssueTypeFilter && (
            <div className="w-full sm:w-44">
              <Listbox value={issueTypeFilter} onChange={onIssueTypeChange}>
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
          )}

          {showStatusFilter && (
            <div className="w-full sm:w-40">
              <Listbox value={statusFilter} onChange={onStatusChange}>
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
          )}

          {showDateFilter && (
            <div className="relative w-full sm:w-40">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Pro-tip */}
      <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <p className="font-medium">Pro-tip: Click any row to view full ticket details and attachments.</p>
      </div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800'
      >
        <div className="overflow-x-auto">
          <table className='w-full table-auto border-collapse'>
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50 dark:divide-gray-800'>
              <AnimatePresence>
                {sortedTickets.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 italic">No tickets found</td>
                  </tr>
                ) : (
                  sortedTickets.map((ticket, index) => (
                    <motion.tr
                      key={ticket._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => onRowClick(ticket)}
                      className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors cursor-pointer group"
                    >
                      {columns.map((col) => (
                        <td key={col.key} className='px-6 py-4'>
                          {col.render(ticket)}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketsTable;