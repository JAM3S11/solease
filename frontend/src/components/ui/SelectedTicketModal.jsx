import React, { useEffect, useState, useCallback } from "react";
import { X, Paperclip, Download, Image as ImageIcon, FileText, Ticket, MapPin, AlertCircle, Clock, Calendar, MessageSquare, Send, User, File, CheckCircle, Circle, PlayCircle, XCircle, UserPlus, Zap, ChevronDown } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
              <Ticket size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Ticket #{ticket._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.issueType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {renderStatusSmall(ticket.status)}
            {renderUrgencySmall(ticket.urgency)}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && <DetailsTab ticket={ticket} canAssign={canAssign} itSupportUsers={itSupportUsers} assignedTo={assignedTo} isAssigning={isAssigning} handleAssign={handleAssign} />}
          {activeTab === "attachments" && <AttachmentsTab ticket={ticket} onDownloadAll={downloadAll} />}
          {activeTab === "comments" && <CommentsTab comments={visibleComments} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
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
    <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-gray-500 dark:text-gray-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</p>
      </div>
      <p className="text-lg font-semibold text-gray-900 dark:text-white">{ticket.subject}</p>
    </div>

    <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={16} className="text-gray-500 dark:text-gray-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</p>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
    </div>

    {/* Assignment Section for Manager */}
    {canAssign && (
      <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus size={16} className="text-blue-600 dark:text-blue-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Assignment</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Listbox value={assignedTo} onChange={(val) => handleAssign(val, 'manual')}>
            <div className="relative">
              <ListboxButton className="relative w-full cursor-default rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 px-3 py-2 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                <span className="block truncate text-gray-900 dark:text-gray-100">
                  {itSupportUsers.find(u => u._id === assignedTo)?.name || itSupportUsers.find(u => u._id === assignedTo)?.username || "Select Reviewer..."}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
              </ListboxButton>
              <ListboxOptions className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 py-1 shadow-lg focus:outline-none">
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
                        <span>{reviewer.name || reviewer.username}</span>
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          <button
            onClick={() => handleAssign(null, 'auto')}
            disabled={isAssigning || ticket.assignedTo}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={16} className="text-amber-500" />
            {isAssigning ? "..." : "Auto Assign"}
          </button>
        </div>
        {ticket.assignedTo && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
              {ticket.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Assigned to: {ticket.assignedTo.name}
            </span>
          </div>
        )}
      </div>
    )}

    <div className="grid grid-cols-2 gap-4">
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
    <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-gray-500 dark:text-gray-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{value || "N/A"}</p>
    </div>
  );
};

const AttachmentsTab = ({ ticket, onDownloadAll }) => {
  const attachments = ticket.attachments || [];
  
  if (attachments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Paperclip size={28} className="text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No attachments</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This ticket doesn't have any files attached</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {attachments.length} {attachments.length === 1 ? "file" : "files"} attached
        </p>
        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={16} />
          Download All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((attachment, index) => (
          <a
            key={index}
            href={`http://localhost:5001/uploads/${attachment.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            download={attachment.originalName || attachment.filename}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              {attachment.mimetype?.startsWith("image/") ? (
                <ImageIcon size={22} className="text-blue-600 dark:text-blue-400" />
              ) : (
                <FileText size={22} className="text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{attachment.originalName || attachment.filename}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{(attachment.size / 1024).toFixed(1)} KB</p>
            </div>
            <Download size={18} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};

const CommentsTab = ({ comments }) => {
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
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={index} className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{comment.user?.username?.charAt(0).toUpperCase() || "?"}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {comment.user?.name || comment.user?.username || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-13">{comment.content}</p>
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-gray-300 dark:border-gray-600 space-y-3">
              {comment.replies.map((reply, rIndex) => (
                <div key={rIndex} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {reply.user?.name || reply.user?.username || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400">replied</span>
                    <span className="text-xs text-gray-400">
                      {new Date(reply.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
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
