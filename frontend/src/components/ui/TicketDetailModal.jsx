import React, { useState } from "react";
import { X, ChevronDown, Ticket, MapPin, Calendar, AlertCircle, Clock, Check, FileText, Bot, User, MessageCircle, UserPlus, Zap, Info, Tag, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { useNavigate } from "react-router-dom";

const TicketDetailModal = ({ ticket, onClose, itSupportUsers = [], onUpdate }) => {
  const { user } = useAuthenticationStore();
  const { updateTicket, assignTicket } = useNavigate ? useTicketStore() : { updateTicket: () => {}, assignTicket: () => {} };
  const navigate = useNavigate ? useNavigate() : () => {};

  const [status, setStatus] = useState(ticket?.status || "");
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo?._id || "");
  const [isAssigning, setIsAssigning] = useState(false);

  if (!ticket) return null;

  const userRole = user?.role?.toUpperCase();
  const canUpdateStatus = ["MANAGER", "REVIEWER"].includes(userRole);
  const canAssign = userRole === "MANAGER";

  const handleUpdate = async () => {
    try {
      const updateData = {};
      if (canUpdateStatus && status && status !== ticket.status) {
        updateData.status = status;
      }

      if (Object.keys(updateData).length > 0) {
        await updateTicket(ticket._id, updateData);
      }
      
      onClose();
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  const handleAssign = async (userId = null, mode = 'manual') => {
    if (!canAssign) return;
    
    setIsAssigning(true);
    try {
      const updatedTicket = await assignTicket(ticket._id, userId, mode);
      if (onUpdate && updatedTicket) {
        onUpdate(updatedTicket);
      }
      onClose();
    } catch (err) {
      console.error("Error assigning ticket:", err);
    } finally {
      setIsAssigning(false);
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

  const UserAvatar = ({ user, size = "md" }) => {
    const sizes = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    };
    
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-6">
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

          {/* Automation Info */}
          {ticket.isAutomated && (
            <div className="p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} className="text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Automation Details
                </p>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This ticket was {ticket.resolutionMethod === "Auto" ? "automatically" : "manually"} resolved
                {ticket.autoResolvedAt && ` on ${new Date(ticket.autoResolvedAt).toLocaleDateString()}`}
              </p>
            </div>
          )}

          {/* Attachments */}
          {ticket.attachments?.length > 0 && (
            <AttachmentsSection attachments={ticket.attachments} />
          )}

          {/* Role-specific Actions (Assign Ticket) */}
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

          {/* Role-specific Actions (Update Status) */}
          {canUpdateStatus && (
            <div className="p-4 bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-purple-600 dark:text-purple-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Update Status</p>
              </div>
              <Listbox value={status} onChange={setStatus}>
                <div className="relative">
                  <ListboxButton className="relative w-full cursor-default rounded-xl border border-purple-200/60 dark:border-purple-700/60 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all shadow-sm">
                    <span className="block truncate text-gray-900 dark:text-gray-100">{status}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <ListboxOptions className="absolute z-[9999] mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 shadow-2xl focus:outline-none ring-1 ring-black/5">
                    {["Open", "In Progress", "Resolved", "Closed"].map((option) => (
                      <ListboxOption
                        key={option}
                        value={option}
                        className={({ active }) =>
                          `relative cursor-pointer select-none px-4 py-3 text-sm transition-colors ${active ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300"}`
                        }
                      >
                        {({ selected }) => (
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selected && <Check size={14} className="text-purple-600 dark:text-purple-400" />}
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
          {(ticket.status === 'Resolved' || ticket.status === 'In Progress') && (
            <button
              onClick={() => {
                const role = user?.role?.toUpperCase();
                onClose();
                if (role === 'CLIENT') {
                  navigate(`/client-dashboard/ticket/${ticket._id}/feedback`);
                } else if (role === 'REVIEWER') {
                  navigate(`/reviewer-dashboard/ticket/${ticket._id}/feedback`);
                } else if (role === 'MANAGER') {
                  navigate(`/client-dashboard/ticket/${ticket._id}/feedback`);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center gap-2 text-sm"
            >
              <MessageCircle size={16} />
              {ticket.chatEnabled ? 'Open Chat' : 'Provide Feedback'}
            </button>
          )}
          
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
            {canUpdateStatus && (
              <button
                onClick={handleUpdate}
                disabled={status === ticket.status}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 text-sm"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const AttachmentsSection = ({ attachments }) => {
  const downloadAll = () => {
    attachments.forEach((attachment) => {
      const link = document.createElement("a");
      link.href = `http://localhost:5001/uploads/${attachment.filename}`;
      link.download = attachment.originalName || attachment.filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const isImage = attachments[0]?.mimetype?.startsWith("image/");

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
          onClick={downloadAll}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all active:scale-95 shadow-sm"
        >
          <span className="hidden sm:inline">Download All</span>
          <span className="sm:hidden">All</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((attachment, index) => {
          const isImageFile = attachment.mimetype?.startsWith("image/");
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
                isImageFile ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              }`}>
                {isImageFile ? <ImageIcon size={20} /> : <FileText size={20} />}
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
            </a>
          );
        })}
      </div>
    </div>
  );
};

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

export default TicketDetailModal;
