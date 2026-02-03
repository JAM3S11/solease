import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ArrowLeft, User, Bot, Clock, CheckCircle, Eye, EyeOff, Calendar, AlertCircle, MoreVertical } from 'lucide-react';
import DashboardLayout from '../ui/DashboardLayout';
import { useAuthenticationStore } from '../../store/authStore';
import useTicketStore from '../../store/ticketStore';
import toast from 'react-hot-toast';

const FeedbackComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const {
    tickets,
    fetchTickets,
    fetchSingleTicket,
    submitFeedback,
    addReply,
    loading,
    hideFeedback,
    unhideFeedback,
    approveHiddenForManager,
    managerIntervention
  } = useTicketStore();

  const [newMessage, setNewMessage] = useState('');
  const [moderating, setModerating] = useState(null);
  const [interventionContent, setInterventionContent] = useState('');
  const [moderationMenu, setModerationMenu] = useState(null);


  useEffect(() => {
    if (!tickets.length) {
      fetchTickets();
    } else if (!tickets.find(t => t?._id === id)) {
      fetchSingleTicket(id);
    }
  }, [fetchTickets, fetchSingleTicket, tickets, id]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, [fetchTickets]);

  const ticket = tickets.find(t => t?._id === id);

  // This checks if the user can provide a feedback
  const canProvideFeedback = ticket && (user?.role === 'Client'
    ? (ticket.status === 'Resolved' || ticket.status === 'In Progress')
    : (user?.role === 'Reviewer' || user?.role === 'Manager'));

  // This checks if the user can moderate (Reviewer/Manager roles)
  const canModerate = ['Reviewer', 'Manager'].includes(user?.role);

  const handleSubmitMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (!ticket.comments || ticket.comments.length === 0) {
        if (user?.role === 'Client') {
          // First message - submit as feedback
          await submitFeedback(id, newMessage);
          toast.success('Feedback submitted successfully');
        } else {
          toast.error('Only clients can submit initial feedback');
          return;
        }
      } else {
        // Subsequent messages - add as reply to the latest comment
        const latestComment = ticket.comments[ticket.comments.length - 1];
        await addReply(id, latestComment._id, newMessage);
        toast.success('Message sent successfully');
      }
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  const handleHide = async (commentId, unhideCode) => {
    setModerating(commentId);
    try {
      await hideFeedback(id, commentId, unhideCode);
      toast.success('Comment hidden successfully');
    } catch (error) {
      toast.error('Failed to hide comment');
    }
    setModerating(null);
  };

  const handleUnhide = async (commentId) => {
    const code = prompt('Enter unhide code:');
    if (!code) return;
    setModerating(commentId);
    try {
      await unhideFeedback(id, commentId, code);
      toast.success('Comment unhidden successfully');
    } catch (error) {
      toast.error('Failed to unhide comment');
    }
    setModerating(null);
  };

   const handleIntervention = async () => {
     if (!interventionContent.trim()) return;
     setModerating('intervention');
     try {
       const latestComment = ticket.comments[ticket.comments.length - 1];
       await managerIntervention(id, latestComment?._id, interventionContent);
       toast.success('Manager intervention added');
       setInterventionContent('');
     } catch (error) {
       toast.error('Failed to add intervention');
     }
     setModerating(null);
   };

  // Helper function to format relative time
  const getRelativeTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [name, secondsInInterval] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInInterval);
      if (interval >= 1) {
        return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  // Helper to get urgency color
  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'High': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    }
  };

  // Helper to get urgency icon
  const getUrgencyIcon = (urgency) => {
    switch(urgency) {
      case 'Critical': return '🔴';
      case 'High': return '🟠';
      case 'Medium': return '🟡';
      default: return '🟢';
    }
  };



  if (loading && !ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Loading ticket details...</div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">Ticket not found</div>
      </DashboardLayout>
    );
  }

  // Sort comments by createdAt
  if (ticket.comments) {
    ticket.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  // Count messages per user for chat conversion logic
  const relevantMessages = ticket.comments ? ticket.comments.filter(c => ['Client', 'Reviewer', 'Manager'].includes(c.user?.role)) : [];
  const chatEnabled = relevantMessages.length >= 4;

  // Collect all messages (comments and replies) from all tickets
  const allMessages = [];
  if (ticket.comments) {
    ticket.comments.filter(comment => !comment.isHidden).forEach(comment => {
      allMessages.push({
        ...comment,
        type: 'comment',
        id: comment._id,
        createdAt: comment.createdAt
      });
      if (comment.replies) {
        comment.replies.forEach(reply => {
          allMessages.push({
            ...reply,
            type: 'reply',
            commentId: comment._id,
            id: reply._id,
            createdAt: reply.createdAt
          });
        });
      }
    });
  }
  allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle size={24} className="text-blue-600 dark:text-blue-400" />
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {chatEnabled ? 'Live Chat' : 'Ticket Feedback'}
                  </h1>
                  <span className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
                    #{ticket._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm ml-9">
                  {user?.role === 'Client' ? (chatEnabled ? 'Real-time conversation with support team' : 'Share your feedback on this ticket') : 'Respond to client inquiries and provide support'}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    ticket.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    ticket.status === 'Closed' ? 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    <CheckCircle size={14} />
                    {ticket.status}
                  </span>
                  {chatEnabled && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                      💬 Chat Active
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-slate-400" />
                <span className={`text-sm font-medium ${getUrgencyColor(ticket.urgency)}`}>
                  {getUrgencyIcon(ticket.urgency)} {ticket.urgency} Priority
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock size={16} className="text-slate-400" />
                <span className="text-sm font-medium">Created {getRelativeTime(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar size={16} className="text-slate-400" />
                <span className="text-sm font-medium">Updated {getRelativeTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ticket Info - Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-lg">📋</span> Ticket Information
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Subject */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">Subject</label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.subject}</p>
            </div>

            {/* Location */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">📍 Location</label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.location}</p>
            </div>

            {/* Issue Type */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">Issue Type</label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.issueType}</p>
            </div>

            {/* Status */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">Status</label>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  ticket.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                  ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  ticket.status === 'Closed' ? 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                }`}>
                  <span className="text-xs">●</span> {ticket.status}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">Created</label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{new Date(ticket.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getRelativeTime(ticket.createdAt)}</p>
            </div>

            {/* Updated Date */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-2">Last Updated</label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getRelativeTime(ticket.updatedAt)}</p>
            </div>
          </div>
        </motion.div>

        {/* Manager Intervention (Manager only) */}
        {user?.role === 'Manager' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/15 rounded-xl p-6 mb-6 border border-amber-200 dark:border-amber-800 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle size={20} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100">Manager Intervention</h3>
                <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">💡 This message will only be visible to IT support staff</p>
              </div>
            </div>
            <textarea
              value={interventionContent}
              onChange={(e) => setInterventionContent(e.target.value)}
              placeholder="Add internal notes or manager guidance..."
              className="w-full p-3 border border-amber-300 dark:border-amber-700 rounded-lg bg-white dark:bg-slate-800 text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleIntervention}
                disabled={moderating === 'intervention' || !interventionContent.trim()}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {moderating === 'intervention' ? 'Adding...' : 'Add Internal Note'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Messages/Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {chatEnabled ? 'Chat Messages' : 'Feedback & Comments'}
            </h3>
            <span className="ml-auto text-xs font-semibold text-slate-500 dark:text-slate-400">
              {allMessages.length} message{allMessages.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Messages Display with Enhanced Styling */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
            {allMessages.length > 0 ? (
              (() => {
                const groupedMessages = [];
                let currentGroup = [];
                let currentDate = null;

                allMessages.forEach((message, idx) => {
                  const messageDate = new Date(message.createdAt).toLocaleDateString();
                  
                  if (currentDate !== messageDate) {
                    if (currentGroup.length > 0) {
                      groupedMessages.push({ type: 'group', messages: currentGroup, date: currentDate });
                    }
                    currentDate = messageDate;
                    currentGroup = [message];
                  } else {
                    currentGroup.push(message);
                  }
                });

                if (currentGroup.length > 0) {
                  groupedMessages.push({ type: 'group', messages: currentGroup, date: currentDate });
                }

                return groupedMessages.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-3">
                    {/* Date Separator */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 px-2">
                        📅 {group.date}
                      </span>
                      <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
                    </div>

                    {/* Messages in Group */}
                    {group.messages.map((message, idx) => {
                      const isSelf = message.user?._id === user?._id;
                      const isReply = message.type === 'reply';
                      const isAI = message.aiGenerated;

                      return (
                        <motion.div 
                          key={`${message.type}-${message.id}`} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isSelf ? 'justify-end' : 'justify-start'} group/message`}
                        >
                          <div className={`max-w-sm ${isSelf ? '' : 'flex items-start gap-2.5'}`}>
                            {/* Sender Avatar */}
                            {!isSelf && (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isAI ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                              }`}>
                                <span className="text-xs font-bold">
                                  {isAI ? '🤖' : (message.user?.name?.charAt(0) || message.user?.username?.charAt(0) || '?')}
                                </span>
                              </div>
                            )}

                            <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                              {/* Sender Name & Role Badge */}
                              {!isSelf && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {message.user?.name || message.user?.username || 'Unknown'}
                                  </span>
                                  {message.user?.role && (
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                      isAI ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                      message.user?.role === 'Manager' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                      message.user?.role === 'Reviewer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                      'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
                                    }`}>
                                      {isAI ? 'AI' : message.user?.role}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Message Bubble */}
                              <div className={`px-4 py-3 rounded-lg ${
                                isSelf 
                                  ? 'bg-blue-600 text-white' 
                                  : isAI 
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-slate-900 dark:text-slate-100 border border-purple-300 dark:border-purple-700'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                              }`}>
                                <p className="text-sm leading-relaxed">{message.content}</p>

                                {/* Timestamp & Actions */}
                                <div className="flex items-center justify-between mt-2 gap-2">
                                  <span className={`text-xs ${isSelf ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>

                                  {/* Moderation Actions - Always Visible */}
                                  {canModerate && message.type === 'comment' && !isSelf && (
                                    <div className="flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => {
                                          const code = prompt('Enter hide code: SOLEASEHIDE');
                                          if (code === 'SOLEASEHIDE') handleHide(message._id, code);
                                        }}
                                        disabled={moderating === message._id}
                                        className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors"
                                        title="Hide inappropriate comment"
                                      >
                                        <EyeOff size={14} />
                                      </button>
                                      {message.isHidden && (
                                        <button
                                          onClick={() => {
                                            const code = prompt('Enter unhide code: SOLEASEUNHIDE');
                                            if (code === 'SOLEASEUNHIDE') handleUnhide(message._id);
                                          }}
                                          disabled={moderating === message._id}
                                          className="p-1 hover:bg-green-500 hover:text-white rounded transition-colors"
                                          title="Unhide comment"
                                        >
                                          <Eye size={14} />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Hidden Comment Indicator */}
                              {message.isHidden && (
                                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                  ⛔ This comment has been hidden by a moderator
                                </div>
                              )}
                            </div>

                            {/* Self Avatar */}
                            {isSelf && (
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">
                                  {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ));
              })()
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-medium">No {chatEnabled ? 'messages' : 'feedback'} yet</p>
                <p className="text-sm mt-1">
                  {user?.role === 'Client' ? 'Start the conversation!' : 'Waiting for client feedback...'}
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          {canProvideFeedback && (
            <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={user?.role === 'Client' ? (chatEnabled ? "Type your message..." : "Share your feedback...") : "Respond to client..."}
                  className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2 self-end"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          )}

          {!canProvideFeedback && (
            <div className="text-center py-4 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium">ℹ️ Feedback available when ticket is "Resolved" or "In Progress"</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackComponent;