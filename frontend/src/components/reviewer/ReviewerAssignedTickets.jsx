import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Tickets, Clock, CheckCircle, MessageCircle, List, Grid, Table } from 'lucide-react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore'
import TicketsTable from '../ui/TicketsTable'
import SelectedTicketModal from '../ui/SelectedTicketModal'
import NoTicketComponent from '../ui/NoTicketComponent'
import { NumberTicker } from '../ui/number-ticker'
import toast from 'react-hot-toast'

const ReviewerAssignedTickets = () => {
  const { user } = useAuthenticationStore()
  const { tickets, fetchTickets, loading, error, deleteTicket } = useTicketStore()

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
  }

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('table')
  const [issueTypeFilter, setIssueTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Filter to only show tickets assigned to this reviewer
  const assignedTickets = safeTickets.filter(t => {
    // Only show tickets where assignedTo matches the current user
    const isAssignedToMe = t.assignedTo && (
      t.assignedTo._id === user?._id || 
      t.assignedTo.id === user?._id ||
      t.assignedTo === user?._id
    );
    return isAssignedToMe && t.status !== 'Closed';
  });

  // Stats
  const stats = {
    total: assignedTickets.length,
    open: assignedTickets.filter(t => t.status === 'Open').length,
    inProgress: assignedTickets.filter(t => t.status === 'In Progress').length,
    resolved: assignedTickets.filter(t => t.status === 'Resolved').length,
    pendingFeedback: assignedTickets.filter(t => t.status === 'Resolved' && t.comments && t.comments.length > 0).length
  }

  const getColorClasses = (color) => {
    const maps = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    }
    return maps[color] || maps.blue
  }

  const getBgGradient = (color) => {
    const maps = {
      blue: 'from-blue-50/80 to-transparent dark:from-blue-900/20',
      orange: 'from-orange-50/80 to-transparent dark:from-orange-900/20',
      green: 'from-green-50/80 to-transparent dark:from-green-900/20',
      purple: 'from-purple-50/80 to-transparent dark:from-purple-900/20',
      indigo: 'from-indigo-50/80 to-transparent dark:from-indigo-900/20',
    }
    return maps[color] || maps.blue
  }

  const getIconBg = (color) => {
    const maps = {
      blue: 'bg-blue-500 shadow-blue-500/30',
      orange: 'bg-orange-500 shadow-orange-500/30',
      green: 'bg-green-500 shadow-green-500/30',
      purple: 'bg-purple-500 shadow-purple-500/30',
      indigo: 'bg-indigo-500 shadow-indigo-500/30',
    }
    return maps[color] || maps.blue
  }

  const getLiveDotColor = (color) => {
    const maps = {
      blue: 'bg-blue-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
    }
    return maps[color] || maps.blue
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
          >
            Assigned Tickets
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and moderate your assigned support tickets.
          </p>
        </div>

        {/* Stats Grid */}
        {!loading && !error && assignedTickets.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Total', val: stats.total, icon: Tickets, color: 'blue' },
              { label: 'Open', val: stats.open, icon: Clock, color: 'orange' },
              { label: 'In Progress', val: stats.inProgress, icon: Clock, color: 'indigo' },
              { label: 'Resolved', val: stats.resolved, icon: CheckCircle, color: 'green' },
              { label: 'Pending', val: stats.pendingFeedback, icon: MessageCircle, color: 'purple' },
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    <NumberTicker value={stat.val} />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 animate-pulse">Loading assigned tickets...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <span className="font-medium">Error:</span> {error}
          </div>
        ) : assignedTickets.length === 0 ? (
          <NoTicketComponent noTicket={user?.name} type="reviewer" />
        ) : (
          <>
            {/* <div className="flex justify-end mb-4">
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
            </div> */}
            <TicketsTable
              tickets={assignedTickets}
              role="reviewer"
              search={search}
              issueTypeFilter={issueTypeFilter}
              statusFilter={statusFilter}
              dateFilter={dateFilter}
              onSearchChange={setSearch}
              onIssueTypeChange={setIssueTypeFilter}
              onStatusChange={setStatusFilter}
              onDateChange={setDateFilter}
              onRowClick={setSelectedTicket}
              showDelete={true}
              onDelete={handleDeleteTicket}
              deleteLoading={deleteLoading}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </>
        )}
      </div>

      {selectedTicket && (
        <SelectedTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </DashboardLayout>
  )
}

export default ReviewerAssignedTickets