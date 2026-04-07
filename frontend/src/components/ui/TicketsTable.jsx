import React, { Fragment, useMemo, useState } from "react";
import { Search, Calendar, ChevronDown, Check, MessageCircle, Eye, ArrowUp, ArrowDown, ArrowRight, Paperclip, FileText, MapPin, List, Grid, ChevronLeft, ChevronRight as ChevronRightIcon, Table, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
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
} from "./alert-dialog";

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
  viewMode = "table",
  setViewMode = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
  itemsPerPage = 10,
  setItemsPerPage = () => {},
  itemsPerPageOpen = false,
  setItemsPerPageOpen = () => {},
  ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20, 25],
  onDelete = null,
  deleteLoading = null,
  showDelete = false,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteTicket = async () => {
    if (!ticketToDelete || !onDelete) return;
    try {
      await onDelete(ticketToDelete);
      toast.success("Ticket deleted successfully");
      setTicketToDelete(null);
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch = 
      ticket.subject?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(search.toLowerCase());
    const matchIssueType = issueTypeFilter ? ticket.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase() : true;
    const matchStatus = statusFilter ? (ticket.status === statusFilter || ticket.status === statusFilter.toUpperCase() || ticket.status === statusFilter.toLowerCase()) : true;
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
              className="inline-block font-mono text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md transition-all duration-200"
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
        label: 'SUBJECT',
        render: (ticket) => (
          <div className="max-w-[200px]">
            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
              {ticket.subject}
            </p>
          </div>
        )
      },
      {
        key: 'description',
        label: 'DESCRIPTION',
        render: (ticket) => (
          <div className="max-w-[250px]">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {ticket.description?.slice(0, 60)}...
            </p>
          </div>
        )
      },
      {
        key: 'issueType',
        label: 'ISSUE TYPE',
        render: (ticket) => (
          <span className={`text-[10px] inline-flex items-center justify-center px-2 py-1 rounded-md font-medium min-w-[100px] uppercase
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
        key: 'urgency', 
        label: 'URGENCY',
        sortable: 'urgency',
        render: (ticket) => (
          <motion.span
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`inline-block px-2.5 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-wider transition-all duration-200 ${
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
            {ticket.assignedTo?.profilePhoto ? (
              <img 
                src={ticket.assignedTo.profilePhoto.startsWith("http") ? ticket.assignedTo.profilePhoto : `${import.meta.env.VITE_API_URL}${ticket.assignedTo.profilePhoto}`}
                alt={ticket.assignedTo.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-medium text-blue-600 dark:text-blue-400">
                  {ticket.assignedTo ? ticket.assignedTo.username[0].toUpperCase() : "?"}
              </div>
            )}
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
              animate={ticket.status !== "Resolved" && ticket.status !== "RESOLVED" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-3 h-3 rounded-full shadow-sm ${
                ticket.status === "Open" || ticket.status === "OPEN"
                  ? "bg-blue-500 shadow-blue-500/50"
                  : ticket.status === "In Progress" || ticket.status === "IN_PROGRESS"
                    ? "bg-yellow-500 shadow-yellow-500/50"
                    : ticket.status === "Resolved" || ticket.status === "RESOLVED"
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
                  `/client-dashboard/ticket/${ticket._id}/feedback`
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
          <div className="flex items-center justify-end gap-1">
            {showDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); setTicketToDelete(ticket._id); }}
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
            )}
            <Link
              to={
                role === 'client' ? `/client-dashboard/ticket/${ticket._id}/feedback` :
                role === 'reviewer' ? `/reviewer-dashboard/ticket/${ticket._id}/feedback` :
                `/client-dashboard/ticket/${ticket._id}/feedback`
              }
              onClick={(e) => e.stopPropagation()}
              className="p-2 inline-block text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              aria-label="View ticket details"
            >
              <ArrowRight size={18} />
            </Link>
          </div>
        )
      }
    ];

    // Filter columns based on role for client
    if (role === 'client') {
      return baseColumns.filter(col => col.key !== 'issueType' && col.key !== 'assignedTo');
    }
    
    return baseColumns;
  };

  const columns = getColumns();

  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);
  const paginatedTickets = viewMode === 'table' 
    ? sortedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedTickets;
  
  const displayTickets = paginatedTickets;

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(issueTypeFilter || statusFilter || dateFilter || search) && (
              <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs rounded-full">Active</span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
        {/* Search - Full width on mobile, fixed width on desktop */}
        <div className="relative w-full lg:min-w-[200px] lg:flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Filters and View Mode - Horizontal row on desktop */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-2">
          {showIssueTypeFilter && (
            <div className="min-w-[120px]">
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
                              <span className={`block truncate ${selected ? 'font-medium text-blue-600' : 'font-normal'}`}>{type}</span>
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
            <div className="min-w-[100px]">
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
                              <span className={`block truncate ${selected ? 'font-medium text-blue-600' : 'font-normal'}`}>{s}</span>
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
            <div className="relative min-w-[120px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
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
              onClick={() => setViewMode('list')}
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
              onClick={() => setViewMode('grid')}
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
        </div>
      </div>

      {viewMode === 'table' && sortedTickets.length > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-sm text-blue-700 dark:text-blue-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <p className="font-medium">Pro-tip: Click on Ticket ID, Urgency, and Updated headers to sort.</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800'
      >
        {viewMode === 'table' ? (
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
                        className={`px-6 py-4 text-left text-[10px] font-medium text-gray-400 uppercase tracking-widest ${
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
                  {displayTickets.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 italic">No tickets found</td>
                    </tr>
                  ) : (
                    displayTickets.map((ticket, index) => (
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
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayTickets.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 italic py-12">No tickets found</div>
              ) : (
                displayTickets.map((ticket) => (
                  <motion.div
                    key={ticket._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => onRowClick(ticket)}
                    className="group cursor-pointer bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className="inline-block font-mono text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-md"
                        >
                          #{ticket._id.slice(-6).toUpperCase()}
                        </motion.span>
                        {ticket.urgency === "Critical" && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical" />
                        )}
                      </div>
                      <motion.span
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          ticket.urgency === "Critical"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            : ticket.urgency === "High"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                              : ticket.urgency === "Medium"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        }`}
                      >
                        {ticket.urgency}
                      </motion.span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ticket.subject}
                    </h3>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{ticket.description?.slice(0, 80)}...</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        animate={ticket.status !== "Resolved" && ticket.status !== "RESOLVED" ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-2.5 h-2.5 rounded-full ${
                          ticket.status === "Open" || ticket.status === "OPEN"
                            ? "bg-blue-500"
                            : ticket.status === "In Progress" || ticket.status === "IN_PROGRESS"
                              ? "bg-yellow-500"
                              : ticket.status === "Resolved" || ticket.status === "RESOLVED"
                                ? "bg-green-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.status}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                        <FileText size={10} />
                        {ticket.issueType || 'General'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={10} />
                        {ticket.location || '-'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        {showDelete && (
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
                        )}
                        {ticket.attachments?.length > 0 ? (
                          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <Paperclip size={12} />
                            <span>{ticket.attachments.length}</span>
                          </div>
                        ) : null}
                        {ticket.comments && ticket.comments.length > 0 ? (
                          <Link
                            to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <MessageCircle size={12} />
                            <span>{ticket.comments.length}</span>
                          </Link>
                        ) : null}
                      </div>
                      <Link
                        to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                      >
                        View
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-3">
            {displayTickets.length === 0 ? (
              <div className="text-center text-gray-400 italic py-12">No tickets found</div>
            ) : (
              displayTickets.map((ticket, index) => (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onRowClick(ticket)}
                  className="group cursor-pointer flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                    {ticket.subject?.charAt(0) || 'T'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        className="inline-block font-mono text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded"
                      >
                        #{ticket._id.slice(-6).toUpperCase()}
                      </motion.span>
                      {ticket.urgency === "Critical" && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Critical" />
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
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
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
                        <FileText size={10} />
                        {ticket.issueType || 'General'}
                      </span>
                      <motion.span
                        animate={ticket.status !== "Resolved" && ticket.status !== "RESOLVED" ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-2 h-2 rounded-full ${
                          ticket.status === "Open" || ticket.status === "OPEN"
                            ? "bg-blue-500"
                            : ticket.status === "In Progress" || ticket.status === "IN_PROGRESS"
                              ? "bg-yellow-500"
                              : ticket.status === "Resolved" || ticket.status === "RESOLVED"
                                ? "bg-green-500"
                                : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{ticket.status}</span>
                    </div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ticket.subject}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{ticket.description?.slice(0, 60)}...</p>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={10} />
                      {ticket.location || '-'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                    </span>
                    {ticket.attachments?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip size={10} />
                        <span>{ticket.attachments.length}</span>
                      </div>
                    )}
                    {ticket.comments && ticket.comments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageCircle size={10} />
                        <span>{ticket.comments.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {showDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setTicketToDelete(ticket._id); }}
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
                    )}
                    <Link
                      to={`/client-dashboard/ticket/${ticket._id}/feedback`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {viewMode === 'table' && sortedTickets.length > 0 && (
        <div className="flex items-center justify-between pt-4 px-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedTickets.length)} / {sortedTickets.length}
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
              <ChevronRightIcon size={14} />
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setItemsPerPageOpen(!itemsPerPageOpen)}
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <span className="hidden sm:inline">{itemsPerPage}</span>
              <span className="sm:hidden">{itemsPerPage}/pg</span>
              <ChevronDown size={12} className={`transition-transform ${itemsPerPageOpen ? 'rotate-180' : ''}`} />
            </button>
            {itemsPerPageOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setItemsPerPageOpen(false)} 
                />
                <div className="absolute bottom-full mb-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20 min-w-[70px]">
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

      {showDelete && (
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
      )}
    </div>
  );
};

export default TicketsTable;
