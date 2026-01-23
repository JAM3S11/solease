import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, ArrowLeft, User, Bot, Clock, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <div>
               <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                 {chatEnabled ? 'Chat' : 'Feedback'} - Ticket #{ticket._id.slice(-6).toUpperCase()}
               </h1>
               <p className="text-gray-500 dark:text-gray-400 mt-1">
                 {user?.role === 'Client' ? (chatEnabled ? 'Real-time conversation enabled' : 'Provide feedback on this ticket') : 'Respond to client feedback'}
               </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                ticket.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                {ticket.status}
              </span>
              {chatEnabled && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                  Chat Enabled
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Ticket Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Information</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Subject:</strong> {ticket.subject}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Status:</strong> {ticket.status}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Urgency:</strong> {ticket.urgency}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Location:</strong> {ticket.location}</p>
          </div>
        </motion.div>

        {/* Manager Intervention (Manager only) */}
        {user?.role === 'Manager' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-800"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Manager Intervention</h3>
            <textarea
              value={interventionContent}
              onChange={(e) => setInterventionContent(e.target.value)}
              placeholder="Add manager intervention..."
              className="w-full p-3 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none"
              rows={3}
            />
            <button
              onClick={handleIntervention}
              disabled={moderating === 'intervention' || !interventionContent.trim()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {moderating === 'intervention' ? 'Adding...' : 'Add Intervention'}
            </button>
          </motion.div>
        )}

        {/* Messages/Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={20} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {chatEnabled ? 'Chat Messages' : 'Feedback & Comments'}
            </h3>
          </div>

          {/* Messages Display */}
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto p-4">
           {allMessages.length > 0 ? allMessages.map((message, idx) => {
              const isSelf = message.user?._id === user?._id;
              const prevMessage = idx > 0 ? allMessages[idx - 1] : null;
              const showAvatar = !prevMessage || prevMessage.user?._id !== message.user?._id;
              const isReply = message.type === 'reply';
              return (
                <div key={`${message.type}-${message.id}`} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} mb-2 group`}>
                  {!isSelf && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {message.user?.name?.charAt(0) || message.user?.username?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  {!isSelf && !showAvatar && <div className="w-10"></div>}
                  <div className={isSelf ? 'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-blue-500 text-white' : 'max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}>
                    {!isSelf && showAvatar && (
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {message.user?.name || message.user?.username || 'Unknown'}
                        {message.user?.role && ` (${message.user?.role})`}
                        {message.aiGenerated && ' (AI)'}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
                      <span>{new Date(message.createdAt || Date.now()).toLocaleString()}</span>
                      <div className="flex gap-1">
                        {canModerate && message.type === 'comment' && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                const code = prompt('Enter hide code: SOLEASEHIDE');
                                if (code === 'SOLEASEHIDE') handleHide(message._id, code);
                              }}
                              disabled={moderating === message._id}
                              className="p-1 text-red-400 hover:bg-red-600 rounded"
                              title="Hide"
                            >
                              <EyeOff size={12} />
                            </button>
                            {message.isHidden && (
                              <button
                                onClick={() => {
                                  const code = prompt('Enter unhide code: SOLEASEUNHIDE');
                                  if (code === 'SOLEASEUNHIDE') handleUnhide(message._id, code);
                                }}
                                disabled={moderating === message._id}
                                className="p-1 text-green-400 hover:bg-green-600 rounded"
                                title="Unhide"
                              >
                                <Eye size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelf && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  {isSelf && !showAvatar && <div className="w-10"></div>}
                </div>
              );
            }) : (
             <div className="text-center py-8 text-gray-500 dark:text-gray-400">
               <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No {chatEnabled ? 'messages' : 'feedback'} yet. {user?.role === 'Client' ? 'Start the conversation!' : 'Waiting for client feedback...'}</p>
             </div>
           )}
          </div>

          {/* Message Input */}
          {canProvideFeedback && (
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                 placeholder={user?.role === 'Client' ? (chatEnabled ? "Type your message..." : "Provide your feedback...") : "Respond to client feedback..."}
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          )}

          {!canProvideFeedback && (
            <div className="text-center py-4 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              Feedback can only be provided when ticket status is "Resolved" or "In Progress"
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackComponent;