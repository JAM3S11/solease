import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  MessageSquare, 
  Search, 
  Calendar, 
  Trash2, 
  ArrowRight,
  Plus,
  Clock,
  Sparkles
} from "lucide-react";
import DashboardLayout from "../components/ui/DashboardLayout";
import { useAuthenticationStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const AiChatHistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const userRole = user?.role?.toUpperCase();
  const basePath = userRole === "MANAGER" || userRole === "ADMIN" 
    ? "/admin-dashboard" 
    : userRole === "REVIEWER" 
      ? "/reviewer-dashboard" 
      : "/client-dashboard";

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;
      
      try {
        const response = await fetch(`http://localhost:5001/sol/ai/sessions?userId=${userId}`);
        const data = await response.json();
        setSessions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id || user?._id) {
      fetchSessions();
    }
  }, [user]);

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    setDeleteLoading(sessionId);
    
    try {
      await fetch(`http://localhost:5001/sol/ai/session/${sessionId}`, { method: "DELETE" });
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      session.title?.toLowerCase().includes(query) ||
      session.snippet?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                AI Conversation History
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                View and manage your AI Assistant conversations
              </p>
            </div>
            <Link
              to={`${basePath}/ai-chat`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-500/25 font-medium"
            >
              <Plus size={18} />
              New Chat
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-500">Loading conversations...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Bot size={32} className="text-purple-500 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {searchTerm ? "No conversations found" : "No conversation history yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? "Try a different search term" 
                : "Start your first conversation with the AI Assistant to see it here."}
            </p>
            <Link
              to={`${basePath}/ai-chat`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
            >
              <Sparkles size={18} />
              Start New Chat
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-2 py-1 mb-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredSessions.length} conversation{filteredSessions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div
                  onClick={() => navigate(`${basePath}/ai-chat/${session.id}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition-all cursor-pointer"
                >
                  {/* Icon */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/20 flex-shrink-0">
                    <Sparkles size={20} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {session.title || "New Chat"}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-[10px] font-medium">
                        <MessageSquare size={10} />
                        {session.messages?.length || session.messageCount || 0}
                      </span>
                    </div>
                    {session.snippet && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                        {session.snippet}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(session.updatedAt || session.createdAt || session.created_at)}
                      </span>
                      {session.updatedAt && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`${basePath}/ai-chat/${session.id}`}
                      className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                    >
                      <ArrowRight size={18} />
                    </Link>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      disabled={deleteLoading === session.id}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    >
                      {deleteLoading === session.id ? (
                        <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AiChatHistoryPage;