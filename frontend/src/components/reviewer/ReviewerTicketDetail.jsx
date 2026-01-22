import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, MessageCircle, AlertTriangle, MapPin, Tag, Info, ChevronDown } from 'lucide-react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore'
import toast from 'react-hot-toast'

const ReviewerTicketDetail = () => {
  const { id } = useParams()
  const { user } = useAuthenticationStore()
  const { tickets, fetchTickets, 
    hideFeedback, unhideFeedback, 
    approveHiddenForManager, updateTicket, 
    managerIntervention, loading 
  } = useTicketStore()
  const [moderating, setModerating] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [interventionContent, setInterventionContent] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [highlightFeedback, setHighlightFeedback] = useState(false)

  useEffect(() => {
    if (!tickets.length) fetchTickets()
  }, [fetchTickets, tickets.length])

  const ticket = tickets.find(t => t._id === id)

  const handleStatusChange = useCallback(async (newStatus) => {
    if (newStatus === ticket?.status) return
    setUpdatingStatus(true)
    try {
      const updatedTicket = await updateTicket(id, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)

      // Auto-open feedback for Resolved/In Progress tickets
      if (newStatus === 'Resolved' || newStatus === 'In Progress') {
        setTimeout(() => {
          navigate(`/reviewer-dashboard/ticket/${id}/feedback`)
        }, 1000)
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
    setUpdatingStatus(false)
  }, [ticket?.status, updateTicket, id, showChat])

  // AI assistance: Auto-change status to In Progress if Open and no action for 5 minutes
  useEffect(() => {
    if (ticket && ticket.status === 'Open' && user?.role === 'Reviewer') {
      const timer = setTimeout(() => {
        handleStatusChange('In Progress')
        toast.info('AI assisted: Status changed to In Progress due to inactivity')
      }, 5 * 60 * 1000) // 5 minutes

      return () => clearTimeout(timer)
    }
  }, [ticket?.status, user?.role, handleStatusChange])

  const handleHide = async (commentId, unhideCode) => {
    setModerating(commentId)
    try {
      await hideFeedback(id, commentId, unhideCode)
      toast.success('Comment hidden successfully')
    } catch (error) {
      toast.error('Failed to hide comment')
    }
    setModerating(null)
  }

  const handleUnhide = async (commentId) => {
    setModerating(commentId)
    try {
      await unhideFeedback(id, commentId)
      toast.success('Comment unhidden successfully')
    } catch (error) {
      toast.error('Failed to unhide comment')
    }
    setModerating(null)
  }

  const handleApprove = async (commentId) => {
    setModerating(commentId)
    try {
      await approveHiddenForManager(id, commentId)
      toast.success('Approved for manager view')
    } catch (error) {
      toast.error('Failed to approve')
    }
    setModerating(null)
  }



  const handleIntervention = async () => {
    if (!interventionContent.trim()) return
    setModerating('intervention')
    try {
      await managerIntervention(id, ticket.comments[0]?._id, interventionContent)
      toast.success('Manager intervention added')
      setInterventionContent('')
    } catch (error) {
      toast.error('Failed to add intervention')
    }
    setModerating(null)
  }

  if (loading && !ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading ticket details...</div>
      </DashboardLayout>
    )
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">Ticket not found</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            Ticket #{ticket._id.slice(-6).toUpperCase()}
          </motion.h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Moderate feedback and manage ticket details.
          </p>
        </div>

        {/* Ticket Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Subject: {ticket.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Urgency: 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-bold ${
                      ticket.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                      ticket.urgency === 'High' ? 'bg-orange-100 text-orange-700' :
                      ticket.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {ticket.urgency}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Location: {ticket.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Status: {ticket.status}</span>
                  {user?.role === 'Reviewer' && (
                    <Listbox value={ticket.status} onChange={handleStatusChange} disabled={updatingStatus}>
                      <div className="relative">
                        <ListboxButton className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/60 disabled:opacity-50">
                          Change
                          <ChevronDown size={12} />
                        </ListboxButton>
                        <Transition
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <ListboxOptions className="absolute z-10 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                            {['Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                              <ListboxOption
                                key={status}
                                value={status}
                                className={({ active }) =>
                                  `cursor-pointer select-none px-3 py-2 text-sm ${
                                    active ? 'bg-blue-100 dark:bg-blue-900/40' : 'text-gray-900 dark:text-gray-300'
                                  }`
                                }
                              >
                                {status}
                              </ListboxOption>
                            ))}
                          </ListboxOptions>
                        </Transition>
                      </div>
                    </Listbox>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Chat Enabled: {ticket.chatEnabled ? 'Yes' : 'No'}</span>
                  {ticket.chatEnabled && (
                    <button
                      onClick={() => setShowChat(true)}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      Open Chat
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{ticket.description}</p>
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Attachments</h4>
                  {ticket.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={`http://localhost:5001/uploads/${att.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {att.filename}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          id="feedback-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border transition-all duration-500 ${
            highlightFeedback
              ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20'
              : 'border-gray-100 dark:border-gray-700'
          }`}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feedback & Comments</h3>
          {user?.role === 'Manager' && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Manager Intervention</h4>
              <textarea
                value={interventionContent}
                onChange={(e) => setInterventionContent(e.target.value)}
                placeholder="Add manager intervention..."
                className="w-full p-2 border border-blue-300 dark:border-blue-700 rounded-md bg-white dark:bg-gray-800 text-sm"
                rows={3}
              />
              <button
                onClick={handleIntervention}
                disabled={moderating === 'intervention' || !interventionContent.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {moderating === 'intervention' ? 'Adding...' : 'Add Intervention'}
              </button>
            </div>
          )}
          {ticket.comments && ticket.comments.length > 0 ? (
            <div className="space-y-4">
              {ticket.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    comment.hidden ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-600' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{comment.user?.username || 'Unknown'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{comment.user?.role || 'User'}</span>
                        {comment.aiGenerated && (
                          <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase rounded">
                            AI
                          </span>
                        )}
                        {comment.hidden && (
                          <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold uppercase rounded">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l border-gray-300 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Replies:</p>
                          {comment.replies.map((reply, rIdx) => (
                            <div key={rIdx} className="mb-2">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{reply.user?.username || 'Unknown'}: </span>
                              <span className="text-xs text-gray-700 dark:text-gray-300">{reply.content}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {comment.hidden ? (
                        <>
                          <button
                            onClick={() => handleUnhide(comment._id)}
                            disabled={moderating === comment._id}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded disabled:opacity-50"
                            title="Unhide Comment"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              const code = prompt('Enter unhide code:')
                              if (code) handleHide(comment._id, code)
                            }}
                            disabled={moderating === comment._id}
                            className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded disabled:opacity-50"
                            title="Approve for Manager"
                          >
                            <CheckCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            const code = prompt('Enter hide code:')
                            if (code) handleHide(comment._id, code)
                          }}
                          disabled={moderating === comment._id}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                          title="Hide Comment"
                        >
                          <EyeOff size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          )}
        </motion.div>

        {/* Chat Modal */}
        {showChat && ticket.chatEnabled && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl h-96 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chat for Ticket #{ticket._id.slice(-6).toUpperCase()}</h3>
                <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded">
                {ticket.comments?.map((comment, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>{comment.user?.username}: </strong>{comment.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type message..." className="flex-1 p-2 border rounded" />
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ReviewerTicketDetail