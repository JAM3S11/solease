import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, CheckCircle, MessageCircle, AlertTriangle,
  MapPin, Tag, Info, ChevronDown, X, ShieldAlert, User, Clock, Send
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
  const [replyingTo, setReplyingTo] = useState(null) // { type: 'comment' | 'reply', messageId: string, commentId: string, content: string, user: string }
  const [editing, setEditing] = useState(null) // { type: 'comment' | 'reply', id: string, content: string }
  const [newMessage, setNewMessage] = useState('')
  
  // Custom Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalAction, setModalAction] = useState({ type: '', commentId: '' })
  const [hideCode, setHideCode] = useState('')
  const [unhideCode, setUnhideCode] = useState('')

  // FIX: Safe search prevents "Cannot read properties of undefined (reading '_id')"
  const ticket = useMemo(() => {
    return tickets.find(t => t?._id === id)
  }, [tickets, id])

  // This checks if the user can moderate (Reviewer/Manager roles)
  const canModerate = ['Reviewer', 'Manager'].includes(user?.role);

  // This checks if the user can provide a feedback
  const canProvideFeedback = ['Reviewer', 'Manager'].includes(user?.role);

  // Count messages per user for chat conversion logic
  const relevantMessages = ticket?.comments?.filter(c => ['Client', 'Reviewer', 'Manager'].includes(c.user?.role)) || [];
  const chatEnabled = relevantMessages.length >= 4;

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

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets()
    }, 10000) // Fetch every 10 seconds
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

  // Moderation Handlers
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
        toast.success('Comment is now visible to the user')
      }
      await fetchTickets() // Ensure immediate UI update
      setIsModalOpen(false)
    } catch (error) {
      toast.error(`Failed to ${type} comment`)
    } finally {
      setModerating(null)
    }
  }

   const handleIntervention = async () => {
     if (!interventionContent.trim() || !ticket?.comments?.[0]) return
     setModerating('intervention')
     try {
       await managerIntervention(id, ticket.comments[0]._id, interventionContent)
       toast.success('Manager intervention added')
       setInterventionContent('')
     } catch (error) {
       toast.error('Failed to add intervention')
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
     setReplyingTo({ type, messageId, commentId, content, user })
   }

   const cancelReply = () => {
     if (replyingTo) {
       setQuickReplies(prev => ({ ...prev, [replyingTo.commentId]: '' }))
     }
     setReplyingTo(null)
   }

   const startEdit = (type, id, content) => {
     setEditing({ type, id, content })
   }

   const saveEdit = async () => {
     if (!editing) return
     const newContent = editing.content.trim()
     if (!newContent) return
     setModerating(editing.id)
     try {
       if (editing.type === 'reply') {
         // Find the comment and reply
         const comment = ticket.comments.find(c => c.replies.some(r => r._id === editing.id))
         if (comment) {
           await editReply(id, comment._id, editing.id, newContent)
         }
       }
       // Comments are not editable in this setup
       toast.success('Message updated')
       setEditing(null)
       await fetchTickets()
     } catch (error) {
       toast.error('Failed to update message')
     } finally {
       setModerating(null)
     }
   }

    const handleDelete = async (type, messageId) => {
      if (!confirm('Are you sure you want to delete this message?')) return
      setModerating(messageId)
      try {
        if (type === 'reply') {
          // Find the comment
          const comment = ticket.comments.find(c => c.replies.some(r => r._id === messageId))
          if (comment) {
            await deleteReply(id, comment._id, messageId)
          }
        }
        toast.success('Message deleted')
        await fetchTickets()
      } catch (error) {
        toast.error('Failed to delete message')
      } finally {
        setModerating(null)
      }
    }

    const handleSubmitMessage = async () => {
      if (!newMessage.trim()) return

      try {
        if (!ticket.comments || ticket.comments.length === 0) {
          // First message - submit as feedback (but reviewer might not)
          toast.error('No comments to reply to')
          return
        } else {
          // Add as reply to the latest comment
          const latestComment = ticket.comments[ticket.comments.length - 1]
          await addReply(id, latestComment._id, newMessage)
          toast.success('Message sent successfully')
        }
        setNewMessage('')
      } catch (error) {
        console.error('Error sending message:', error)
        const errorMessage = error.response?.data?.message || 'Failed to send message'
        toast.error(errorMessage)
      }
    }

  if (loading && !ticket) {
    return <DashboardLayout><div className="p-8 text-center dark:text-white">Loading ticket...</div></DashboardLayout>
  }

  if (!ticket) {
    return <DashboardLayout><div className="p-8 text-center text-red-600">Ticket not found</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Ticket <span className="text-blue-600">#{ticket._id.slice(-6).toUpperCase()}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Reviewer Control Center</p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
             <span className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-2">Status</span>
             <Listbox value={ticket.status} onChange={handleStatusChange} disabled={updatingStatus}>
                <div className="relative">
                  <ListboxButton className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors">
                    {updatingStatus ? 'Updating...' : ticket.status}
                    <ChevronDown size={16} />
                  </ListboxButton>
                  <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className="absolute right-0 z-50 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden focus:outline-none">
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                        <ListboxOption key={s} value={s} className={({ active }) => `cursor-pointer px-4 py-3 text-sm ${active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {s}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
             </Listbox>
          </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
             {/* Ticket Content */}
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                 <Info size={18} className="text-blue-500" /> Description
               </h3>
               <div className="space-y-4">
                 <p className="text-gray-700 dark:text-gray-200 font-semibold text-lg leading-tight">{ticket.subject}</p>
                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{ticket.description}</p>
               </div>
             </motion.div>

             {/* Feedback Log - Where Hiding/Unhiding happens */}
             <div ref={feedbackRef} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Interaction Log</h3>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-bold text-gray-500">
                    {ticket.comments?.filter(c => c.user?.role === 'Client').length || 0} Total
                  </span>
               </div>

               <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                 {ticket.comments?.map((comment, idx) =>
                   <div
                     key={idx}
                      className={`p-4 rounded-lg border ${
                        comment.isHidden ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-600' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                   >
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                           <User size={16} className="text-gray-400" />
                           <span className="font-medium text-gray-900 dark:text-white">{comment.user?.name || comment.user?.username || 'Unknown'}</span>
                           <span className="text-xs text-gray-500 dark:text-gray-400">({comment.user?.role || 'User'})</span>
                           {comment.aiGenerated && (
                             <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase rounded">
                               AI
                             </span>
                           )}
                            {comment.isHidden && (
                              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold uppercase rounded">
                                Hidden
                              </span>
                            )}
                         </div>
                         <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                         <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                           <Clock size={12} />
                           {new Date(comment.createdAt || Date.now()).toLocaleString()}
                         </div>
                         {comment.replies && comment.replies.length > 0 && (
                           <div className="mt-4 space-y-2">
                             {comment.replies.map(reply =>
                               <div key={reply._id} className="ml-4 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                  <p className='text-sm text-gray-900'>{reply.user?.name || reply.user?.username || 'Unknown'}</p>
                                 <p className="text-[11px] text-gray-700 dark:text-gray-300">{reply.content}</p>
                                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                   {new Date(reply.createdAt || Date.now()).toLocaleString()}
                                 </div>
                               </div>
                             )}
                           </div>
                         )}
                       </div>

                       {/* Moderation Actions */}
                       {canModerate && (
                         <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => openModerationModal(comment.isHidden ? 'unhide' : 'hide', comment._id)}
                              disabled={moderating === comment._id}
                              className={`p-1 rounded disabled:opacity-50 ${
                                comment.isHidden
                                  ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                                  : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
                              }`}
                              title={comment.isHidden ? 'Unhide Comment' : 'Hide Comment'}
                            >
                              {comment.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Sidebar */}
           <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h4 className="font-bold mb-4 text-sm dark:text-white flex items-center gap-2 uppercase tracking-widest opacity-50">Details</h4>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold uppercase">Priority</span>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                        ticket.urgency === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>{ticket.urgency}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-bold uppercase">Location</span>
                      <span className="text-xs font-bold dark:text-gray-300 flex items-center gap-1"><MapPin size={12}/> {ticket.location}</span>
                   </div>
                   <button onClick={() => setShowChat(true)} className="w-full mt-4 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                     <MessageCircle size={18} /> Internal Chat
                   </button>
                </div>

               {/* Message Input */}
               {canProvideFeedback && (
                 <div className="mt-6">
                   <textarea
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder="Add a comment..."
                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     rows={3}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         handleSubmitMessage();
                       }
                     }}
                   />
                   <button
                     onClick={handleSubmitMessage}
                     disabled={loading || !newMessage.trim()}
                     className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                   >
                     <Send size={16} />
                     Send
                   </button>
                 </div>
               )}
             </div>
           </div>
         </div>

        {/* Internal Chat Modal */}
        <Transition show={showChat} as={React.Fragment}>
          <Dialog as="div" className="relative z-[100]" onClose={() => setShowChat(false)}>
            <TransitionChild as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all border border-white/10">
                  <DialogTitle as="h3" className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    <MessageCircle className="text-blue-500" />
                    Internal Chat
                  </DialogTitle>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      Use this space for internal communication about this ticket between reviewers and managers.
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        Chat functionality coming soon...
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button onClick={() => setShowChat(false)} className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                      Close
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* REUSABLE DIALOG MODAL */}
        <Transition show={isModalOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-[100]" onClose={() => setIsModalOpen(false)}>
            <TransitionChild as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800 p-8 text-left align-middle shadow-2xl transition-all border border-white/10">
                  <DialogTitle as="h3" className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                    {modalAction.type === 'hide' ? <EyeOff className="text-red-500" /> : <Eye className="text-green-500" />}
                    {modalAction.type === 'hide' ? 'Hide this comment?' : 'Unhide this comment?'}
                  </DialogTitle>
                  
                  <div className="mt-4">
                     <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                       {modalAction.type === 'hide'
                         ? 'This will remove the comment from the public feed. You must provide the hide code "SOLEASEHIDE".'
                         : 'This will restore the comment. You must provide the unhide code "SOLEASEUNHIDE".'}
                     </p>
                     {modalAction.type === 'hide' ? (
                       <input
                         autoFocus
                         type="text"
                         value={hideCode}
                         onChange={(e) => setHideCode(e.target.value)}
                         placeholder="Enter hide code: SOLEASEHIDE"
                         className="mt-4 w-full rounded-2xl border-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     ) : (
                       <input
                         autoFocus
                         type="text"
                         value={unhideCode}
                         onChange={(e) => setUnhideCode(e.target.value)}
                         placeholder="Enter unhide code: SOLEASEUNHIDE"
                         className="mt-4 w-full rounded-2xl border-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       />
                     )}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                      Nevermind
                    </button>
                     <button
                       onClick={submitModeration}
                       disabled={moderating || (modalAction.type === 'hide' ? !hideCode : !unhideCode)}
                       className={`flex-1 py-3 text-sm font-black text-white rounded-2xl shadow-xl transition-all ${
                         modalAction.type === 'hide' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-green-600 hover:bg-green-700 shadow-green-500/30'
                       } disabled:opacity-30`}
                     >
                      {moderating ? 'Syncing...' : 'Confirm Action'}
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
          </Transition>
        </div>
      </DashboardLayout>
  )
}

export default ReviewerTicketDetail