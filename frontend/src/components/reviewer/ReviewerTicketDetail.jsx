import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, CheckCircle, MessageCircle, AlertTriangle,
  MapPin, Tag, Info, ChevronDown, X, ShieldAlert, User, Clock, Send, ThumbsUp, Bot
} from 'lucide-react'
import { 
  Listbox, ListboxButton, ListboxOption, ListboxOptions, 
  Transition, Dialog, DialogPanel, DialogTitle, TransitionChild 
} from '@headlessui/react'
import DashboardLayout from '../ui/DashboardLayout'
import { useAuthenticationStore } from '../../store/authStore'
import useTicketStore from '../../store/ticketStore'
import toast from 'react-hot-toast'

const ReviewerTicketDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const feedbackRef = useRef(null)
  
  const { user } = useAuthenticationStore()
  const {
    tickets, fetchTickets, hideFeedback, unhideFeedback,
    updateTicket, managerIntervention, addReply, editReply, deleteReply, loading
  } = useTicketStore()

  // State
  const [moderating, setModerating] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [interventionContent, setInterventionContent] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [quickReplies, setQuickReplies] = useState({})
  const [replyingTo, setReplyingTo] = useState(null) 
  const [editing, setEditing] = useState(null) 
  const [newMessage, setNewMessage] = useState('')
  
  // Custom Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState({ type: '', commentId: '' })
  const [hideCode, setHideCode] = useState('')
  const [unhideCode, setUnhideCode] = useState('')

  const ticket = useMemo(() => {
    return tickets.find(t => t?._id === id)
  }, [tickets, id])

  const canModerate = ['Reviewer', 'Manager'].includes(user?.role);
  const canProvideFeedback = ['Reviewer', 'Manager'].includes(user?.role);

  useEffect(() => {
    if (!tickets.length) fetchTickets()
  }, [fetchTickets, tickets.length])

  // AI Assistance: Auto-transition logic
  useEffect(() => {
    if (ticket?.status === 'Open' && user?.role === 'Reviewer') {
      const timer = setTimeout(() => {
        handleStatusChange('In Progress')
        toast.info('AI: Status updated due to inactivity')
      }, 5 * 60 * 1000)
      return () => clearTimeout(timer)
    }
  }, [ticket?.status, user?.role])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets()
    }, 10000)
    return () => clearInterval(interval)
  }, [fetchTickets])

  const handleStatusChange = useCallback(async (newStatus) => {
    if (!ticket || newStatus === ticket.status) return
    setUpdatingStatus(true)
    try {
      await updateTicket(id, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }, [ticket, updateTicket, id])

  const openModerationModal = (type, commentId) => {
    setModalAction({ type, commentId })
    setHideCode('')
    setUnhideCode('')
    setIsModalOpen(true)
  }

  const submitModeration = async () => {
    const { type, commentId } = modalAction
    setModerating(commentId)
    try {
      if (type === 'hide') {
        await hideFeedback(id, commentId, hideCode)
        toast.success('Comment hidden successfully')
      } else {
        await unhideFeedback(id, commentId, unhideCode)
        toast.success('Comment restored')
      }
      await fetchTickets()
      setIsModalOpen(false)
    } catch (error) {
      toast.error(`Failed to ${type} comment`)
    } finally {
      setModerating(null)
    }
  }

  const handleQuickReply = async (commentId) => {
    const content = quickReplies[commentId]?.trim()
    if (!content) return
    setModerating(commentId)
    try {
      await addReply(id, commentId, content)
      toast.success('Reply sent successfully')
      setQuickReplies(prev => ({ ...prev, [commentId]: '' }))
      setReplyingTo(null)
      await fetchTickets()
    } catch (error) {
      toast.error('Failed to send reply')
    } finally {
      setModerating(null)
    }
  }

  const startReply = (type, messageId, commentId, content, user) => {
    setReplyingTo({ 
      type, 
      messageId, 
      commentId, 
      content, 
      user 
    })
  }

  const cancelReply = () => {
    if (replyingTo) {
      setQuickReplies(prev => (
        { 
          ...prev, 
          [replyingTo.commentId]: '' 
        }
      ))
    }
    setReplyingTo(null)
  }

  const handleDelete = async (type, messageId) => {
    if (!confirm('Are you sure?')) return
    setModerating(messageId)
    try {
      if (type === 'reply') {
        const comment = ticket.comments.find(c => c.replies.some(r => r._id === messageId))
        if (comment) await deleteReply(id, comment._id, messageId)
      }
      toast.success('Deleted')
      await fetchTickets()
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setModerating(null)
    }
  }

  const handleSubmitMessage = async () => {
    if (!newMessage.trim()) return
    try {
      if (!ticket.comments || ticket.comments.length === 0) {
        toast.error('No comments to reply to')
        return
      }
      const latestComment = ticket.comments[ticket.comments.length - 1]
      await addReply(id, latestComment._id, newMessage)
      toast.success('Message sent')
      setNewMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20">
          {/* Loading Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="w-64 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
                <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Loading Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Description Skeleton */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-blue-500">
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </motion.div>

              {/* Interaction Log Skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          </div>
                          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                  <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mt-6"></div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Spinner Overlay */}
          <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Loading Ticket Details...</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch the information</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )

  if (!ticket) return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20">
          {/* Back Button */}
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => navigate('/reviewer-dashboard')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronDown size={16} className="rotate-90" />
              Back to Dashboard
            </button>
          </div>

          {/* Not Found Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg">
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={40} className="text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Ticket Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  The ticket you're looking for doesn't exist or has been removed. It might have been deleted or you may have followed an incorrect link.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/reviewer-dashboard')}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronDown size={16} className="rotate-90" />
                  Return to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  If you believe this is an error, please contact support.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-20">
        
        {/* Enhanced Header with Back Button and Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate('/reviewer-dashboard')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronDown size={16} className="rotate-90" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Ticket <span className="text-blue-600">#{ticket._id.slice(-6).toUpperCase()}</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Reviewer Control Center • {ticket.urgency} Priority</p>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</span>
              </div>
              <Listbox 
                value={ticket.status} 
                onChange={handleStatusChange} 
                disabled={updatingStatus}>
                <div className="relative">
                  <ListboxButton className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50">
                    {updatingStatus ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      <>
                        {ticket.status}
                        <ChevronDown size={16} />
                      </>
                    )}
                  </ListboxButton>
                  <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute right-0 z-50 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden focus:outline-none">
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                        <ListboxOption key={s} value={s} className={({ active }) => `cursor-pointer px-4 py-3 text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                          {s}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info size={18} className="text-blue-500" /> Ticket Description
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Tag size={12} />
                  Created {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-l-4 border-blue-500">
                  <h4 className="text-gray-700 dark:text-gray-200 font-semibold text-lg leading-tight mb-2">
                    {ticket.subject}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Interaction Log */}
            <div ref={feedbackRef} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-500" /> Interaction Log
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-3 py-1 rounded-full">
                    {ticket.comments?.length || 0} Activities
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors" title="Refresh">
                    <ThumbsUp size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                {ticket.comments?.map((comment, idx) => (
                  <div key={idx} className="group flex gap-4">
                     <div className="flex flex-col items-center">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 border-2 border-white dark:border-gray-800 shadow-lg flex-shrink-0">
                         <User size={20} />
                       </div>
                       <div className="w-0.5 grow bg-gradient-to-b from-blue-200 to-transparent dark:from-blue-700 dark:to-transparent mt-2 rounded-full" />
                     </div>

                     <div className="flex-1 min-w-0">
                       <div className={`relative rounded-2xl rounded-tl-none p-5 transition-all duration-200 ${
                         comment.isHidden
                           ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 shadow-sm'
                           : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md'
                       }`}>
                         <div className="flex justify-between items-start mb-3">
                           <div className="flex flex-wrap items-center gap-x-3">
                             <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {comment.user?.name || 'Anonymous'}
                             </span>
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">• {comment.user?.role}</span>
                             {comment.aiGenerated && (
                               <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[9px] font-black rounded-full flex items-center gap-1">
                                 <Bot size={8} /> AI
                               </span>
                             )}
                             {comment.isHidden && (
                               <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[9px] font-black rounded-full flex items-center gap-1">
                                 <EyeOff size={8} /> Hidden
                               </span>
                             )}
                           </div>
                           {canModerate && (
                             <button
                               onClick={() => openModerationModal(comment.isHidden ? 'unhide' : 'hide', comment._id)}
                               className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all text-gray-400 hover:text-gray-600"
                               title={comment.isHidden ? 'Unhide Comment' : 'Hide Comment'}
                             >
                               {comment.isHidden ? <Eye size={16} className="text-green-600" /> : <EyeOff size={16} className="text-red-500" />}
                             </button>
                           )}
                         </div>
                         <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.content}
                         </p>
                         <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                           <button
                             onClick={() => startReply('comment', comment._id, comment._id, '', comment.user?.name)}
                             className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                           >
                             <MessageCircle size={12} /> Reply
                           </button>
                           <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                             <Clock size={10} /> 
                             {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                         </div>
                       </div>

                      <AnimatePresence>
                        {replyingTo?.commentId === comment._id && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mt-4 ml-2">
                            <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm ring-1 ring-blue-500/20">
                              <textarea autoFocus 
                                placeholder={`Reply to ${replyingTo.user}...`} 
                                value={quickReplies[comment._id] || ''} 
                                onChange={(e) => 
                                  setQuickReplies({ 
                                    ...quickReplies, 
                                    [comment._id]: e.target.value 
                                  })
                                } 
                                className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none resize-none min-h-[50px]" />
                              <div className="flex justify-end gap-2 mt-2">
                                <button onClick={cancelReply} 
                                  className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600">
                                    Cancel
                                </button>
                                <button onClick={() => 
                                  handleQuickReply(comment._id)} 
                                  disabled={!quickReplies[comment._id]?.trim()} 
                                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-full hover:bg-blue-700 disabled:opacity-30">
                                    Post Reply
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                       {comment.replies && comment.replies.length > 0 && (
                         <div className="mt-6 space-y-3">
                           {comment.replies.map(reply => (
                             <div key={reply._id} className="flex gap-3 group/reply ml-6">
                               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-gray-800 shadow-sm">
                                 {reply.user?.name?.[0] || 'R'}
                               </div>
                               <div className="flex-1 min-w-0">
                                 <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl rounded-tl-none border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm">
                                   <div className="flex items-center justify-between mb-2">
                                     <div className="flex items-center gap-2">
                                       <span className="font-semibold text-xs text-gray-900 dark:text-white">
                                        {reply.user?.name || 'Reviewer'}
                                       </span>
                                       <span className="text-[9px] font-black text-gray-400 uppercase bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                        REPLY
                                       </span>
                                       {reply.aiGenerated && <span className="text-[8px] font-black text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded-full">AI</span>}
                                     </div>
                                     {canModerate && (
                                       <button
                                         onClick={() => handleDelete('reply', reply._id)}
                                         className="opacity-0 group-hover/reply:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                         title="Delete Reply"
                                       >
                                         <X size={12} />
                                       </button>
                                     )}
                                   </div>
                                   <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{reply.content}</p>
                                   <div className="flex justify-end mt-2">
                                     <span className="text-[9px] text-gray-400 font-medium">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                     </span>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
               <h4 className="font-bold mb-6 text-sm dark:text-white flex items-center gap-2 uppercase tracking-widest">
                 <ShieldAlert size={16} className="text-blue-500" /> Ticket Details
               </h4>
               <div className="space-y-5">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                     <span className="text-xs text-gray-500 font-bold uppercase">Priority</span>
                     <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                       ticket.urgency === 'Critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                       ticket.urgency === 'High' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                       'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                     }`}>{ticket.urgency}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                     <span className="text-xs text-gray-500 font-bold uppercase">Location</span>
                     <span className="text-xs font-bold dark:text-gray-300 flex items-center gap-1"><MapPin size={12} className="text-gray-400" /> {ticket.location}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                     <span className="text-xs text-gray-500 font-bold uppercase">Last Updated</span>
                     <span className="text-xs font-bold dark:text-gray-300">{new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => setShowChat(true)}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 dark:text-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-300 transition-all shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle size={18} /> Internal Chat
                  </button>
               </div>

               {canProvideFeedback && (
                 <div className="mt-6">
                    <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Add a comment..." className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none focus:ring-2 focus:ring-blue-500" rows={3} />
                    <button onClick={handleSubmitMessage} disabled={loading || !newMessage.trim()} className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                      <Send size={16} /> Send
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <Transition show={showChat} as={React.Fragment}>
          <Dialog as="div" className="relative z-[100]" onClose={() => setShowChat(false)}>
            <TransitionChild as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            </TransitionChild>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800 p-8 text-left shadow-2xl transition-all border border-white/10">
                  <DialogTitle as="h3" className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3"><MessageCircle className="text-blue-500" />
                   Internal Chat
                  </DialogTitle>
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Chat functionality coming soon...
                    </p>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => setShowChat(false)} 
                      className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600">
                        Close
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition show={isModalOpen} as={React.Fragment}>
          <Dialog 
            as="div" 
            className="relative z-[100]" 
            onClose={() => setIsModalOpen(false)}>
            <TransitionChild 
              as={React.Fragment} 
              enter="ease-out duration-300" 
              enterFrom="opacity-0" 
              enterTo="opacity-100" 
              leave="ease-in duration-200" 
              leaveFrom="opacity-100" 
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            </TransitionChild>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800 p-8 text-left shadow-2xl transition-all border border-white/10">
                  <DialogTitle as="h3" className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    {modalAction.type === 'hide' 
                      ? <EyeOff className="text-red-500" /> 
                      : <Eye className="text-green-500" />
                    }
                    {modalAction.type === 'hide' 
                      ? 'Hide this comment?' 
                      : 'Unhide this comment?'
                    }
                  </DialogTitle>
                  <div className="mt-4">
                    <input autoFocus 
                      type="text" 
                      value={modalAction.type === 'hide' 
                        ? hideCode 
                        : unhideCode
                      } 
                      onChange={
                        (e) => modalAction.type === 'hide' 
                          ? setHideCode(e.target.value) 
                          : setUnhideCode(e.target.value)
                      } 
                      placeholder={modalAction.type === 'hide' 
                        ? "SOLEASEHIDE" 
                        : "SOLEASEUNHIDE"
                      } 
                      className="mt-4 w-full rounded-2xl border-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600">
                        Nevermind
                    </button>
                    <button 
                      onClick={submitModeration} 
                      disabled={moderating || (modalAction.type === 'hide' 
                        ? !hideCode 
                        : !unhideCode)
                      } 
                      className={`flex-1 py-3 text-sm font-black text-white rounded-2xl shadow-xl 
                        ${modalAction.type === 'hide' 
                          ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' 
                          : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'} disabled:opacity-30`
                      }>
                        {moderating ? 'Syncing...' : 'Confirm Action'}
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </Transition>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ReviewerTicketDetail