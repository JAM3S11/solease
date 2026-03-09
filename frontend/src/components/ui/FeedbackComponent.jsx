import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Clock3,
  Eye,
  EyeOff,
  Grid2x2,
  MapPin,
  MessageCircle,
  Paperclip,
  Pencil,
  Phone,
  Search,
  Send,
  Trash2,
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
  if (status === "Resolved") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
  if (status === "In Progress") return "bg-sky-500/15 text-sky-300 border-sky-500/40";
  if (status === "Closed") return "bg-slate-500/15 text-slate-300 border-slate-500/40";
  return "bg-amber-500/15 text-amber-300 border-amber-500/40";
};

const getPriorityDotClass = (urgency) => {
  if (urgency === "Critical") return "bg-red-500";
  if (urgency === "High") return "bg-orange-500";
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

  if (loading && !ticket) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading ticket details...</div>
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
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Ticket Summary */}
        <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto bg-white dark:bg-[#0d121f]">
          <div className="p-6">
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 mb-2">Current View</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Ticket #{ticket._id.slice(-6).toUpperCase()}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
              <MapPin size={12} />
              <span>{ticket.location || "No location"}</span>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 mb-2">Status</p>
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
                      <ListboxOptions className="absolute left-0 z-20 mt-2 min-w-[150px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b2a] p-1 shadow-xl">
                        {STATUS_OPTIONS.map((status) => (
                          <ListboxOption
                            key={status}
                            value={status}
                            disabled={status === ticket.status}
                            className={({ active, disabled }) =>
                              `cursor-pointer rounded-md px-3 py-2 text-sm ${
                                active ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
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
                  <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Updating...</span>
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 mb-2">Priority</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <span className={`w-2.5 h-2.5 rounded-full ${getPriorityDotClass(ticket.urgency)}`} />
                  <span>{ticket.urgency || "Low"}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 mb-2">Type</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{ticket.issueType || "Other"}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg">
                <Grid2x2 size={18} />
                <span className="text-sm font-semibold">Overview</span>
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-3 bg-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/20">
                <MessageCircle size={18} />
                <span className="text-sm font-semibold">Ticket Feedback</span>
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg">
                <Clock3 size={18} />
                <span className="text-sm font-semibold">Audit Trail</span>
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg">
                <Paperclip size={18} />
                <span className="text-sm font-semibold">Documents</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6">
            <button
              onClick={() => handleStatusChange("Closed")}
              disabled={ticket.status === "Closed" || statusLoading}
              className="w-full py-3 px-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-500 rounded-lg flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
              <span className="text-sm font-bold">Close Ticket</span>
            </button>
          </div>
        </aside>

        {/* Center Column - Conversation */}
        <section className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0f1a] overflow-hidden">
          {/* Chat Header */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0d121f]/50 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">Conversation</h3>
              <span className="text-[10px] bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 px-2 py-0.5 rounded border border-green-200 dark:border-green-500/20 font-bold uppercase tracking-wider">
                Live Support
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded-lg">
                <Video size={16} />
              </button>
              <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded-lg">
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800">
            <label className="relative block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={messageSearch}
                onChange={(event) => setMessageSearch(event.target.value)}
                placeholder="Search messages..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b2a] py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-orange-500 dark:focus:border-slate-500"
              />
            </label>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-600 bg-slate-100 dark:bg-[#161b2a] px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                Ticket opened {formatReadableDate(ticket.createdAt)} — {formatShortTime(ticket.createdAt)}
              </span>
            </div>

            <div className="space-y-6">
              {filteredMessages.length === 0 && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161b2a] p-6 text-center text-slate-500 dark:text-slate-400">
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
                    className={`flex gap-4 ${isSelf ? "flex-row-reverse" : ""} max-w-2xl ${isSelf ? "ml-auto" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-600 flex items-center justify-center shrink-0 ${isSelf ? "" : ""}`}>
                      {isSelf ? (
                        <span className="font-bold text-xs text-indigo-600 dark:text-white">
                          {user?.name?.slice(0, 2)?.toUpperCase() || "DJ"}
                        </span>
                      ) : (
                        <MessageCircle size={20} className="text-indigo-600 dark:text-white" />
                      )}
                    </div>
                    <div className={isSelf ? "flex flex-col items-end" : ""}>
                      <div className="flex items-center gap-2 mb-1">
                        {!isSelf && (
                          <>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{messageOwner}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatShortTime(message.createdAt)}</span>
                          </>
                        )}
                        {isSelf && (
                          <>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatShortTime(message.createdAt)}</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">You</span>
                          </>
                        )}
                      </div>

                      <div
                        className={`border p-4 rounded-2xl ${
                          isSelf
                            ? "bg-orange-500 text-white rounded-tr-none"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b2a] text-slate-700 dark:text-slate-100 rounded-tl-none"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>

                      {isHidden && canModerate && (
                        <p className="text-xs font-semibold text-amber-500 dark:text-amber-300 mt-1">This comment is hidden.</p>
                      )}

                      <div className="flex items-center gap-1 mt-2 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(message.content || "");
                            toast.success("Copied to clipboard");
                          }}
                          className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b2a] p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Clipboard size={14} />
                        </button>
                        {canEditOwn && (
                          <>
                            <button
                              onClick={() =>
                                setEditModal({ show: true, message, content: message.content || "" })
                              }
                              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161b2a] p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ show: true, message })}
                              className="rounded-md border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-900/30 p-1.5 text-red-500 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                        {canModerateComment && !isHidden && (
                          <button
                            onClick={() => setHideModal({ show: true, commentId: message._id })}
                            disabled={moderating === message._id}
                            className="rounded-md border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-900/25 p-1.5 text-red-500 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/45 disabled:opacity-50"
                          >
                            <EyeOff size={14} />
                          </button>
                        )}
                        {canModerateComment && isHidden && (
                          <button
                            onClick={() => setUnhideModal({ show: true, commentId: message._id })}
                            disabled={moderating === message._id}
                            className="rounded-md border border-green-200 dark:border-emerald-500/40 bg-green-50 dark:bg-emerald-900/20 p-1.5 text-green-600 dark:text-emerald-300 hover:bg-green-100 dark:hover:bg-emerald-900/40 disabled:opacity-50"
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
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0d121f]/30">
              <div className="bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <textarea
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  rows={3}
                  placeholder="Type your message to the support team..."
                  className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-slate-200 focus:ring-0 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSubmitMessage();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                  <div className="flex gap-4">
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors">
                      <Paperclip size={18} />
                    </button>
                    <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors">
                      <Search size={18} />
                    </button>
                  </div>
                  <button
                    onClick={handleSubmitMessage}
                    disabled={loading || !newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-900/20 text-sm text-amber-600 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                Feedback is available only for ticket participants.
              </div>
            </div>
          )}
        </section>

        {/* Right Column - Personal Notes */}
        <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-[#0d121f]/20 overflow-y-auto">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Pencil size={18} className="text-orange-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-xl">Personal Notes</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-6">
              Add private notes for your own reference. These are not visible to the support team.
            </p>

            <div className="bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-8">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Enter private note..."
                rows={5}
                className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-slate-200 focus:ring-0 resize-none p-4 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <div className="p-2 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
                <button
                  onClick={handleSaveLocal}
                  disabled={!draft.trim()}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[10px] font-bold text-slate-700 dark:text-white py-1 px-3 rounded uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="bg-orange-500 hover:bg-orange-600 text-[10px] font-bold text-white py-1 px-3 rounded uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {moderating === "intervention" ? "Saving..." : "Save Internal"}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-600">Your Saved Notes</p>
              {notes.length === 0 ? (
                <div className="bg-slate-100 dark:bg-[#161b2a]/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-sm text-slate-500 dark:text-slate-500">
                  No personal notes yet.
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-slate-100 dark:bg-[#161b2a]/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-2">{formatReadableDate(note.createdAt)}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{note.content}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-600 mb-4">Associated Entities</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
                {ticket.location || "Location"}
              </span>
              <span className="px-2 py-1 bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
                {ticket.issueType || "Issue"}
              </span>
              <span className="px-2 py-1 bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
                {getIssueTypeInitials(ticket.issueType)}
              </span>
              <span className="px-2 py-1 bg-white dark:bg-[#161b2a] border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
                {ticket.status}
              </span>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
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
            className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1733] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Hide Comment</h3>
              <button
                className="rounded-md p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setHideModal({ show: false, commentId: null })}
              >
                <X size={18} />
              </button>
            </div>
            <input
              value={hideCode}
              onChange={(event) => setHideCode(event.target.value)}
              placeholder="Enter hide code"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-500"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Hint: SOLEASEHIDE</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                onClick={() => setHideModal({ show: false, commentId: null })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-500 hover:bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
            className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1733] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Unhide Comment</h3>
              <button
                className="rounded-md p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setUnhideModal({ show: false, commentId: null })}
              >
                <X size={18} />
              </button>
            </div>
            <input
              value={unhideCode}
              onChange={(event) => setUnhideCode(event.target.value)}
              placeholder="Enter unhide code"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-500"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Hint: SOLEASEUNHIDE</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
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
            className="w-full max-w-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1733] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Message</h3>
              <button
                className="rounded-md p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setEditModal({ show: false, message: null, content: "" })}
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              value={editModal.content}
              onChange={(event) => setEditModal((prev) => ({ ...prev, content: event.target.value }))}
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                onClick={() => setEditModal({ show: false, message: null, content: "" })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-sky-500 hover:bg-sky-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
            className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0b1733] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Delete Message</h3>
              <button
                className="rounded-md p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setDeleteModal({ show: false, message: null })}
              >
                <X size={18} />
              </button>
            </div>
            <p className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 text-sm text-slate-700 dark:text-slate-300">
              {deleteModal.message?.content}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                onClick={() => setDeleteModal({ show: false, message: null })}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-red-500 hover:bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleDeleteMessage}
                disabled={moderating === "delete"}
              >
                {moderating === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FeedbackComponent;
