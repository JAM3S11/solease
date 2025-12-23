// components/TicketDetailModal.jsx
import React from "react";
import { X } from "lucide-react";

const SelectedTicketModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Background overlay with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] p-6 overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          Ticket Details
        </h2>

        {/* Content */}
        <div className="space-y-5 text-gray-700 dark:text-gray-300">
          {/* Ticket ID + Issue Type */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-8 gap-4">
            <DetailItem
              label="Ticket ID"
              value={`#${ticket._id.slice(-6).toUpperCase()}`}
            />
            <DetailItem label="Issue Type" value={ticket.issueType} />
          </div>

          <DetailItem label="Subject" value={ticket.subject} />
          <DetailItem label="Description" value={ticket.description} />

          {/* Urgency + Status */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-8 gap-4">
            <DetailItem label="Urgency" value={renderUrgency(ticket.urgency)} />
            <DetailItem label="Status" value={renderStatus(ticket.status)} />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-8 gap-4">
          <DetailItem 
            label="Assigned To" 
            value={ticket.assignedTo ? ticket.assignedTo.username || ticket.assignedTo.email : "Pending"} 
          />

            <DetailItem
              label="Created At"
              value={new Date(ticket.createdAt).toLocaleString()}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 
                      dark:bg-gray-800 dark:text-gray-200 
                      hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
      {label}
    </p>
    <div className="mt-1 text-base">{value}</div>
  </div>
);

const renderUrgency = (urgency) => {
  const colors = {
    Critical: "bg-red-100 text-red-600",
    High: "bg-orange-100 text-orange-600",
    Medium: "bg-yellow-100 text-yellow-600",
    Low: "bg-green-100 text-green-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[urgency] || "bg-gray-100 text-gray-500"
      }`}
    >
      {urgency}
    </span>
  );
};

const renderStatus = (status) => {
  const colors = {
    Open: "bg-blue-100 text-blue-600",
    "In Progress": "bg-yellow-100 text-yellow-600",
    Resolved: "bg-green-100 text-green-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default SelectedTicketModal;