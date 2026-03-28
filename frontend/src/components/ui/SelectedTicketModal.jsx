import React, { useEffect, useState, useCallback, useMemo } from "react";
import { X, Paperclip, Download, Image as ImageIcon, FileText, Ticket, MapPin, AlertCircle, Clock, Calendar, MessageSquare, Send, User, File, CheckCircle, Circle, PlayCircle, XCircle, UserPlus, Zap, ChevronDown, Search, Filter, MessageCircle, Reply, MoreHorizontal, ThumbsUp, Edit2, Trash2, ChevronRight, ChevronLeft, Tag, ShieldCheck, Info, SearchX, FileQuestion } from "lucide-react";
import toast from "react-hot-toast";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import useTicketStore from "../../store/ticketStore";
import { useAuthenticationStore } from "../../store/authStore";

const SelectedTicketModal = ({ ticket, onClose, itSupportUsers = [], onUpdate }) => {
  const { fetchTickets, assignTicket, addReply, submitFeedback, loading } = useTicketStore();
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
            <CommentsTab 
              comments={visibleComments} 
              userProfileMap={userProfileMap} 
              currentUserId={user?._id}
              ticketId={ticket._id}
              onAddReply={addReply}
              onSubmitFeedback={submitFeedback}
              isSubmitting={loading}
              onRefresh={fetchTickets}
            />
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
  <div className="space-y-6">
    {/* Section 1: Header Meta Info */}
    <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-700/50">
      {renderStatusSmall(ticket.status)}
      {renderUrgencySmall(ticket.urgency)}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
        <Tag size={12} className="text-gray-400" />
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight">
          {ticket.issueType || "General Issue"}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-1 text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-900/20 px-2 py-1 rounded-md">
        <Info size={10} />
        ID: {ticket._id.slice(-8).toUpperCase()}
      </div>
    </div>

    {/* Section 2: Subject & Description */}
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          {ticket.subject}
        </h3>
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <Calendar size={12} />
          Reported on {new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
        </p>
      </div>

      <div className="group relative p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm transition-all hover:shadow-md">
        <div className="absolute -left-px top-4 bottom-4 w-1 bg-blue-500/50 rounded-full" />
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap pl-2">
          {ticket.description}
        </p>
      </div>
    </div>

    {/* Section 3: Key People */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Requester</span>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <UserAvatar user={ticket.user} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {ticket.user?.name || ticket.user?.username || "Anonymous User"}
            </p>
            <p className="text-[10px] text-gray-500 uppercase font-medium">
              {ticket.user?.role || "Client"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Assignee</span>
        {ticket.assignedTo ? (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/40 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 shadow-sm">
            <UserAvatar user={ticket.assignedTo} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {ticket.assignedTo.name}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-medium">
                Support Agent
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20 border border-dashed border-gray-200 dark:border-gray-700 shadow-sm italic">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <UserPlus size={18} className="text-gray-300" />
            </div>
            <p className="text-xs text-gray-400">Waiting for assignment</p>
          </div>
        )}
      </div>
    </div>

    {/* Section 4: Details Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <DetailCard 
        icon={MapPin} 
        label="Location" 
        value={ticket.location} 
        variant="subtle"
      />
      <DetailCard 
        icon={Clock} 
        label="Last Activity" 
        value={ticket.updatedAt ? getRelativeTime(ticket.updatedAt) : "N/A"} 
        variant="subtle"
      />
      <DetailCard 
        icon={ShieldCheck} 
        label="Priority Level" 
        value={ticket.urgency} 
        variant="subtle"
      />
    </div>

    {/* Section 5: Assignment Control (Manager Only) */}
    {canAssign && (
      <div className="p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-inner">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus size={14} className="text-blue-600 dark:text-blue-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Ticket Reassignment</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Listbox value={assignedTo} onChange={(val) => handleAssign(val, 'manual')}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-default rounded-xl border border-blue-200/60 dark:border-blue-700/60 bg-white dark:bg-gray-800 px-3.5 py-2.5 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm">
                <span className="block truncate text-gray-900 dark:text-gray-100">
                  {itSupportUsers.find(u => u._id === assignedTo)?.name || itSupportUsers.find(u => u._id === assignedTo)?.username || "Select Support Agent..."}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute z-[9999] mt-1 max-h-48 w-full min-w-[200px] overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 shadow-2xl focus:outline-none ring-1 ring-black/5">
                {itSupportUsers.map((reviewer) => (
                  <ListboxOption
                    key={reviewer._id}
                    value={reviewer._id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none px-4 py-2.5 text-sm transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {(reviewer.name || reviewer.username)?.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{reviewer.name || reviewer.username}</span>
                    </div>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          <button
            onClick={() => handleAssign(null, 'auto')}
            disabled={isAssigning || ticket.assignedTo}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200/60 dark:border-blue-700/60 bg-white dark:bg-gray-800 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 shadow-sm"
          >
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            {isAssigning ? "Assigning..." : "Auto Assign Agent"}
          </button>
        </div>
        {ticket.assignedTo && (
          <div className="mt-3 flex items-center gap-2.5 p-2.5 bg-blue-100/40 dark:bg-blue-900/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
            <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300">
              {ticket.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">
              Assigned to {ticket.assignedTo.name}
            </span>
          </div>
        )}
      </div>
    )}
  </div>
);

const DetailCard = ({ icon, label, value, variant = "default" }) => {
  const Icon = icon;
  return (
    <div className={`p-3 rounded-2xl border transition-all duration-200 ${
      variant === "subtle"
        ? "bg-transparent border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700"
        : "bg-gray-50/50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 shadow-sm"
    }`}>
      <div className="flex items-center gap-1.5 mb-1.5 opacity-50">
        <Icon size={12} className="text-gray-500 dark:text-gray-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
        {value || "N/A"}
      </p>
    </div>
  );
};

const AttachmentsTab = ({ ticket, onDownloadAll }) => {
  const attachments = ticket.attachments || [];
  
  if (attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
            <Paperclip size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
            <FileQuestion size={16} className="text-blue-500" />
          </div>
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">No Attachments Found</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[240px] leading-relaxed">
          This ticket doesn't have any associated files, screenshots, or documents.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-1">
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Shared Files
            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px]">
              {attachments.length}
            </span>
          </h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Documents and images attached to this ticket</p>
        </div>
        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all active:scale-95 shadow-sm"
        >
          <Download size={14} className="text-blue-500" />
          <span className="hidden sm:inline">Download All</span>
          <span className="sm:hidden">All</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((attachment, index) => {
          const isImage = attachment.mimetype?.startsWith("image/");
          return (
            <a
              key={index}
              href={`http://localhost:5001/uploads/${attachment.filename}`}
              target="_blank"
              rel="noopener noreferrer"
              download={attachment.originalName || attachment.filename}
              className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-200 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                isImage ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              }`}>
                {isImage ? <ImageIcon size={20} /> : <FileText size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {attachment.originalName || attachment.filename}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {(attachment.size / 1024).toFixed(1)} KB
                  </span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                    {attachment.filename.split('.').pop()}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <Download size={14} className="text-gray-400 group-hover:text-blue-500" />
              </div>
            </a>
          );
        })}
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
const CommentThread = ({ comment, userProfileMap, currentUserId, onReply, onEdit, onDelete, canModerate, ticketId, onAddReply, onRefresh }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const commentUser = userProfileMap[comment.user?._id] || comment.user;
  const isOwnComment = commentUser?._id === currentUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isSelf = commentUser?._id === currentUserId;

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !onAddReply) return;
    setIsSubmitting(true);
    try {
      await onAddReply(ticketId, comment._id, replyText.trim());
      toast.success("Reply sent");
      setReplyText("");
      setShowReplyInput(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error submitting reply:", err);
      toast.error(err.response?.data?.message || "Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
              />
              <button 
                onClick={handleSubmitReply}
                disabled={isSubmitting || !replyText.trim()}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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

const CommentsTab = ({ comments, userProfileMap = {}, currentUserId, ticketId, onAddReply, onSubmitFeedback, isSubmitting, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [newMessage, setNewMessage] = useState("");
  
  const canModerate = true;

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      if (!comments?.length) {
        await onSubmitFeedback(ticketId, newMessage.trim());
        toast.success("Feedback submitted");
      } else {
        const latestComment = comments[comments.length - 1];
        await onAddReply(ticketId, latestComment._id, newMessage.trim());
        toast.success("Reply sent");
      }
      setNewMessage("");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.response?.data?.message || "Failed to send message");
    }
  };

  const filteredComments = useMemo(() => {
    if (!comments || comments.length === 0) return [];
    let filtered = [...comments];
    
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
    
    if (filterRole !== "all") {
      filtered = filtered.filter(comment => {
        const user = userProfileMap[comment.user?._id] || comment.user;
        return user?.role?.toLowerCase() === filterRole.toLowerCase();
      });
    }
    
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  }, [comments, searchQuery, filterRole, sortOrder, userProfileMap]);

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700">
            <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white dark:border-gray-800">
            <Zap size={14} className="text-white fill-white" />
          </div>
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">Start the Conversation</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed mb-8">
          Have more details or questions about this ticket? Add the first comment below.
        </p>
        
        <div className="w-full max-w-sm relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full pl-4 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSubmitting}
            className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter conversation..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all text-sm placeholder:text-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Listbox value={filterRole} onChange={setFilterRole}>
            <div className="relative">
              <ListboxButton className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-50">
                <Filter size={14} className="text-blue-500" />
                <span className="hidden sm:inline">{filterRole === "all" ? "All Roles" : filterRole}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </ListboxButton>
              <ListboxOptions className="absolute z-[9999] mt-1 w-36 overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 shadow-xl focus:outline-none ring-1 ring-black/5">
                {["all", "client", "reviewer", "manager"].map((role) => (
                  <ListboxOption
                    key={role}
                    value={role}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 text-xs font-medium ${active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`
                    }
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          
          <Listbox value={sortOrder} onChange={setSortOrder}>
            <div className="relative">
              <ListboxButton className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-50">
                <Clock size={14} className="text-blue-500" />
                <span className="hidden sm:inline">{sortOrder === "newest" ? "Latest" : "Oldest"}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </ListboxButton>
              <ListboxOptions className="absolute z-[9999] mt-1 w-32 overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 shadow-xl focus:outline-none ring-1 ring-black/5">
                {["newest", "oldest"].map((order) => (
                  <ListboxOption
                    key={order}
                    value={order}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-2 text-xs font-medium ${active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`
                    }
                  >
                    {order === "newest" ? "Newest First" : "Oldest First"}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>

      <div className="flex-1 space-y-6 min-h-[200px] max-h-[400px] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment, index) => (
            <CommentThread
              key={comment._id || index}
              comment={comment}
              userProfileMap={userProfileMap}
              currentUserId={currentUserId}
              canModerate={canModerate}
              ticketId={ticketId}
              onAddReply={onAddReply}
              onRefresh={onRefresh}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <SearchX size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No comments match your filters</p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-end gap-2 p-2 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-inner focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            rows={1}
            className="flex-1 px-3 py-2 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 resize-none outline-none max-h-32"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSubmitting}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-blue-600/20"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
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
