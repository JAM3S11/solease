import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Clock3,
  Cloud,
  Download,
  Eye,
  EyeOff,
  File,
  FileImage,
  FileText,
  Grid2x2,
  Image,
  MapPin,
  Menu,
  MessageCircle,
  Paperclip,
  Pencil,
  Phone,
  Plus,
  PlusCircle,
  Search,
  Send,
  Trash2,
  Upload,
  UserPlus,
  Video,
  X,
} from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import toast from "react-hot-toast";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];

const ISSUE_TYPE_INITIALS = {
  "software issue": "SI",
  "hardware issue": "HI",
  "network connectivity": "NC",
  "account access": "AA",
  other: "OT",
};

const getStatusPillClass = (status) => {
  if (status === "Resolved") return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40";
  if (status === "In Progress") return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40";
  if (status === "Closed") return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/40";
  return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40";
};

const getPriorityDotClass = (urgency) => {
  if (urgency === "Critical") return "bg-red-500";
  if (urgency === "High") return "bg-blue-500";
  if (urgency === "Medium") return "bg-yellow-400";
  return "bg-emerald-500";
};

const formatShortTime = (value) => {
  if (!value) return "--:--";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatReadableDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
};

const getUserDisplayName = (message, fallbackUser) => {
  if (message.user?.name) return message.user.name;
  if (message.user?.username) return message.user.username;
  if (message.user?._id === fallbackUser?._id) return fallbackUser?.name || fallbackUser?.username || "You";
  return "Support Team";
};

