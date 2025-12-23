import React from "react";
import { Download } from "lucide-react";

/**
 * Reusable CSV Export Component
 * @param {Array} data - The table data (array of ticket objects)
 * @param {string} fileName - The name for the exported file
 */
const ExportData = ({ data = [], fileName = "tickets_data.csv" }) => {

  const handleExportCSV = () => {
    if (!data.length) {
      alert("No data available to export.");
      return;
    }
    const headers = [
      "Ticket ID",
      "Issue Type",
      "Description",
      "Urgency",
      "Assigned To",
      "Status",
      "Created At",
    ];
    // Convert data to CSV rows
    const rows = data.map((ticket) => [
      `#${ticket._id?.slice(-6).toUpperCase()}`,
      ticket.issueType,
      `"${ticket.description?.replace(/"/g, '""')}"`,
      ticket.urgency,
      ticket.assignedTo ? ticket.assignedTo.username : "Pending",
      ticket.status,
      ticket.createdAt
        ? new Date(ticket.createdAt).toISOString().split("T")[0]
        : "N/A",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    // Optional: Add BOM for Excel
    const csvWithBOM = "\uFEFF" + csvContent;

    // Create blob & trigger download
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExportCSV}
      className="flex items-center btn btn-primary text-white gap-1 rounded-md hover:btn-secondary hover:text-white"
    >
      <Download size={18} />
      <span className="text-sm font-normal">Export Data</span>
    </button>
  );
};

export default ExportData;