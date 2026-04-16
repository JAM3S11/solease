import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  X, 
  Sparkles,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Trash2,
  Plus,
  ChevronLeft,
  Menu
} from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import useTicketStore from "../store/ticketStore";
import { cn } from "../lib/utils";
import DashboardLayout from "../components/ui/DashboardLayout";

const AiChatContent = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const { tickets, fetchTickets } = useTicketStore();
  
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `Hello${user?.name ? `, ${user.name}` : ''}! 👋\n\nI'm your SolEase AI Assistant. I can help you with:\n\n• **Platform Questions** - Anything about SOLEASE features and how to use them\n• **Troubleshooting** - Step-by-step help with technical issues\n• **Ticket Context** - Information about your current tickets\n\nHow can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTickets();
    if (user?.id || user?._id) {
      fetchSessions();
    }
  }, [fetchTickets, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:5001/sol/ai/session/${sessionId}`);
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        const formattedMessages = data.messages.map((msg, idx) => ({
          id: idx,
          role: msg.role === "ASSISTANT" ? "assistant" : "user",
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
        setCurrentSessionId(sessionId);
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const deleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await fetch(`http://localhost:5001/sol/ai/session/${sessionId}`, { method: "DELETE" });
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        startNewChat();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: `Hello${user?.name ? `, ${user.name}` : ''}! 👋\n\nI'm your SolEase AI Assistant. I can help you with:\n\n• **Platform Questions** - Anything about SOLEASE features and how to use them\n• **Troubleshooting** - Step-by-step help with technical issues\n• **Ticket Context** - Information about your current tickets\n• **General Help** - Any problem or question you have\n\nYour chats are automatically saved - click the menu icon to see previous conversations.`,
        timestamp: new Date()
      }
    ]);
    setCurrentSessionId(null);
  };

  const getUserRole = () => {
    if (!user) return "Client";
    if (user.role === "Manager" || user.role === "Admin") return "Manager";
    if (user.role === "Reviewer") return "Reviewer";
    return "Client";
  };

  const getTicketContext = () => {
    if (!user || !tickets || tickets.length === 0) return null;
    
    const openTickets = tickets.filter(t => t.status !== "Closed");
    if (openTickets.length === 0) return null;
    
    const latestTicket = openTickets[0];
    return {
      ticketId: latestTicket._id,
      subject: latestTicket.subject,
      status: latestTicket.status,
      priority: latestTicket.priority,
      description: latestTicket.description,
      issueType: latestTicket.issueType
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userId = user?.id || user?._id;
    if (!userId) {
      alert("Please log in to use AI Assistant");
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/sol/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          ticketContext: getTicketContext(),
          userRole: getUserRole(),
          userName: user?.name || "User",
          sessionId: currentSessionId || null,
          userId
        }),
      });

      const data = await response.json();
      console.log("Chat response:", data);

      if (data.response) {
        const assistantMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (data.sessionId) {
          setCurrentSessionId(data.sessionId);
          fetchSessions();
        }
      } else {
        throw new Error("No response");
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    startNewChat();
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-background text-foreground">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-72 bg-card border-r border-border flex flex-col"
            >
              <div className="p-4 border-b border-border">
                <button
                  onClick={startNewChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground px-2 mb-2">Recent Chats</h3>
                {sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-2">No previous chats</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session.id)}
                      className={cn(
                        "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all",
                        currentSessionId === session.id 
                          ? "bg-accent" 
                          : "hover:bg-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{session.title}</span>
                      </div>
                      <button
                        onClick={(e) => deleteSession(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-accent rounded-lg transition-all lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-accent rounded-lg transition-all hidden lg:block"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
                <p className="text-xs text-muted-foreground">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-4xl mx-auto",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "assistant" 
                      ? "bg-gradient-to-br from-blue-500 to-cyan-400" 
                      : "bg-accent"
                  )}>
                    {message.role === "assistant" ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={cn(
                    "flex-1 px-4 py-3 rounded-2xl",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : message.isError
                        ? "bg-destructive/10 border border-destructive/20 text-destructive"
                        : "bg-card border border-border text-foreground"
                  )}>
                    {message.isError && (
                      <div className="flex items-center gap-2 mb-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Connection Issue</span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className={cn(
                      "text-[10px] mt-2",
                      message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                    )}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-4xl mx-auto"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border border-border px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-card/50">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about SOLEASE..."
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] max-h-32 px-4 py-3 bg-background border border-input rounded-2xl text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50 transition-all disabled:opacity-50"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-primary-foreground" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                AI may make mistakes. For urgent issues, create a support ticket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const AiChatPage = () => {
  return <AiChatContent />;
};

export default AiChatPage;