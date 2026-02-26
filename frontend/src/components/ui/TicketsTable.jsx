import React, { Fragment, useMemo, useState } from "react";
import { Search, Calendar, ChevronDown, Check, MessageCircle, Eye, ArrowUp, ArrowDown, ArrowRight, Paperclip, FileText, MapPin } from "lucide-react";
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch = 
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());
    const matchIssueType = issueTypeFilter ? ticket.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase() : true;
    const matchStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchDate = dateFilter ? new Date(ticket.createdAt).toISOString().split("T")[0] === dateFilter : true;
    return matchSearch && matchIssueType && matchStatus && matchDate;
  });

  const sortedTickets = useMemo(() => {
    const arr = [...filteredTickets];

    if (sortConfig.key === "ticketId") {
      arr.sort((a, b) => {
        const aId = a._id.slice(-6).toUpperCase();
        const bId = b._id.slice(-6).toUpperCase();
        return sortConfig.direction === "asc"
          ? aId.localeCompare(bId)
          : bId.localeCompare(aId);
      });
    } else if (sortConfig.key === "urgency") {
      const urgencyOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      arr.sort((a, b) => {
        const aUrgency = urgencyOrder[a.urgency] || 0;
        const bUrgency = urgencyOrder[b.urgency] || 0;
        return sortConfig.direction === "asc"
          ? aUrgency - bUrgency
          : bUrgency - aUrgency;
      });
    } else if (sortConfig.key === "updatedAt") {
      arr.sort((a, b) => {
        return sortConfig.direction === "asc"
          ? new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt)
          : new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
    } else {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return arr;
  }, [filteredTickets, sortConfig]);

  const issueTypes = ["Hardware Issue", "Software Issue", "Network Connectivity", "Account Access", "Other"];
  const statuses = role === 'admin' || role === 'reviewer' ? ["Open", "In Progress", "Resolved", "Closed"] : ["Open", "In Progress", "Resolved"];

  const showIssueTypeFilter = role === 'admin' || role === 'reviewer';
  const showStatusFilter = true;
  const showDateFilter = true;

  const getColumns = () => {
    const baseColumns = [
      { 
        key: 'id', 
        label: 'TICKET', 
        sortable: 'ticketId',
        render: (ticket) => (
          <div className="flex items-center gap-2">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-block font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md transition-all duration-200"
            >
              #{ticket._id.slice(-6).toUpperCase()}
            </motion.span>
            {ticket.urgency === "Critical" && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical" />
            )}
          </div>
        )
      },
      {
        key: 'subject',
        label: role === 'client' ? 'SUBJECT' : 'ISSUE TYPE',
        render: (ticket) => role === 'client' ? (
          <div className="max-w-[200px]">
            <p className="font-normal text-gray-700 dark:text-gray-300 text-sm truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {ticket.subject}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{ticket.description?.slice(0, 40)}...</p>
          </div>
        ) : (
          <span className={`text-[10px] inline-flex items-center justify-center px-2 py-1 rounded-md font-bold min-w-[100px] uppercase
            ${{
              "Hardware Issue": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
              "Software Issue": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
              "Network Connectivity": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
              "Account Access": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
            }[ticket.issueType] || "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}
          `}>{ticket.issueType}</span>
        )
      },
      {
        key: 'type',
        label: 'TYPE',
        render: (ticket) => (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
            <FileText size={12} />
            {ticket.issueType || 'General'}
          </span>
        )
      },
      { 
        key: 'urgency', 
        label: 'URGENCY',
        sortable: 'urgency',
        render: (ticket) => (
          <motion.span
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`inline-block px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
              ticket.urgency === "Critical"
                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 shadow-sm shadow-red-200/50 dark:shadow-red-900/30"
                : ticket.urgency === "High"
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 shadow-sm shadow-orange-200/50 dark:shadow-orange-900/30"
                  : ticket.urgency === "Medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 shadow-sm shadow-yellow-200/50 dark:shadow-yellow-900/30"
                    : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-sm shadow-green-200/50 dark:shadow-green-900/30"
            }`}
          >
            {ticket.urgency}
          </motion.span>
        )
      },
      {
        key: 'location',
        label: role === 'client' ? 'LOCATION' : 'ASSIGNED TO',
        render: (ticket) => role === 'client' ? (
          <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 truncate">
            <MapPin size={12} />
            {ticket.location || '-'}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                {ticket.assignedTo ? ticket.assignedTo.username[0].toUpperCase() : "?"}
            </div>
            <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>
              {ticket.assignedTo ? ticket.assignedTo.username : "Unassigned"}
            </span>
          </div>
        )
      },
      { 
        key: 'status', 
        label: 'STATUS',
        render: (ticket) => (
          <div className="flex items-center gap-2">
            <motion.span
              animate={ticket.status !== "Resolved" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-3 h-3 rounded-full shadow-sm ${
                ticket.status === "Open"
                  ? "bg-blue-500 shadow-blue-500/50"
                  : ticket.status === "In Progress"
                    ? "bg-yellow-500 shadow-yellow-500/50"
                    : ticket.status === "Resolved"
                      ? "bg-green-500"
                      : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{ticket.status}</span>
          </div>
        )
      },
      { 
        key: 'updatedAt', 
        label: 'UPDATED',
        sortable: 'updatedAt',
        render: (ticket) => (
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )
      },
      {
        key: 'attachments',
        label: 'ATTACHMENTS',
        render: (ticket) => (
          ticket.attachments?.length > 0 ? (
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-1">
              <a
                href={`http://localhost:5001/uploads/${ticket.attachments[0].filename}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 transition-all duration-200"
                title={ticket.attachments[0].originalName || ticket.attachments[0].filename}
              >
                <Paperclip size={14} />
                <span className="text-xs font-medium max-w-[100px] truncate">
                  {ticket.attachments[0].originalName || ticket.attachments[0].filename}
                </span>
              </a>
              {ticket.attachments.length > 1 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{ticket.attachments.length - 1} more
                </span>
              )}
            </motion.div>
          ) : (
            <span className="text-gray-400 dark:text-gray-600">-</span>
          )
        )
      },
      {
        key: 'feedback',
        label: 'FEEDBACK',
        render: (ticket) => (
          ticket.comments && ticket.comments.length > 0 ? (
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link
                to={
                  role === 'client' ? `/client-dashboard/ticket/${ticket._id}/feedback` :
                  role === 'reviewer' ? `/reviewer-dashboard/ticket/${ticket._id}/feedback` :
                  `/admin-dashboard/ticket/${ticket._id}/feedback`
                }
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-200 shadow-sm hover:shadow-md"
                title="View feedback"
              >
                <Eye size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="inline-flex items-center justify-center p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg opacity-60">
              <MessageCircle size={16} />
            </div>
          )
        )
      },
      {
        key: 'actions',
        label: '',
        render: (ticket) => (
          <motion.div whileHover={{ x: 4 }}>
            <Link
              to={
                role === 'client' ? `/client-dashboard/ticket/${ticket._id}/feedback` :
                role === 'reviewer' ? `/reviewer-dashboard/ticket/${ticket._id}/feedback` :
                `/admin-dashboard/ticket/${ticket._id}/feedback`
              }
              onClick={(e) => e.stopPropagation()}
              className="p-2 inline-block text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              aria-label="View ticket details"
            >
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )
      }
    ];

    // Filter columns based on role for client
    if (role === 'client') {
      return baseColumns.filter(col => col.key !== 'type' && col.key !== 'assignedTo');
    }
    
    return baseColumns;
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
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

      <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <p className="font-medium">Pro-tip: Click on Ticket ID, Urgency, and Updated headers to sort.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800'
      >
        <div className="overflow-x-auto">
          <table className='w-full table-auto border-collapse'>
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                {columns.map((col) => {
                  const isSortable = col.sortable;
                  const isActive = sortConfig.key === col.sortable;
                  
                  return (
                    <th
                      key={col.key}
                      onClick={isSortable ? () => handleSort(col.sortable) : undefined}
                      className={`px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                        isSortable ? "cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" : ""
                      }`}
                    >
                      {isSortable ? (
                        <span className="inline-flex items-center gap-1 align-middle">
                          <span>{col.label}</span>
                          {isActive && (
                            sortConfig.direction === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                          )}
                        </span>
                      ) : (
                        col.label
                      )}
                    </th>
                  );
                })}
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
                      className="group transition-colors duration-200 cursor-default hover:bg-blue-50/30 dark:hover:bg-blue-900/5"
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
