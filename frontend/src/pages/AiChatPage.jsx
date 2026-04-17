import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  User, 
  Loader2, 
  X, 
  Sparkles,
  AlertCircle,
  MessageSquare,
  Trash2,
  Plus,
  Menu,
  Search,
  Clock,
  Image as ImageIcon,
  Paperclip
} from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import useTicketStore from "../store/ticketStore";
import { cn } from "../lib/utils";
import DashboardLayout from "../components/ui/DashboardLayout";

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB

async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 1024;
        const maxHeight = 1024;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = compressed.split(',')[1];
        
        resolve({
          base64,
          mimeType: 'image/jpeg',
          filename: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
          preview: compressed
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const fileInputRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchTickets();
    if (user?.id || user?._id) {
      fetchSessions();
    }
  }, [fetchTickets, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchFocused(true);
      }
      if (e.key === "Escape" && isSearchFocused) {
        setIsSearchFocused(false);
        setSearchQuery("");
      }
      if (isSearchFocused && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
        const results = searchQuery.trim() === "" ? sessions : searchResults;
        if (results.length === 0) return;
        
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedSearchIndex(prev => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedSearchIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const selected = results[selectedSearchIndex];
          if (selected) {
            loadSession(selected.id);
            setIsSearchFocused(false);
            setSearchQuery("");
            setSelectedSearchIndex(0);
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchFocused, searchQuery, searchResults, sessions, selectedSearchIndex]);

  const searchSessions = async (query) => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5001/sol/ai/search?userId=${userId}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching sessions:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (isSearchFocused) {
      const userId = user?.id || user?._id;
      if (userId) {
        searchSessions(searchQuery);
      }
    }
  }, [searchQuery, isSearchFocused]);

  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [searchQuery, sessions, searchResults]);

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
          images: msg.images ? msg.images.map(img => ({
            ...img,
            preview: `data:${img.mimeType};base64,${img.base64}`
          })) : null,
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

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - uploadedImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image ${file.name} is too large. Maximum size is 30MB.`);
        continue;
      }

      try {
        const compressedImage = await compressImage(file);
        setUploadedImages(prev => [...prev, compressedImage]);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert(`Failed to process image: ${file.name}`);
      }
    }

    e.target.value = '';
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
        content: `Hello${user?.name ? `, ${user.name}` : ''}! 👋\n\nI'm your SolEase AI Assistant. I can help you with:\n\n• **Platform Questions** - Anything about SOLEASE features and how to use them\n• **Troubleshooting** - Step-by-step help with technical issues\n• **Ticket Context** - Information about your current tickets\n• **General Help** - Any problem or question you have\n• **Image Analysis** - Upload screenshots, photos, or documents for OCR and analysis\n\nYour chats are automatically saved - click the menu icon to see previous conversations.`,
        timestamp: new Date()
      }
    ]);
    setCurrentSessionId(null);
    setUploadedImages([]);
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
    if ((!input.trim() && uploadedImages.length === 0) || isLoading) return;

    const userId = user?.id || user?._id;
    if (!userId) {
      alert("Please log in to use AI Assistant");
      return;
    }

    console.log("=== SENDING MESSAGE ===");
    console.log("Input:", input.trim());
    console.log("Uploaded images count:", uploadedImages.length);
    if (uploadedImages.length > 0) {
      console.log("First image mimeType:", uploadedImages[0].mimeType);
      console.log("First image base64 length:", uploadedImages[0].base64?.length);
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim() || "Please analyze the uploaded image(s) and provide insights.",
      images: uploadedImages.length > 0 ? [...uploadedImages] : null,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setUploadedImages([]);
    setIsLoading(true);

    try {
      const imagesToSend = userMessage.images ? userMessage.images.map(img => ({
        base64: img.base64,
        mimeType: img.mimeType,
        filename: img.filename
      })) : [];

      console.log("Images to send:", imagesToSend.length);
      console.log("First image to send:", imagesToSend[0]?.mimeType, imagesToSend[0]?.base64?.substring(0, 50));

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
          userId,
          images: imagesToSend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

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
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: error.message || "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
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
      <div className="flex h-full min-h-[calc(100vh-8rem)] bg-background text-foreground">
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed lg:relative z-50 h-full w-[280px] sm:w-72 bg-card border-r border-border flex flex-col"
              >
                <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between gap-2">
                  <button
                    onClick={startNewChat}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg sm:rounded-xl hover:bg-primary/90 transition-all text-xs sm:text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden xs:inline">New Chat</span>
                    <span className="xs:hidden">New</span>
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-all lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Sidebar Search */}
                <div className="p-2 sm:p-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim()) {
                          searchSessions(e.target.value);
                        }
                      }}
                      placeholder="Search chats..."
                      className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 sm:space-y-2">
                  <h3 className="text-[10px] sm:text-xs font-medium text-muted-foreground px-2 mb-2 uppercase tracking-wide">
                    {searchQuery.trim() ? "Search Results" : "Recent Chats"}
                  </h3>
                  {(searchQuery.trim() ? searchResults : sessions).length === 0 ? (
                    <p className="text-xs text-muted-foreground px-2">
                      {searchQuery.trim() ? "No results found" : "No previous chats"}
                    </p>
                  ) : (
                    (searchQuery.trim() ? searchResults : sessions).map((session) => (
                      <div
                        key={session.id}
                        onClick={() => {
                          loadSession(session.id);
                          setIsSidebarOpen(false);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "group flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all",
                          currentSessionId === session.id 
                            ? "bg-accent" 
                            : "hover:bg-accent/50"
                        )}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm truncate block">{session.title}</span>
                            {session.snippet && (
                              <p className="text-[10px] text-muted-foreground truncate">{session.snippet}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => deleteSession(e, session.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded-lg transition-all flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 px-2 sm:px-4 md:px-6 py-2 sm:py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 sm:p-2 hover:bg-accent rounded-lg transition-all flex-shrink-0"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-lg font-semibold text-foreground truncate">AI Assistant</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Powered by Gemini</p>
            </div>
            <button
              onClick={() => setIsSearchFocused(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all flex-shrink-0 border border-border/50"
            >
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded hidden sm:inline">⌘K</span>
            </button>
          </div>

          {/* Search Overlay - ChatGPT Style */}
          <AnimatePresence>
            {isSearchFocused && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50"
                  onClick={() => {
                    setIsSearchFocused(false);
                    setSearchQuery("");
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] max-h-[80vh] bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-muted-foreground" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          setIsSearchFocused(false);
                          setSearchQuery("");
                        }}
                        className="p-1 hover:bg-accent rounded transition-all"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {searchQuery.trim() === "" ? (
                      <div className="p-4">
                        <p className="text-xs font-medium text-muted-foreground mb-3">Recent</p>
                        {sessions.slice(0, 8).map((session, index) => (
                          <div
                            key={session.id}
                            onClick={() => {
                              loadSession(session.id);
                              setIsSearchFocused(false);
                              setSearchQuery("");
                              setSelectedSearchIndex(0);
                            }}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                              index === selectedSearchIndex 
                                ? "bg-primary/10 border border-primary/30" 
                                : "hover:bg-accent"
                            )}
                          >
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-sm text-foreground truncate block">{session.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(session.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                        {sessions.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-8">No recent conversations</p>
                        )}
                      </div>
                    ) : (
                      searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((result, index) => (
                            <div
                              key={result.id}
                              onClick={() => {
                                loadSession(result.id);
                                setIsSearchFocused(false);
                                setSearchQuery("");
                                setSelectedSearchIndex(0);
                              }}
                              className={cn(
                                "p-3 cursor-pointer rounded-lg transition-all",
                                index === selectedSearchIndex 
                                  ? "bg-primary/10 border border-primary/30" 
                                  : "hover:bg-accent"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground truncate">{result.title}</span>
                              </div>
                              {result.snippet && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 ml-7">{result.snippet}</p>
                              )}
                              {result.messageMatches > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-1 ml-7">
                                  {result.messageMatches} matching message{result.messageMatches > 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-sm text-muted-foreground">No results found</p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="p-2 border-t border-border bg-muted/30">
                    <p className="text-[10px] text-muted-foreground text-center">
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-0.5">↑</kbd>
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-0.5">↓</kbd>
                      to navigate
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-0.5">↵</kbd>
                      to select
                      <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-0.5">esc</kbd>
                      to close
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 sm:gap-4",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                    message.role === "assistant" 
                      ? "bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-purple-500/20" 
                      : "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20"
                  )}>
                    {message.role === "assistant" ? (
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={cn(
                    "flex-1 min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[640px]",
                    message.role === "user" ? "items-end" : "items-start"
                  )}>
                    {/* Name Label */}
                    {message.role === "assistant" && (
                      <span className="text-[11px] sm:text-xs font-medium text-violet-600 dark:text-violet-400 mb-1 ml-1 block">
                        SolEase AI
                      </span>
                    )}
                    <div className={cn(
                      "px-4 py-3 sm:py-3.5 rounded-2xl shadow-sm",
                      message.role === "user" 
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md" 
                        : message.isError
                          ? "bg-destructive/10 border border-destructive/20 text-destructive"
                          : "bg-card dark:bg-slate-800 border border-border/50 dark:border-slate-700 text-foreground dark:text-slate-100 rounded-bl-md"
                    )}>
                      {message.isError && (
                        <div className="flex items-center gap-2 mb-2 text-destructive">
                          <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="text-[10px] sm:text-xs font-medium">Connection Issue</span>
                        </div>
                      )}
                      {/* Images Display - ChatGPT Style */}
                      {message.images && message.images.length > 0 && (
                        <div className="mb-3">
                          {message.images.length === 1 ? (
                            <div className="relative rounded-xl overflow-hidden border border-border/30 max-w-sm">
                              <img 
                                src={message.images[0].preview || `data:${message.images[0].mimeType};base64,${message.images[0].base64}`} 
                                alt="Uploaded image"
                                className="w-full max-h-80 object-contain bg-background"
                              />
                            </div>
                          ) : (
                            <div className={cn(
                              "grid gap-1.5",
                              message.images.length === 2 && "grid-cols-2",
                              message.images.length === 3 && "grid-cols-2",
                              message.images.length >= 4 && "grid-cols-2"
                            )}>
                              {message.images.map((img, idx) => (
                                <div key={idx} className="relative rounded-lg overflow-hidden border border-border/30 bg-background">
                                  <img 
                                    src={img.preview || `data:${img.mimeType};base64,${img.base64}`} 
                                    alt={`Upload ${idx + 1}`}
                                    className="w-full h-40 object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-[12px] sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div className={cn(
                        "text-[10px] mt-2 opacity-60",
                        message.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
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
                className="flex gap-3 sm:gap-4"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[75%] lg:max-w-[640px]">
                  <span className="text-[11px] sm:text-xs font-medium text-violet-600 dark:text-violet-400 mb-1 ml-1 block">
                    SolEase AI
                  </span>
                  <div className="px-4 py-3 sm:py-3.5 rounded-2xl rounded-bl-md bg-card dark:bg-slate-800 border border-border/50 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span className="text-[12px] sm:text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 sm:p-3 md:p-4 border-t border-border/50 bg-card/50">
            <div className="max-w-4xl mx-auto">
              {/* Image Previews - ChatGPT Style */}
              {uploadedImages.length > 0 && (
                <div className="mb-3 relative">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {uploadedImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="relative flex-shrink-0 group"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-background">
                          <img 
                            src={img.preview} 
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive/90 hover:bg-destructive text-white rounded-full flex items-center justify-center transition-all shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                      </div>
                    ))}
                    {uploadedImages.length < MAX_IMAGES && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-accent/30 flex items-center justify-center transition-all"
                      >
                        <Plus className="w-5 h-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              
              {/* Chat Input - ChatGPT/Gemini Style */}
              <div className="relative flex items-end gap-2 bg-background border border-input rounded-2xl focus-within:ring-2 focus-within:ring-ring/30 focus-within:border-ring transition-all">
                {/* Attachment Button with Menu */}
                <div className="relative" ref={attachmentMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    disabled={uploadedImages.length >= MAX_IMAGES || isLoading}
                    className="m-2 p-2 rounded-xl hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Attach files"
                  >
                    <Plus className={cn(
                      "w-5 h-5 transition-transform",
                      showAttachmentMenu && "rotate-45",
                      uploadedImages.length >= MAX_IMAGES && "text-muted-foreground/50"
                    )} />
                  </button>
                  
                  {/* Attachment Menu Dropdown */}
                  <AnimatePresence>
                    {showAttachmentMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 mb-2 w-56 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
                      >
                        <div className="p-1">
                          <button
                            onClick={() => {
                              fileInputRef.current?.click();
                              setShowAttachmentMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent rounded-lg transition-colors text-left"
                            disabled={uploadedImages.length >= MAX_IMAGES}
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium">Upload Image</span>
                              <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF</p>
                            </div>
                          </button>
                          <button
                            onClick={() => setShowAttachmentMenu(false)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent rounded-lg transition-colors text-left opacity-50 cursor-not-allowed"
                            disabled
                          >
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <Paperclip className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium">Upload Document</span>
                              <p className="text-xs text-muted-foreground">Coming soon</p>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Text Input */}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] max-h-32 py-3 px-2 bg-transparent text-foreground placeholder:text-muted-foreground text-sm resize-none focus:outline-none disabled:opacity-50"
                  rows={1}
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={(!input.trim() && uploadedImages.length === 0) || isLoading}
                  className="m-1 p-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-primary-foreground" />
                  )}
                </button>
              </div>
              
              <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-2 text-center">
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