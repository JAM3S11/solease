import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import toast from "react-hot-toast";

const ItSupportTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const { tickets, loading, updateTicket, error, fetchTickets } = useTicketStore();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    const found = tickets.find((t) => t._id === id);
    if (found) {
      setTicket(found);
      setStatus(found.status);
    }
  }, [tickets, id]);

  const handleUpdateTicket = async () => {
    if (!ticket) return;
    try {
      const updated = await updateTicket(ticket._id, { status });
      if (updated) {
        toast.success("Ticket status updated successfully!", { duration: 2000 });
        navigate("/itsupport-dashboard/assigned-ticket");
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Error updating the ticket.", { duration: 2000 });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-300">
            Loading ticket details...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-300">
            Ticket not found or unavailable.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-xl md:text-2xl font-bold text-foreground-light dark:text-foreground-dark">
            Ticket Details
          </h3>
          <Link
            to="/itsupport-dashboard/assigned-ticket"
            className="text-muted-light hover:text-red-500 transition"
          >
            <X size={28} />
          </Link>
        </div>

        {/* Ticket Info */}
        <div className="mt-1 mb-4 p-6 bg-slate-50 dark:bg-background-dark/50 w-full max-w-lg mx-auto rounded-lg shadow">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Ticket ID:
              </dt>
              <dd className="text-gray-500 text-base font-medium text-foreground-light dark:text-foreground-dark">
                #{ticket._id.slice(-6).toUpperCase()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Location:
              </dt>
              <dd className="text-gray-500 text-base font-medium text-foreground-light dark:text-foreground-dark">
                {ticket.location || "N/A"}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Issue Type:
              </dt>
              <dd
                className={`px-3 py-1 text-base font-medium rounded-full inline-block
                  ${
                    {
                      "Hardware issue": "bg-blue-100 text-blue-500",
                      "Software issue": "bg-green-100 text-green-500",
                      "Network Connectivity": "bg-red-100 text-red-500",
                      "Account Access": "bg-orange-100 text-orange-500",
                      Other: "bg-gray-100 text-gray-500",
                    }[ticket.issueType] || "bg-slate-300 text-slate-500"
                  }`}
              >
                {ticket.issueType}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Subject:
              </dt>
              <dd className="text-gray-500 text-base font-medium text-foreground-light dark:text-foreground-dark">
                {ticket.subject}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Description:
              </dt>
              <dd className="text-gray-500 text-base font-medium text-foreground-light dark:text-foreground-dark">
                {ticket.description || "No description provided."}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Urgency:
              </dt>
              <dd
                className={`px-3 py-1 text-base font-medium rounded-full inline-block
                  ${
                    {
                      Critical: "bg-red-100 text-red-600",
                      High: "bg-orange-100 text-orange-600",
                      Medium: "bg-yellow-100 text-yellow-600",
                      Low: "bg-green-100 text-green-600",
                    }[ticket.urgency] || "bg-gray-100 text-gray-500"
                  }`}
              >
                {ticket.urgency}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                Status:
              </dt>
              <dd
                className={`px-3 py-1 text-base font-medium rounded-full inline-block
                  ${
                    {
                      Open: "bg-blue-100 text-blue-600",
                      "In Progress": "bg-yellow-100 text-yellow-600",
                      Resolved: "bg-green-100 text-green-600",
                      Closed: "bg-gray-200 text-gray-700",
                    }[ticket.status] || "bg-gray-200 text-gray-700"
                  }`}
              >
                {ticket.status}
              </dd>
            </div>
          </dl>
        </div>

        {/* Update Status */}
        <div className="mt-6 max-w-lg mx-auto">
          <label className="block font-semibold mb-2 text-foreground-light dark:text-foreground-dark">
            Update Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-border-light dark:border-border-dark rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-sm"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Button */}
        <div className="mt-6 max-w-lg mx-auto">
          <button
            onClick={handleUpdateTicket}
            disabled={loading}
            className="btn btn-primary rounded-lg w-full"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ItSupportTicketDetail;