const getIssueTypeInitials = (issueType) => {
  if (!issueType) return "OT";
  const normalized = issueType.toLowerCase();
  if (ISSUE_TYPE_INITIALS[normalized]) return ISSUE_TYPE_INITIALS[normalized];
  return issueType
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const FeedbackComponent = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("solease-ui-theme");
      if (stored === "dark") return true;
      if (stored === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const stored = localStorage.getItem("solease-ui-theme");
    if (stored === "dark") {
      setIsDarkTheme(true);
    } else if (stored === "light") {
      setIsDarkTheme(false);
    } else {
      setIsDarkTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    const observer = new MutationObserver(() => {
      setIsDarkTheme(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const {
    tickets,
    fetchTickets,
    fetchSingleTicket,
    submitFeedback,
    addReply,
    editComment,
    deleteComment,
    editReply,
    deleteReply,
    loading,
    hideFeedback,
    unhideFeedback,
    managerIntervention,
    updateTicket,
    uploadFile,
    uploadLoading,
    uploadProgress,
  } = useTicketStore();

  const ticket = tickets.find((entry) => entry?._id === id);
  const [newMessage, setNewMessage] = useState("");
  const [moderating, setModerating] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [hideModal, setHideModal] = useState({ show: false, commentId: null });
  const [unhideModal, setUnhideModal] = useState({ show: false, commentId: null });
  const [editModal, setEditModal] = useState({ show: false, message: null, content: "" });
  const [deleteModal, setDeleteModal] = useState({ show: false, message: null });
  const [hideCode, setHideCode] = useState("");
  const [unhideCode, setUnhideCode] = useState("");
  const messagesEndRef = useRef(null);
  const [activeView, setActiveView] = useState("feedback");
  const [headerAction, setHeaderAction] = useState("video");
  const [uploadModal, setUploadModal] = useState({ show: false });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mobileView, setMobileView] = useState("summary");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Personal notes state
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState([]);
  const storageKey = `solease-personal-notes-${id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setNotes(raw ? JSON.parse(raw) : []);
    } catch {
      setNotes([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [storageKey, notes]);

  const handleSaveLocal = () => {
    if (!draft.trim()) return;
    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        content: draft.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setDraft("");
    toast.success("Personal note saved");
  };

  useEffect(() => {
    if (!tickets.length) {
      fetchTickets();
    } else if (!ticket) {
      fetchSingleTicket(id);
    }
  }, [fetchSingleTicket, fetchTickets, id, ticket, tickets.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [ticket?.comments]);

  const canProvideFeedback = Boolean(
    ticket && ["Client", "Reviewer", "Manager", "IT Support"].includes(user?.role)
  );
  const canModerate = ["Reviewer", "Manager", "IT Support"].includes(user?.role);
  const canCreateInternalNotes = user?.role === "Manager";
  const canChangeStatus =
    ticket &&
    ["Reviewer", "Manager"].includes(user?.role) &&
    (ticket.assignedTo?._id === user?._id ||
      ticket.assignedTo?.id === user?._id ||
      ticket.assignedTo === user?._id ||
      user?.role === "Manager");

  const auditLogs = useMemo(() => {
    const logs = [];
    if (ticket) {
      logs.push({
        id: "created",
        type: "created",
        message: "Ticket created",
        user: ticket.user,
        timestamp: ticket.createdAt,
      });
      if (ticket.assignedTo) {
        logs.push({
          id: "assigned",
          type: "assigned",
          message: `Ticket assigned to ${ticket.assignedTo.name || ticket.assignedTo.username || "Unknown"}`,
          user: ticket.assignedTo,
          timestamp: ticket.createdAt,
        });
      }
      ticket.comments?.forEach((comment) => {
        logs.push({
          id: comment._id,
          type: "comment",
          message: "New comment added",
          user: comment.user,
          timestamp: comment.createdAt,
        });
        comment.replies?.forEach((reply) => {
          logs.push({
            id: reply._id,
            type: "reply",
            message: "Reply added",
            user: reply.user,
            timestamp: reply.createdAt,
          });
        });
      });
    }
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [ticket]);

  const allMessages = useMemo(() => {
    if (!ticket?.comments?.length) return [];
    const list = [];

    ticket.comments.forEach((comment) => {
      const hiddenForThisUser = comment.isHidden && !canModerate;
      if (hiddenForThisUser) return;

      list.push({
        ...comment,
        type: "comment",
        id: comment._id,
        createdAt: comment.createdAt,
      });

      comment.replies?.forEach((reply) => {
        list.push({
          ...reply,
          type: "reply",
          commentId: comment._id,
          id: reply._id,
          createdAt: reply.createdAt,
        });
      });
    });

    return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [canModerate, ticket?.comments]);

  const filteredMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();
    if (!query) return allMessages;
    return allMessages.filter((message) => {
      const content = message.content?.toLowerCase() || "";
      const author = getUserDisplayName(message, user).toLowerCase();
      return content.includes(query) || author.includes(query);
    });
  }, [allMessages, messageSearch, user]);

  const handleStatusChange = async (nextStatus) => {
    if (!ticket || !nextStatus || nextStatus === ticket.status) return;
    setStatusLoading(true);
    try {
      await updateTicket(id, { status: nextStatus });
      toast.success(`Status changed to ${nextStatus}`);
      fetchTickets();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmitMessage = async () => {
    if (!ticket || !newMessage.trim()) return;

    try {
      if (!ticket.comments?.length) {
        if (user?.role !== "Client") {
          toast.error("Only clients can submit the first message");
          return;
        }
        await submitFeedback(id, newMessage.trim());
      } else {
        const latestComment = ticket.comments[ticket.comments.length - 1];
        await addReply(id, latestComment._id, newMessage.trim());
      }

      setNewMessage("");
      toast.success("Message sent");
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleCreateInternal = async (content, resetDraft) => {
    if (!ticket?.comments?.length) {
      toast.error("Add a conversation message first, then create an internal note.");
      return;
    }
    if (!content.trim()) return;
    setModerating("intervention");
    try {
      const latestComment = ticket.comments[ticket.comments.length - 1];
      await managerIntervention(id, latestComment._id, content.trim());
      toast.success("Internal note added");
      resetDraft("");
      fetchTickets();
    } catch {
      toast.error("Failed to add internal note");
    } finally {
      setModerating(null);
    }
  };

  const handleHide = async () => {
    if (!hideCode.trim() || !hideModal.commentId) return;
    setModerating(hideModal.commentId);
    try {
      await hideFeedback(id, hideModal.commentId, hideCode.trim());
      toast.success("Comment hidden");
      fetchTickets();
      setHideModal({ show: false, commentId: null });
      setHideCode("");
    } catch {
      toast.error("Failed to hide comment. Check your code.");
    } finally {
      setModerating(null);
    }
  };

  const handleUnhide = async () => {
    if (!unhideCode.trim() || !unhideModal.commentId) return;
    setModerating(unhideModal.commentId);
    try {
      await unhideFeedback(id, unhideModal.commentId, unhideCode.trim());
      toast.success("Comment unhidden");
      fetchTickets();
      setUnhideModal({ show: false, commentId: null });
      setUnhideCode("");
    } catch {
      toast.error("Failed to unhide comment. Check your code.");
    } finally {
      setModerating(null);
    }
  };

  const handleEditMessage = async () => {
    if (!editModal.content.trim() || !editModal.message) return;
    setModerating("edit");
    try {
      const { message } = editModal;
      if (message.type === "comment") {
        await editComment(id, message.id, editModal.content.trim());
      } else {
        await editReply(id, message.commentId, message.id, editModal.content.trim());
      }
      toast.success("Message updated");
      setEditModal({ show: false, message: null, content: "" });
      fetchTickets();
    } catch {
      toast.error("Failed to update message");
    } finally {
      setModerating(null);
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteModal.message) return;
    setModerating("delete");
    try {
      const { message } = deleteModal;
      if (message.type === "comment") {
        await deleteComment(id, message.id);
      } else {
        await deleteReply(id, message.commentId, message.id);
      }
      toast.success("Message deleted");
      setDeleteModal({ show: false, message: null });
      fetchTickets();
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setModerating(null);
    }
  };

  const handleFileUpload = async (files) => {
    if (!files.length || !ticket) return;
    try {
      for (const file of files) {
        await uploadFile(id, file);
      }
      toast.success("Files uploaded successfully");
      setUploadModal({ show: false });
      fetchTickets();
    } catch {
      toast.error("Failed to upload files");
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
      return <FileImage size={20} className="text-primary" />;
    }
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) {
      return <FileText size={20} className="text-primary" />;
    }
    return <File size={20} className="text-primary" />;
  };

  if (loading && !ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-muted-foreground">Loading ticket details...</div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-500">Ticket not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex -m-6 h-[calc(100%+3rem)] overflow-hidden flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <button
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-foreground">Ticket #{ticket._id.slice(-6).toUpperCase()}</span>
          <button
            onClick={() => setMobileView(mobileView === "summary" ? "notes" : "summary")}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileView === "summary" ? <Pencil size={20} /> : <Grid2x2 size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex border-b border-border bg-card overflow-x-auto">
          {[
            { id: "summary", label: "Summary" },
            { id: "overview", label: "Overview" },
            { id: "feedback", label: "Conversation" },
            { id: "audit", label: "Audit" },
            { id: "documents", label: "Documents" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => {
                if (id === "summary") {
                  setMobileView("summary");
                } else {
                  setActiveView(id);
                  setMobileView("content");
                }
              }}
              className={`flex-1 min-w-0 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                (mobileView === "summary" && id === "summary") || activeView === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Left Column - Ticket Summary */}
        <aside className={`w-full lg:w-72 shrink-0 border-r border-border bg-card flex flex-col min-h-0 overflow-y-auto ${
          showMobileSidebar ? "fixed inset-0 z-50 lg:relative lg:translate-x-0 lg:block" : "hidden lg:block"
        }`}>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Current View</p>
              <button onClick={() => setShowMobileSidebar(false)} className="p-1 text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2 hidden lg:block">Current View</p>
            <h2 className="text-xl font-bold text-foreground mb-1">
              Ticket #{ticket._id.slice(-6).toUpperCase()}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <MapPin size={12} />
              <span>{ticket.location || "No location"}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Status</p>
                {canChangeStatus ? (
                  <Listbox value={ticket.status} onChange={handleStatusChange}>
                    <div className="relative inline-block">
                      <ListboxButton
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusPillClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                        <ChevronDown size={12} />
                      </ListboxButton>
                      <ListboxOptions className="absolute left-0 z-20 mt-2 min-w-[150px] rounded-lg border border-border bg-card p-1 shadow-xl">
                        {STATUS_OPTIONS.map((status) => (
                          <ListboxOption
                            key={status}
                            value={status}
                            disabled={status === ticket.status}
                            className={({ active, disabled }) =>
                              `cursor-pointer rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                              } ${disabled ? "cursor-not-allowed opacity-50" : ""}`
                            }
                          >
                            {status}
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                ) : (
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusPillClass(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                )}
                {statusLoading && (
                  <span className="ml-2 text-xs font-semibold text-muted-foreground">Updating...</span>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Priority</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span className={`w-2.5 h-2.5 rounded-full ${getPriorityDotClass(ticket.urgency)}`} />
                  <span>{ticket.urgency || "Low"}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Type</p>
                <p className="text-sm font-semibold text-muted-foreground">{ticket.issueType || "Other"}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "overview", label: "Overview", Icon: Grid2x2 },
                { id: "feedback", label: "Ticket Feedback", Icon: MessageCircle },
                { id: "audit", label: "Audit Trail", Icon: Clock3 },
                { id: "documents", label: "Documents", Icon: Paperclip },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveView(id);
                    setShowMobileSidebar(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeView === id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="shrink-0 p-6 border-t border-border">
            <button
              onClick={() => handleStatusChange("Closed")}
              disabled={ticket.status === "Closed" || statusLoading}
              className="w-full py-3 px-4 bg-destructive text-white rounded-lg flex items-center justify-center gap-2 hover:bg-destructive/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
              <span className="text-sm font-bold">Close Ticket</span>
            </button>
          </div>
        </aside>

        {/* Center Column - Overview or Conversation */}
        {activeView === "overview" ? (
          <section className={`flex-1 flex flex-col min-h-0 bg-background overflow-y-auto ${mobileView === "notes" ? "hidden lg:block" : "block"}`}>
            {/* Overview Header */}
            <div className="h-14 flex items-center px-6 border-b border-border bg-card/50 shrink-0">
              <h3 className="font-bold text-foreground text-xl">Ticket Overview</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Subject / Description */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Subject</p>
                <p className="text-base font-semibold text-foreground">{ticket.subject || ticket.issueType || "No subject provided"}</p>
                {ticket.description && (
                  <>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-2">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
                  </>
                )}
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Status</p>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusPillClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Priority</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getPriorityDotClass(ticket.urgency)}`} />
                    <span className="text-sm font-semibold text-foreground">{ticket.urgency || "Low"}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Issue Type</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{ticket.issueType || "Other"}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{ticket.location || "—"}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Submitted By</p>
                  <p className="text-sm font-semibold text-foreground">
                    {ticket.user?.name || ticket.user?.username || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Assigned To</p>
                  <p className="text-sm font-semibold text-foreground">
                    {ticket.assignedTo?.name || ticket.assignedTo?.username || "Unassigned"}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Date Submitted</p>
                  <p className="text-sm font-semibold text-foreground">{formatReadableDate(ticket.createdAt)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Last Updated</p>
                  <p className="text-sm font-semibold text-foreground">{formatReadableDate(ticket.updatedAt)}</p>
                </div>
              </div>

              {/* Message count */}
              <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Conversation Replies</p>
                  <p className="text-2xl font-bold text-foreground">{allMessages.length}</p>
                </div>
                <button
                  onClick={() => setActiveView("feedback")}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle size={15} />
                  View Conversation
                </button>
              </div>
            </div>
          </section>
        ) : activeView === "feedback" ? (
          <section className={`flex-1 flex flex-col min-h-0 bg-background overflow-y-auto ${mobileView === "notes" ? "hidden lg:block" : "block"}`}>
            {/* Chat Header */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-foreground text-xl">Conversation</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Live Support
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Listbox value={headerAction} onChange={setHeaderAction}>
                  <div className="relative">
                    <ListboxButton className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border rounded-lg">
                      {headerAction === "video" ? <Video size={16} /> : headerAction === "phone" ? <Phone size={16} /> : <Search size={16} />}
                    </ListboxButton>
                    <ListboxOptions className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-xl">
                      <ListboxOption
                        value="video"
                        className={({ active }) =>
                          `flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`
                        }
                      >
                        <Video size={16} />
                        <span>Start Video Call</span>
                      </ListboxOption>
                      <ListboxOption
                        value="phone"
                        className={({ active }) =>
                          `flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`
                        }
                      >
                        <Phone size={16} />
                        <span>Start Voice Call</span>
                      </ListboxOption>
                      <ListboxOption
                        value="search"
                        className={({ active }) =>
                          `flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`
                        }
                      >
                        <Search size={16} />
                        <span>Search Messages</span>
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            </div>

            {headerAction === "search" || messageSearch ? (
              <div className="px-6 py-3 border-b border-border shrink-0">
                <label className="relative block">
                  <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={messageSearch}
                    onChange={(event) => setMessageSearch(event.target.value)}
                    placeholder="Search messages..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 pl-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                </label>
              </div>
            ) : null}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex justify-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                  Ticket opened {formatReadableDate(ticket.createdAt)} — {formatShortTime(ticket.createdAt)}
                </span>
              </div>

              <div className="space-y-6">
                {filteredMessages.length === 0 && (
                  <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
                    No messages found for this conversation.
                  </div>
                )}

                {filteredMessages.map((message) => {
                  const isSelf = message.user?._id === user?._id;
                  const isComment = message.type === "comment";
                  const isHidden = Boolean(message.isHidden);
                  const messageOwner = getUserDisplayName(message, user);
                  const canEditOwn = isSelf;
                  const canModerateComment = canModerate && isComment && !isSelf;

                  return (
                    <div
                      key={`${message.type}-${message.id}`}
                      className={`group flex gap-4 ${isSelf ? "flex-row-reverse" : ""} max-w-2xl ${isSelf ? "ml-auto" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0`}>
                        {isSelf ? (
                          <span className="font-bold text-xs text-primary">
                            {user?.name?.slice(0, 2)?.toUpperCase() || "DJ"}
                          </span>
                        ) : (
                          <MessageCircle size={20} className="text-primary" />
                        )}
                      </div>
                      <div className={isSelf ? "flex flex-col items-end" : ""}>
                        <div className="flex items-center gap-2 mb-1">
                          {!isSelf && (
                            <>
                              <span className="text-sm font-bold text-foreground">{messageOwner}</span>
                              <span className="text-[10px] text-muted-foreground">{formatShortTime(message.createdAt)}</span>
                            </>
                          )}
                          {isSelf && (
                            <>
                              <span className="text-[10px] text-muted-foreground">{formatShortTime(message.createdAt)}</span>
                              <span className="text-sm font-bold text-foreground">You</span>
                            </>
                          )}
                        </div>

                        <div
                          className={`border p-4 rounded-2xl ${isSelf
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "border-border bg-card text-foreground rounded-tl-none"
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>

                        {isHidden && canModerate && (
                          <p className="text-xs font-semibold text-amber-500 mt-1">This comment is hidden.</p>
                        )}

                        <div className="flex items-center gap-1 mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.content || "");
                              toast.success("Copied to clipboard");
                            }}
                            className="rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:bg-secondary"
                          >
                            <Clipboard size={14} />
                          </button>
                          {canEditOwn && (
                            <>
                              <button
                                onClick={() =>
                                  setEditModal({ show: true, message, content: message.content || "" })
                                }
                                className="rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:bg-secondary"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteModal({ show: true, message })}
                                className="rounded-md border border-destructive/20 bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          {canModerateComment && !isHidden && (
                            <button
                              onClick={() => setHideModal({ show: true, commentId: message._id })}
                              disabled={moderating === message._id}
                              className="rounded-md border border-destructive/20 bg-destructive/10 p-1.5 text-destructive hover:bg-destructive/20 disabled:opacity-50"
                            >
                              <EyeOff size={14} />
                            </button>
                          )}
                          {canModerateComment && isHidden && (
                            <button
                              onClick={() => setUnhideModal({ show: true, commentId: message._id })}
                              disabled={moderating === message._id}
                              className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            {canProvideFeedback ? (
              <div className="shrink-0 p-3 border-t border-border bg-card/50 mt-auto">
                <div className="bg-card border border-border rounded-xl p-3">
                  <textarea
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    rows={2}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-none text-sm text-foreground focus:ring-0 resize-none placeholder:text-muted-foreground outline-none"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmitMessage();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                    <div className="flex gap-3">
                      <Listbox>
                        <div className="relative">
                          <ListboxButton className="text-muted-foreground hover:text-foreground transition-colors">
                            <Paperclip size={18} />
                          </ListboxButton>
                          <ListboxOptions className="absolute left-0 z-20 mb-2 w-56 rounded-lg border border-border bg-card p-1 shadow-xl" style={{ bottom: "100%" }}>
                            <ListboxOption
                              value="view"
                              onClick={() => setActiveView("documents")}
                              className={({ active }) =>
                                `flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`
                              }
                            >
                              <Upload size={16} />
                              <span>View Uploaded Documents</span>
                            </ListboxOption>
                            <ListboxOption
                              value="device"
                              className={({ active }) =>
                                `flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`
                              }
                            >
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.length) {
                                      handleFileUpload(Array.from(e.target.files));
                                    }
                                  }}
                                />
                                <File size={16} />
                                <span>Upload from Device</span>
                              </label>
                            </ListboxOption>
                            <ListboxOption
                              value="google"
                              className={({ active }) =>
                                `flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"}`
                              }
                            >
                              <Cloud size={16} />
                              <span>Google Photos</span>
                            </ListboxOption>
                          </ListboxOptions>
                        </div>
                      </Listbox>
                      {/* <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Search size={18} />
                      </button> */}
                    </div>
                    <button
                      onClick={handleSubmitMessage}
                      disabled={loading || !newMessage.trim()}
                      className="group relative flex items-center gap-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 shadow-md hover:shadow-lg"
                    >
                      <Send size={16} className="transition-transform group-hover:translate-x-0.1" />
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="shrink-0 p-4 border-t border-border bg-amber-500/10 text-sm text-amber-500">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  Feedback is available only for ticket participants.
                </div>
                </div>
              )}
            </section>
        ) : activeView === "audit" ? (
          <section className={`flex-1 flex flex-col min-h-0 bg-background overflow-y-auto ${mobileView === "notes" ? "hidden lg:block" : "block"}`}>
            {/* Audit Trail Header */}
            <div className="h-14 flex items-center px-6 border-b border-border bg-card/50 shrink-0">
              <h3 className="font-bold text-foreground text-xl">Audit Trail</h3>
            </div>

            <div className="p-6">
              {auditLogs.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
                  <Clock3 size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="font-semibold mb-1">No activity yet</p>
                  <p className="text-sm">Activity will appear here as events occur.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {log.type === "created" ? (
                          <PlusCircle size={20} className="text-primary" />
                        ) : log.type === "assigned" ? (
                          <UserPlus size={20} className="text-primary" />
                        ) : log.type === "comment" ? (
                          <MessageCircle size={20} className="text-primary" />
                        ) : (
                          <FileText size={20} className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{log.message}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {log.user?.name || log.user?.username || "Unknown"} • {formatReadableDate(log.timestamp)} at {formatShortTime(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : activeView === "documents" ? (
          <section className={`flex-1 flex flex-col min-h-0 bg-background overflow-y-auto ${mobileView === "notes" ? "hidden lg:block" : "block"}`}>
            {/* Documents Header */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/50 shrink-0">
              <h3 className="font-bold text-foreground text-xl">Documents</h3>
              <button
                onClick={() => setUploadModal({ show: true })}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                <Upload size={16} />
                Upload
              </button>
            </div>

            <div className="p-6">
              {!ticket.attachments || ticket.attachments.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
                  <Paperclip size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="font-semibold mb-1">No documents</p>
                  <p className="text-sm">Upload documents to attach to this ticket.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {ticket.attachments.map((attachment, index) => (
                    <div key={index} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {getFileIcon(attachment.filename)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {attachment.originalName || attachment.filename}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : "Unknown size"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={`http://localhost:5001/uploads/${attachment.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <Download size={12} />
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null}

        {/* Right Column - Personal Notes */}
        <aside className={`w-full lg:w-80 shrink-0 border-l border-border flex flex-col min-h-0 bg-card/50 overflow-y-auto ${
          mobileView === "notes" ? "block" : "hidden lg:block"
        }`}>
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pencil size={18} className="text-primary" />
              <h3 className="font-bold text-foreground text-xl">Personal Notes</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Add private notes for your own reference. These are not visible to the support team.
            </p>

            <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Enter private note..."
                rows={5}
                className="w-full bg-transparent border-none text-xs text-foreground focus:ring-0 resize-none p-4 placeholder:text-muted-foreground"
              />
              <div className="p-2 border-t border-border flex justify-end gap-2">
                <button
                  onClick={handleSaveLocal}
                  disabled={!draft.trim()}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground text-[10px] font-bold py-1 px-3 rounded uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Note
                </button>
                {canCreateInternalNotes && (
                  <button
                    onClick={() => {
                      if (ticket?.comments?.length) {
                        handleCreateInternal(draft, setDraft);
                      } else {
                        toast.error("Add a conversation message first");
                      }
                    }}
                    disabled={!draft.trim() || moderating === "intervention"}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-bold py-1 px-3 rounded uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {moderating === "intervention" ? "Saving..." : "Save Internal"}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Your Saved Notes</p>
              {notes.length === 0 ? (
                <div className="bg-card/50 border border-border p-4 rounded-xl text-sm text-muted-foreground">
                  No personal notes yet.
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-card/50 border border-border p-4 rounded-xl">
                    <p className="text-[10px] text-muted-foreground mb-2">{formatReadableDate(note.createdAt)}</p>
                    <p className="text-xs text-muted-foreground italic">"{note.content}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-border">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-4">Associated Entities</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-card border border-border rounded text-[10px] font-medium text-muted-foreground">
                {ticket.location || "Location"}
              </span>
              <span className="px-2 py-1 bg-card border border-border rounded text-[10px] font-medium text-muted-foreground">
                {ticket.issueType || "Issue"}
              </span>
              <span className="px-2 py-1 bg-card border border-border rounded text-[10px] font-medium text-muted-foreground">
                {getIssueTypeInitials(ticket.issueType)}
              </span>
              <span className="px-2 py-1 bg-card border border-border rounded text-[10px] font-medium text-muted-foreground">
                {ticket.status}
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCircle2 size={16} />
              Back to tickets
            </button>
          </div>
        </aside>
      </div>

      {/* Modals */}
      {hideModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setHideModal({ show: false, commentId: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Hide Comment</h3>
              <button
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                onClick={() => setHideModal({ show: false, commentId: null })}
              >
                <X size={18} />
              </button>
            </div>
            <input
              value={hideCode}
              onChange={(event) => setHideCode(event.target.value)}
              placeholder="Enter hide code"
              className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">Hint: SOLEASEHIDE</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                onClick={() => setHideModal({ show: false, commentId: null })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-destructive hover:bg-destructive/90 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleHide}
                disabled={!hideCode.trim() || moderating === hideModal.commentId}
              >
                {moderating === hideModal.commentId ? "Hiding..." : "Hide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {unhideModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setUnhideModal({ show: false, commentId: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Unhide Comment</h3>
              <button
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                onClick={() => setUnhideModal({ show: false, commentId: null })}
              >
                <X size={18} />
              </button>
            </div>
            <input
              value={unhideCode}
              onChange={(event) => setUnhideCode(event.target.value)}
              placeholder="Enter unhide code"
              className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <p className="mt-2 text-xs text-muted-foreground">Hint: SOLEASEUNHIDE</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                onClick={() => setUnhideModal({ show: false, commentId: null })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleUnhide}
                disabled={!unhideCode.trim() || moderating === unhideModal.commentId}
              >
                {moderating === unhideModal.commentId ? "Unhiding..." : "Unhide"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditModal({ show: false, message: null, content: "" })}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-border bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Edit Message</h3>
              <button
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                onClick={() => setEditModal({ show: false, message: null, content: "" })}
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              value={editModal.content}
              onChange={(event) => setEditModal((prev) => ({ ...prev, content: event.target.value }))}
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-muted px-3 py-2 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                onClick={() => setEditModal({ show: false, message: null, content: "" })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-primary hover:bg-primary/90 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleEditMessage}
                disabled={!editModal.content.trim() || moderating === "edit"}
              >
                {moderating === "edit" ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDeleteModal({ show: false, message: null })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Delete Message</h3>
              <button
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                onClick={() => setDeleteModal({ show: false, message: null })}
              >
                <X size={18} />
              </button>
            </div>
            <p className="rounded-lg border border-border bg-muted p-3 text-sm text-foreground">
              {deleteModal.message?.content}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                onClick={() => setDeleteModal({ show: false, message: null })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-destructive hover:bg-destructive/90 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleDeleteMessage}
                disabled={moderating === "delete"}
              >
                {moderating === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadModal.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setUploadModal({ show: false })}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Upload Documents</h3>
              <button
                className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                onClick={() => setUploadModal({ show: false })}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload size={24} className="mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Images, Documents (max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleFileUpload(Array.from(e.target.files));
                    }
                  }}
                />
              </label>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                onClick={() => {
                  setUploadModal({ show: false });
                  setActiveView("documents");
                }}
              >
                <Image size={18} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Select from Google Photos</span>
              </button>

              <button
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                onClick={() => {
                  setUploadModal({ show: false });
                  setActiveView("documents");
                }}
              >
                <Upload size={18} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">View Already Uploaded</span>
              </button>
            </div>

            {uploadLoading && (
              <div className="mt-4">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FeedbackComponent;
