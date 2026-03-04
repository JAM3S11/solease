import React from "react";
import { Download, FileSpreadsheet } from "lucide-react";

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
      className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
    >
      <FileSpreadsheet size={18} className="text-green-600 dark:text-green-400" />
      <span className="text-sm">Export</span>
    </button>
  );
};

export default ExportData;