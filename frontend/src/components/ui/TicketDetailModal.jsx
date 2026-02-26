import React, { useState } from "react";
import { X, ChevronDown, Ticket, MapPin, Calendar, AlertCircle, Clock, Check, FileText, Bot, User, MessageCircle } from "lucide-react"; // Added User icon and MessageCircle
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import { useNavigate } from "react-router-dom";

const TicketDetailModal = ({ ticket, onClose }) => {
  const { user } = useAuthenticationStore();
  const { updateTicket } = useTicketStore();
  const navigate = useNavigate();

  const [status, setStatus] = useState(ticket?.status || "");

  if (!ticket) return null;

  // Authorization check helper
  const canUpdateStatus = ["Manager", "Reviewer", "Service Desk"].includes(user?.role);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
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
            <DetailSection icon={MapPin} label="Location" value={ticket.location} />
            <DetailSection icon={AlertCircle} label="Urgency" value={ticket.urgency} render={renderUrgency} />
            <DetailSection icon={Clock} label="Status" value={ticket.status} render={renderStatus} />
            <DetailSection 
              icon={Calendar} 
              label="Created At" 
              value={new Date(ticket.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })} 
            />
          </div>

          {/* Automation Info */}
          {ticket.isAutomated && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
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
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Attachments</p>
              <div className="space-y-2">
                {ticket.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={`http://localhost:5001/uploads/${attachment.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{attachment.originalName || attachment.filename}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{(attachment.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Role-specific Actions (Update Status) */}
          {canUpdateStatus && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ticket Actions</p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Update Status</label>
                <Listbox value={status} onChange={setStatus}>
                  <div className="relative">
                    <ListboxButton className="relative w-full cursor-default rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                      <span className="block truncate text-gray-900 dark:text-gray-100">{status}</span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1.5 shadow-xl focus:outline-none">
                      {["Open", "In Progress", "Resolved", "Closed"].map((option) => (
                        <ListboxOption
                          key={option}
                          value={option}
                          className={({ active }) =>
                            `relative cursor-pointer select-none px-4 py-3 text-sm transition-colors ${active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`
                          }
                        >
                          {({ selected }) => (
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {selected && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                            </div>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
          {/* Feedback Button - Left side */}
          {(ticket.status === 'Resolved' || ticket.status === 'In Progress') && (
            <button
              onClick={() => {
                onClose();
                // Navigate to feedback based on user role
                if (user?.role === 'Client') {
                  navigate(`/client-dashboard/ticket/${ticket._id}/feedback`);
                } else if (user?.role === 'Reviewer') {
                  navigate(`/reviewer-dashboard/ticket/${ticket._id}/feedback`); // Reviewer uses dedicated feedback page
                } else if (user?.role === 'Manager') {
                  navigate(`/client-dashboard/ticket/${ticket._id}/feedback`); // Manager can also use the feedback component
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center gap-2"
            >
              <MessageCircle size={16} />
              {ticket.chatEnabled ? 'Open Chat' : 'Provide Feedback'}
            </button>
          )}

          {/* Action Buttons - Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            {canUpdateStatus && (
              <button
                onClick={handleUpdate}
                disabled={status === ticket.status}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/30"
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

const DetailSection = ({ icon: Icon, label, value, render }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={14} className="text-gray-500 dark:text-gray-400" />
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</p>
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
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${colors[urgency] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
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
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${colors[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
      {status}
    </span>
  );
};

export default TicketDetailModal;