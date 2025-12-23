// components/TicketDetailModal.jsx
import React, { useState } from "react";
import { X, ChevronDownIcon } from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";

const TicketDetailModal = ({ ticket, onClose, itSupportUsers, allTickets }) => {
  const { user } = useAuthenticationStore();
  const { updateTicket } = useTicketStore();

  const [assignedTo, setAssignedTo] = useState(
    typeof ticket.assignedTo === "object" ? ticket.assignedTo?._id : ""
  );
  const [status, setStatus] = useState(ticket.status);

  if (!ticket) return null;

  const getAssignedTicketCount = (userId) => {
    return allTickets.filter(
      (t) =>
        (t.assignedTo?._id === userId || t.assignedTo === userId) &&
        t.status !== "Resolved" &&
        t.status !== "Closed"
    ).length;
  };  

  const selectedIT = itSupportUsers.find((it) => it._id === assignedTo);

  const handleUpdate = async () => {
    try {
      const updateData = {};

      if (user.role === "Manager" || user.role === "Service Desk") {
        if (assignedTo) updateData.assignedTo = assignedTo;
        if (status) updateData.status = status;
      } else if (
        user.role === "IT Support" &&
        (ticket.assignedTo?._id === user._id || ticket.assignedTo === user._id)
      ) {
        updateData.status = status;
      }

      await updateTicket(ticket._id, updateData);
      
      onClose();
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
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

        {/* Ticket Info */}
        <div className="space-y-5 text-gray-700 dark:text-gray-300">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-8 gap-4">
            <DetailItem
              label="Ticket ID"
              value={`#${ticket._id.slice(-6).toUpperCase()}`}
            />
            <DetailItem label="Issue Type" value={ticket.issueType} />
          </div>

          <DetailItem label="Subject" value={ticket.subject} />
          <DetailItem label="Description" value={ticket.description} />

          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-8 gap-4">
            <DetailItem label="Urgency" value={renderUrgency(ticket.urgency)} />
            <DetailItem label="Status" value={renderStatus(ticket.status)} />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-8 gap-4">
            <DetailItem
              label="Assigned To"
              value={
                typeof ticket.assignedTo === "object"
                  ? ticket.assignedTo?.username
                  : "Pending"
              }
            />
                <DetailItem
                label="Created At"
                value={new Date(ticket.createdAt).toLocaleString()}
                />
          </div>

          {/* ROle specific for the admin */}
          {/* {user.role === "Manager" && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Assign to IT Support
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Select IT Support --</option>
                  {itSupportUsers.map((it) => (
                    <option key={it._id} value={it._id}>
                      {it.username || it.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )} */}
          {/* 🔹 Role-specific Actions */}
          {user.role === "Service Desk" && (
            <div className="space-y-4">
              {/* Assign IT Support */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Assign to IT Support
                </label>
                <Listbox value={assignedTo} onChange={setAssignedTo}>
                  <div className="relative mt-1">
                    <ListboxButton className="relative w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none">
                      <span className="block truncate">
                        {selectedIT ? selectedIT.username : "Select IT Support"}
                      </span>

                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      </span>
                    </ListboxButton>

                    <ListboxOptions className="mt-2 bg-white border rounded-xl shadow-lg">
                      {itSupportUsers.map((it) => {
                        const workload = getAssignedTicketCount(it._id);

                        return (
                          <ListboxOption
                            key={it._id}
                            value={it._id}
                            className="cursor-pointer px-4 py-2 flex items-center justify-between hover:bg-gray-100"
                          >
                            <span>{it.username}</span>

                            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                              {workload} tickets
                            </span>
                          </ListboxOption>
                        );
                      })}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              {/* Update Status */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Update Status
                </label>
                <Listbox value={status} onChange={setStatus}>
                  <div className="relative mt-1">
                    <ListboxButton className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md border">
                      <span className="block truncate">{status}</span>

                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      </span>
                    </ListboxButton>

                    <ListboxOptions className="absolute mt-1 w-full rounded-lg bg-white dark:bg-gray-800 shadow-lg border py-1 z-50">
                      {["Open", "In Progress", "Resolved", "Closed"].map((option) => (
                        <ListboxOption
                          key={option}
                          value={option}
                          className={({ active }) =>
                            `cursor-pointer select-none px-4 py-2 ${
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            }`
                          }
                        >
                          {option}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>
          )}

          {/* IT Support only if assigned */}
          {user.role === "IT Support" &&
            (ticket.assignedTo?._id === user._id ||
              ticket.assignedTo === user._id) && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {(user.role === "Service Desk" ||
            (user.role === "IT Support" &&
              (ticket.assignedTo?._id === user._id ||
                ticket.assignedTo === user._id))) && (
            <button
              onClick={handleUpdate}
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* Helpers */
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
    Closed: "bg-gray-300 text-gray-800",
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

export default TicketDetailModal;