import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Ticket, Clock, CheckCircle, MessageCircle } from 'lucide-react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import { useSearchParams } from 'react-router-dom'
import useTicketStore from '../../store/ticketStore'
import TicketsTable from '../ui/TicketsTable'
import DetailedTicketsView from '../ui/DetailedTicketsView'
import SelectedTicketModal from '../ui/SelectedTicketModal'

const ReviewerAssignedTickets = () => {
  const { user } = useAuthenticationStore()
  const { tickets, fetchTickets, loading, error } = useTicketStore()

  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get("category") || ""

  const [search, setSearch] = useState('')
  const [issueTypeFilter, setIssueTypeFilter] = useState(initialCategory)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Reviewers typically only see tickets NOT closed
  const assignedTickets = safeTickets.filter(t => t.status !== 'Closed')

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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            Assigned Tickets
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and moderate your assigned support tickets.
          </p>
        </div>

        {/* Stats Grid */}
        {!loading && !error && assignedTickets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Assigned', val: stats.total, icon: Ticket, color: 'blue' },
              { label: 'Open Tickets', val: stats.open, icon: Clock, color: 'orange' },
              { label: 'In Progress', val: stats.inProgress, icon: Clock, color: 'indigo' },
              { label: 'Resolved', val: stats.resolved, icon: CheckCircle, color: 'green' },
              { label: 'Pending Feedback Review', val: stats.pendingFeedback, icon: MessageCircle, color: 'purple' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
              >
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.val}</p>
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
            <span className="font-bold">Error:</span> {error}
          </div>
        ) : assignedTickets.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Ticket size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No Assigned Tickets</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              You don't have any assigned tickets at the moment.
            </p>
          </motion.div>
        ) : (
          issueTypeFilter ? (
            <DetailedTicketsView
              tickets={assignedTickets.filter(t =>
                (!search || t.subject?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase())) &&
                (t.issueType?.trim().toLowerCase() === issueTypeFilter.trim().toLowerCase()) &&
                (!statusFilter || t.status === statusFilter) &&
                (!dateFilter || new Date(t.createdAt).toISOString().split("T")[0] === dateFilter)
              )}
              role="reviewer"
              onRowClick={setSelectedTicket}
            />
          ) : (
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
            />
          )
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