import React, { useEffect } from "react";
import { X, Paperclip, Download, Image as ImageIcon, FileText, Ticket, MapPin, AlertCircle, Clock, Calendar, Tag, ExternalLink } from "lucide-react";
import useTicketStore from "../../store/ticketStore";

const SelectedTicketModal = ({ ticket, onClose }) => {
  const { fetchTickets } = useTicketStore();

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets()
    }, 10000) // Fetch every 10 seconds
    return () => clearInterval(interval)
  }, [fetchTickets])

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Ticket size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Ticket #{ticket._id.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ticket.issueType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Subject */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Subject</p>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {ticket.subject}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Description</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailSection
              icon={MapPin}
              label="Location"
              value={ticket.location}
            />
            <DetailSection
              icon={AlertCircle}
              label="Urgency"
              value={ticket.urgency}
              render={renderUrgency}
            />
            <DetailSection
              icon={Clock}
              label="Status"
              value={ticket.status}
              render={renderStatus}
            />
            <DetailSection
              icon={Calendar}
              label="Created At"
              value={new Date(ticket.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
          </div>

           {/* Attachments */}
           {ticket.attachments && ticket.attachments.length > 0 && (
             <div className="space-y-3">
               <div className="flex items-center gap-2">
                 <Paperclip size={16} className="text-gray-500 dark:text-gray-400" />
                 <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                   Attachments ({ticket.attachments.length})
                 </p>
               </div>
               <div className="space-y-2">
                 {ticket.attachments.map((attachment, index) => (
                   <a
                     key={index}
                     href={`http://localhost:5001/uploads/${attachment.filename}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     download={attachment.filename}
                     className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                   >
                     <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                       {attachment.mimetype?.startsWith("image/") ? (
                         <ImageIcon size={20} className="text-blue-600 dark:text-blue-400" />
                       ) : (
                         <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                       )}
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                         {attachment.filename}
                       </p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">
                         {(attachment.size / 1024).toFixed(1)} KB
                       </p>
                     </div>
                     <Download size={18} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                   </a>
                 ))}
               </div>
             </div>
           )}

           {/* Comments/Feedback */}
           {ticket.comments && ticket.comments.length > 0 && (
             <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-gray-500 dark:text-gray-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Feedback & Comments ({ticket.comments.filter(comment => !comment.isHidden && comment.user?.role === 'Client').length})
                  </p>
                </div>
                <div className="space-y-3">
                  {ticket.comments.filter(comment => !comment.hidden).map((comment, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {comment.user?.name || comment.user?.username || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comment.content}
                      </p>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          {comment.replies.map((reply, rIndex) => (
                            <div key={rIndex} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                   {reply.user?.name || reply.user?.username || 'Unknown'} replied:
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(reply.createdAt).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {reply.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-end gap-3">
          <a
            href={ticket.attachments && ticket.attachments.length > 0 ? `http://localhost:5001/uploads/${ticket.attachments[0].filename}` : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${!ticket.attachments?.length ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <Download size={16} />
            Download All
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailSection = ({ icon: Icon, label, value, render }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={14} className="text-gray-500 dark:text-gray-400" />
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
    <div className="mt-1">
      {render ? render(value) : <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>}
    </div>
  </div>
);

const renderUrgency = (urgency) => {
  const colors = {
    Critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    High: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    Medium: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${colors[urgency] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
    >
      {urgency}
    </span>
  );
};

const renderStatus = (status) => {
  const colors = {
    Open: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    "In Progress": "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    Resolved: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Closed: "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${colors[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
    >
      {status}
    </span>
  );
};

export default SelectedTicketModal;