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
    if (!tickets.length) fetchTickets();
  }, [fetchTickets, tickets.length]);

  const ticket = tickets.find(t => t._id === id);

  // This checks if the user can provide a feedback
  const canProvideFeedback = ticket && 
    (ticket.status === 'Resolved' || ticket.status === 'In Progress');

  // This checks if the user can moderate (Reviewer/Manager roles)
  const canModerate = ['Reviewer', 'Manager'].includes(user?.role);

  const handleSubmitMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (!ticket.comments || ticket.comments.length === 0) {
        // First message - submit as feedback
        await submitFeedback(id, newMessage);
        toast.success('Feedback submitted successfully');
      } else {
        // Subsequent messages - add as reply to first comment
        await addReply(id, ticket.comments[0]._id, newMessage);
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
    setModerating(commentId);
    try {
      await unhideFeedback(id, commentId);
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
      await managerIntervention(id, ticket.comments[0]?._id, interventionContent);
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

  // Count messages per user for chat conversion logic
  const relevantMessages = ticket.comments?.filter(c => ['Client', 'Reviewer', 'Manager'].includes(c.user?.role)) || [];
  const chatEnabled = relevantMessages.length >= 4;

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
                {chatEnabled ? 'Real-time conversation enabled' : 'Provide feedback on this ticket'}
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
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    comment.hidden ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-600' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">{comment.user?.username || 'Unknown'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({comment.user?.role || 'User'})</span>
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
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(comment.createdAt || Date.now()).toLocaleString()}
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 pl-4 border-l border-gray-300 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Replies:</p>
                          {comment.replies.map((reply, rIdx) => (
                            <div key={rIdx} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded border">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{reply.user?.username || 'Unknown'}:</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({reply.user?.role || 'User'})
                                </span>
                                {reply.aiGenerated && (
                                  <span className="px-1 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase rounded">
                                    AI
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">{reply.content}</p>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(reply.createdAt || Date.now()).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Moderation Actions */}
                    {canModerate && (
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
                                const code = prompt('Enter unhide code:');
                                if (code) handleHide(comment._id, code);
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
                              const code = prompt('Enter hide code:');
                              if (code) handleHide(comment._id, code);
                            }}
                            disabled={moderating === comment._id}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded disabled:opacity-50"
                            title="Hide Comment"
                          >
                            <EyeOff size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No {chatEnabled ? 'messages' : 'feedback'} yet. {canProvideFeedback ? 'Start the conversation!' : 'Waiting for feedback...'}</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          {canProvideFeedback && (
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={chatEnabled ? "Type your message..." : "Provide your feedback..."}
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