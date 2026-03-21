import React, { useEffect, useState, useCallback, useMemo } from "react";
import { X, Paperclip, Download, Image as ImageIcon, FileText, Ticket, MapPin, AlertCircle, Clock, Calendar, MessageSquare, Send, User, File, CheckCircle, Circle, PlayCircle, XCircle, UserPlus, Zap, ChevronDown, Search, Filter, MessageCircle, Reply, MoreHorizontal, ThumbsUp, Edit2, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Portal } from "@headlessui/react";
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";

const SelectedTicketModal = ({ ticket, onClose, itSupportUsers = [], onUpdate }) => {
  const { fetchTickets, assignTicket } = useTicketStore();
  const { user } = useAuthenticationStore();
  const [activeTab, setActiveTab] = useState("details");
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo?._id || "");
  const [isAssigning, setIsAssigning] = useState(false);

  const canAssign = user?.role === "Manager";

  const tabs = [
    { id: "details", label: "Details", icon: Ticket },
    { id: "attachments", label: "Attachments", icon: Paperclip, count: ticket?.attachments?.length || 0 },
    { id: "comments", label: "Comments", icon: MessageSquare, count: ticket?.comments?.filter(c => !c.hidden).length || 0 },
  ];

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  if (!ticket) return null;

  const visibleComments = ticket.comments?.filter(c => !c.hidden) || [];

  // Create user profile lookup from ticket data
  const userProfileMap = React.useMemo(() => {
    const map = {};
    
    // Add ticket user (creator)
    if (ticket.user?._id && ticket.user) {
      map[ticket.user._id] = ticket.user;
    }
    
    // Add assigned user
    if (ticket.assignedTo?._id && ticket.assignedTo) {
      map[ticket.assignedTo._id] = ticket.assignedTo;
    }
    
    // Add all comment users
    ticket.comments?.forEach(comment => {
      if (comment.user?._id && comment.user) {
        map[comment.user._id] = comment.user;
      }
      // Add reply users
      comment.replies?.forEach(reply => {
        if (reply.user?._id && reply.user) {
          map[reply.user._id] = reply.user;
        }
      });
    });
    
    // Add current user from auth store
    if (user?._id && user) {
      map[user._id] = { ...map[user._id], ...user };
    }
    
    return map;
  }, [ticket, user]);

  const downloadAll = () => {
    if (!ticket.attachments?.length) return;
    ticket.attachments.forEach((attachment) => {
      const link = document.createElement("a");
      link.href = `http://localhost:5001/uploads/${attachment.filename}`;
      link.download = attachment.originalName || attachment.filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleAssign = async (userId = null, mode = 'manual') => {
    if (!canAssign) return;
    setIsAssigning(true);
    try {
      const updatedTicket = await assignTicket(ticket._id, userId, mode);
      fetchTickets();
      if (onUpdate && updatedTicket) {
        onUpdate(updatedTicket);
      }
    } catch (err) {
      console.error("Error assigning ticket:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex-shrink-0">
              <Ticket size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                Ticket #{ticket._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{ticket.issueType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {renderStatusSmall(ticket.status)}
            {renderUrgencySmall(ticket.urgency)}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Bar - Segmented control on mobile, pills on desktop */}
        <div className="flex items-center gap-1 px-2 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          {/* Mobile: Segmented control style */}
          <div className="flex w-full rounded-lg bg-gray-200 dark:bg-gray-700 p-0.5 sm:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.id ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-gray-300 dark:bg-gray-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Desktop: Horizontal scrollable pills */}
          <div className="hidden sm:flex items-center gap-1.5 w-full overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {/* User profile lookup for comments */}
          {activeTab === "comments" && (
            <CommentsTab comments={visibleComments} userProfileMap={userProfileMap} currentUserId={user?._id} />
          )}
          {activeTab === "details" && <DetailsTab ticket={ticket} canAssign={canAssign} itSupportUsers={itSupportUsers} assignedTo={assignedTo} isAssigning={isAssigning} handleAssign={handleAssign} />}
          {activeTab === "attachments" && <AttachmentsTab ticket={ticket} onDownloadAll={downloadAll} />}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailsTab = ({ ticket, canAssign, itSupportUsers, assignedTo, isAssigning, handleAssign }) => (
  <div className="space-y-4 sm:space-y-5">
    <div className="p-3.5 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={12} className="text-gray-500 dark:text-gray-400 sm:size-14" />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</p>
      </div>
      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{ticket.subject}</p>
    </div>

    <div className="p-3.5 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <FileText size={12} className="text-gray-500 dark:text-gray-400 sm:size-14" />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</p>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
    </div>

    {/* Assignment Section for Manager */}
    {canAssign && (
      <div className="p-3.5 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2.5">
          <UserPlus size={12} className="text-blue-600 dark:text-blue-400 sm:size-14" />
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Assignment</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Listbox value={assignedTo} onChange={(val) => handleAssign(val, 'manual')}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-default rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                <span className="block truncate text-gray-900 dark:text-gray-100">
                  {itSupportUsers.find(u => u._id === assignedTo)?.name || itSupportUsers.find(u => u._id === assignedTo)?.username || "Select Reviewer..."}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
              </ListboxButton>
              <Portal>
                <ListboxOptions className="absolute z-[9999] mt-1 max-h-48 w-full overflow-auto rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 py-1 shadow-xl focus:outline-none">
                  {itSupportUsers.map((reviewer) => (
                    <ListboxOption
                      key={reviewer._id}
                      value={reviewer._id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none px-3 py-2 text-sm ${active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                            {(reviewer.name || reviewer.username)?.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate">{reviewer.name || reviewer.username}</span>
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Portal>
            </div>
          </Listbox>
          <button
            onClick={() => handleAssign(null, 'auto')}
            disabled={isAssigning || ticket.assignedTo}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={12} className="text-amber-500" />
            {isAssigning ? "..." : "Auto Assign"}
          </button>
        </div>
        {ticket.assignedTo && (
          <div className="mt-2.5 flex items-center gap-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300">
              {ticket.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
              Assigned to: {ticket.assignedTo.name}
            </span>
          </div>
        )}
      </div>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
      <DetailCard icon={MapPin} label="Location" value={ticket.location} />
      <DetailCard icon={Calendar} label="Created" value={new Date(ticket.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} />
      <DetailCard icon={Clock} label="Updated" value={ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"} />
      <DetailCard icon={User} label="Created By" value={ticket.user?.name || ticket.user?.username || "Unknown"} />
      {ticket.assignedTo && (
        <DetailCard icon={User} label="Assigned To" value={ticket.assignedTo.name} />
      )}
    </div>
  </div>
);

const DetailCard = ({ icon, label, value }) => {
  const Icon = icon;
  return (
    <div className="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={11} className="text-gray-500 dark:text-gray-400 sm:size-12" />
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{value || "N/A"}</p>
    </div>
  );
};

const AttachmentsTab = ({ ticket, onDownloadAll }) => {
  const attachments = ticket.attachments || [];
  
  if (attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-14 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
          <Paperclip size={18} className="text-gray-400 sm:size-20" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No attachments</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This ticket doesn't have any files attached</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {attachments.length} {attachments.length === 1 ? "file" : "files"} attached
        </p>
        <button
          onClick={onDownloadAll}
          className="flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Download All</span>
          <span className="sm:hidden">Download</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={`http://localhost:5001/uploads/${attachment.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            download={attachment.originalName || attachment.filename}
            className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              {attachment.mimetype?.startsWith("image/") ? (
                <ImageIcon size={14} className="text-blue-600 dark:text-blue-400 sm:size-16" />
              ) : (
                <FileText size={14} className="text-blue-600 dark:text-blue-400 sm:size-16" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{attachment.originalName || attachment.filename}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{(attachment.size / 1024).toFixed(1)} KB</p>
            </div>
            <Download size={14} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors sm:size-16" />
          </a>
        ))}
      </div>
    </div>
  );
};

// Helper functions for CommentsTab
const getRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const getRoleBadgeStyles = (role) => {
  switch (role?.toLowerCase()) {
    case "manager":
    case "admin":
      return "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
    case "reviewer":
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "client":
    default:
      return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// User Avatar Component
const UserAvatar = ({ user, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  
  const sizeClass = sizes[user?.profilePhoto ? "object-cover" : size] || sizes.md;
  const containerClass = `rounded-full flex items-center justify-center font-bold ${sizes[size] || sizes.md}`;
  const gradientClass = user?.role?.toLowerCase() === "manager" || user?.role?.toLowerCase() === "admin"
    ? "bg-gradient-to-br from-purple-500 to-purple-600"
    : user?.role?.toLowerCase() === "reviewer"
      ? "bg-gradient-to-br from-blue-500 to-blue-600"
      : "bg-gradient-to-br from-green-500 to-green-600";

  if (user?.profilePhoto) {
    const photoUrl = user.profilePhoto.startsWith("http") 
      ? user.profilePhoto 
      : `${import.meta.env.VITE_API_URL}${user.profilePhoto}`;
    return (
      <img
        src={photoUrl}
        alt={user?.name || user?.username}
        className={`${containerClass} object-cover`}
      />
    );
  }

  return (
    <div className={`${containerClass} ${gradientClass} text-white`}>
      {getInitials(user?.name || user?.username || "?")}
    </div>
  );
};

// Comment Thread Component
const CommentThread = ({ comment, userProfileMap, currentUserId, onReply, onEdit, onDelete, canModerate }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  
  const commentUser = userProfileMap[comment.user?._id] || comment.user;
  const isOwnComment = commentUser?._id === currentUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isSelf = commentUser?._id === currentUserId;

  return (
    <div className="group">
      {/* Main Comment */}
      <div className={`flex gap-2.5 ${isSelf ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <UserAvatar user={commentUser} size="sm" />
        </div>
        
        {/* Content */}
        <div className={`flex-1 min-w-0 ${isSelf ? "text-right" : ""}`}>
          {/* Header */}
          <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 mb-1 ${isSelf ? "justify-end" : ""}`}>
            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate max-w-[100px] sm:max-w-[120px]">
              {commentUser?.name || commentUser?.username || "Unknown User"}
            </span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${getRoleBadgeStyles(commentUser?.role)}`}>
              {commentUser?.role || "Client"}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500" title={new Date(comment.createdAt).toLocaleString()}>
              {getRelativeTime(comment.createdAt)}
            </span>
          </div>
          
          {/* Message Bubble */}
          <div className={`max-w-[85%] p-2.5 sm:p-3 rounded-2xl ${
            isSelf 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
          }`}>
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
          </div>
          
          {/* Actions */}
          <div className={`flex items-center gap-2 sm:gap-3 mt-1 ${isSelf ? "justify-end" : ""}`}>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
            >
              <Reply size={12} />
              <span className="hidden sm:inline">Reply</span>
            </button>
            {hasReplies && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1"
              >
                {showReplies ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                <span className="hidden sm:inline">{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</span>
                <span className="sm:hidden">{comment.replies.length}</span>
              </button>
            )}
            {isOwnComment && (
              <>
                <button className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1">
                  <Edit2 size={12} />
                </button>
                <button className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1">
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
          
          {/* Reply Input */}
          {showReplyInput && (
            <div className={`mt-2 flex gap-2 ${isSelf ? "flex-row-reverse" : ""}`}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                <Send size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Replies Thread */}
      {hasReplies && showReplies && (
        <div className={`ml-3 sm:ml-4 mt-2 sm:mt-2.5 pl-3 sm:pl-4 border-l-2 ${isSelf ? "border-r-2 mr-3 sm:mr-4 ml-0 pl-0 pr-3 sm:pr-4" : "border-gray-300 dark:border-gray-600"}`}>
          {comment.replies.map((reply, rIndex) => {
            const replyUser = userProfileMap[reply.user?._id] || reply.user;
            const isReplyOwn = replyUser?._id === currentUserId;
            
            return (
              <div key={rIndex} className={`flex gap-2 mb-2 sm:mb-2.5 ${isReplyOwn ? "flex-row-reverse" : ""}`}>
                <UserAvatar user={replyUser} size="sm" />
                <div className={`flex-1 min-w-0 ${isReplyOwn ? "text-right" : ""}`}>
                  <div className={`flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mb-1 ${isReplyOwn ? "justify-end" : ""}`}>
                    <span className="font-medium text-[10px] sm:text-xs text-gray-900 dark:text-gray-100 truncate max-w-[70px] sm:max-w-[80px]">
                      {replyUser?.name || replyUser?.username || "Unknown"}
                    </span>
                    <span className={`text-[7px] sm:text-[8px] px-1 py-0.5 rounded-full font-medium border ${getRoleBadgeStyles(replyUser?.role)}`}>
                      {replyUser?.role?.[0] || "C"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {getRelativeTime(reply.createdAt)}
                    </span>
                  </div>
                  <div className={`inline-block max-w-[90%] px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl ${
                    isReplyOwn
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                  }`}>
                    <p className="text-xs leading-relaxed break-words">{reply.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CommentsTab = ({ comments, userProfileMap = {}, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const canModerate = true; // Would come from props in real implementation

  // Filter and sort comments
  const filteredComments = useMemo(() => {
    if (!comments || comments.length === 0) return [];
    
    let filtered = [...comments];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(comment => {
        const user = userProfileMap[comment.user?._id] || comment.user;
        return (
          comment.content?.toLowerCase().includes(query) ||
          user?.name?.toLowerCase().includes(query) ||
          user?.username?.toLowerCase().includes(query)
        );
      });
    }
    
    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(comment => {
        const user = userProfileMap[comment.user?._id] || comment.user;
        return user?.role?.toLowerCase() === filterRole.toLowerCase();
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [comments, searchQuery, filterRole, sortOrder, userProfileMap]);

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Be the first to add feedback on this ticket</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header with Search and Filters - Stacked on mobile, inline on desktop */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:gap-2">
        {/* Search - Full width on mobile */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
          />
        </div>
        
        {/* Mobile: Icon buttons for filters */}
        <div className="flex items-center gap-1 sm:hidden">
          {/* Role Filter as icon button */}
          <Listbox value={filterRole} onChange={setFilterRole}>
            <div className="relative">
              <ListboxButton className="flex items-center justify-center p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
                <Filter size={16} className="text-gray-500" />
              </ListboxButton>
              <Portal>
                <ListboxOptions className="absolute z-[9999] mt-1 right-0 w-36 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 shadow-xl focus:outline-none">
                  {["all", "client", "reviewer", "manager"].map((role) => (
                    <ListboxOption
                      key={role}
                      value={role}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2.5 text-sm ${active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-200"}`
                      }
                    >
                      {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Portal>
            </div>
          </Listbox>
          
          {/* Sort as icon button */}
          <Listbox value={sortOrder} onChange={setSortOrder}>
            <div className="relative">
              <ListboxButton className="flex items-center justify-center p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
                <ChevronDown size={16} className="text-gray-500" />
              </ListboxButton>
              <Portal>
                <ListboxOptions className="absolute z-[9999] mt-1 right-0 w-32 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 shadow-xl focus:outline-none">
                  {["newest", "oldest"].map((order) => (
                    <ListboxOption
                      key={order}
                      value={order}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2.5 text-sm ${active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-200"}`
                      }
                    >
                      {order === "newest" ? "Newest First" : "Oldest First"}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Portal>
            </div>
          </Listbox>
        </div>
        
        {/* Desktop: Regular dropdowns */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Role Filter */}
          <Listbox value={filterRole} onChange={setFilterRole}>
            <div className="relative">
              <ListboxButton className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 min-w-[120px]">
                <Filter size={14} className="text-gray-400" />
                <span className="truncate">
                  {filterRole === "all" ? "All Roles" : filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}
                </span>
                <ChevronDown size={14} className="text-gray-400 ml-auto" />
              </ListboxButton>
              <Portal>
                <ListboxOptions className="absolute z-[9999] mt-1 w-full min-w-[140px] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 shadow-xl focus:outline-none">
                  {["all", "client", "reviewer", "manager"].map((role) => (
                    <ListboxOption
                      key={role}
                      value={role}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 text-sm ${active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-200"}`
                      }
                    >
                      {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Portal>
            </div>
          </Listbox>
          
          {/* Sort */}
          <Listbox value={sortOrder} onChange={setSortOrder}>
            <div className="relative">
              <ListboxButton className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 min-w-[130px]">
                <span className="truncate">
                  {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                </span>
                <ChevronDown size={14} className="text-gray-400 ml-auto" />
              </ListboxButton>
              <Portal>
                <ListboxOptions className="absolute z-[9999] mt-1 w-full min-w-[130px] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-1 shadow-xl focus:outline-none">
                  {["newest", "oldest"].map((order) => (
                    <ListboxOption
                      key={order}
                      value={order}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 text-sm ${active ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-200"}`
                      }
                    >
                      {order === "newest" ? "Newest First" : "Oldest First"}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Portal>
            </div>
          </Listbox>
        </div>
      </div>

      {/* Comments Count */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <span>{filteredComments.length} {filteredComments.length === 1 ? "comment" : "comments"}</span>
        {filteredComments.length !== comments.length && (
          <span className="text-xs">Showing {filteredComments.length} of {comments.length}</span>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredComments.map((comment, index) => (
          <CommentThread
            key={comment._id || index}
            comment={comment}
            userProfileMap={userProfileMap}
            currentUserId={currentUserId}
            canModerate={canModerate}
          />
        ))}
      </div>
      
      {filteredComments.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search size={20} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No comments match your search</p>
        </div>
      )}
    </div>
  );
};

const renderUrgencySmall = (urgency) => {
  const colors = {
    Critical: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
    High: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400",
    Medium: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
    Low: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors[urgency] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
      {urgency}
    </span>
  );
};

const renderStatusSmall = (status) => {
  const colors = {
    Open: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
    "In Progress": "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400",
    Resolved: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
    Closed: "bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
      {status}
    </span>
  );
};

export default SelectedTicketModal;
