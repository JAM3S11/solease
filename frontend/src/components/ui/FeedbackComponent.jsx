import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle, CheckCircle2, ChevronDown, Clipboard, Clock3,
  Download, Eye, EyeOff, File, FileImage, FileText, Grid2x2, MapPin,
  Menu, MessageCircle, Paperclip, Pencil, PlusCircle, Search,
  Send, Share2, Sparkles, Trash2, Upload, Zap, UserPlus, X, Pin,
  CornerUpLeft, Star, ArrowLeft, Check, Lock, ThumbsUp, ThumbsDown,
  Smile, Meh, Frown, Heart, Clock, Calendar, FileCheck,
} from "lucide-react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import toast from "react-hot-toast";
import DashboardLayout from "../ui/DashboardLayout";
import { useAuthenticationStore } from "../../store/authStore";
import useTicketStore from "../../store/ticketStore";
import usePersonalNoteStore from "../../store/personalNoteStore";
import api from "../../lib/axios";

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];
const URGENCY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const ISSUE_TYPE_INITIALS = {
  "software issue": "SI",
  "hardware issue": "HI",
  "network connectivity": "NC",
  "account access": "AA",
  other: "OT",
};

const getAttachments = (ticket) => ticket?.files || ticket?.attachments || [];

const NOTE_COLORS = [
  { id: "default", bg: "bg-card", border: "border-border", dot: "bg-muted-foreground/40" },
  { id: "amber",   bg: "bg-amber-500/8",   border: "border-amber-400/30",   dot: "bg-amber-400" },
  { id: "blue",    bg: "bg-blue-500/8",    border: "border-blue-400/30",    dot: "bg-blue-400" },
  { id: "emerald", bg: "bg-emerald-500/8", border: "border-emerald-400/30", dot: "bg-emerald-400" },
  { id: "rose",    bg: "bg-rose-500/8",    border: "border-rose-400/30",    dot: "bg-rose-400" },
];

const AUDIT_TYPES = ["all", "created", "assigned", "status_change", "comment", "reply", "files", "internal_note"];

const RATING_STARS = [
  { value: 1, label: "Very Dissatisfied", icon: Frown, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  { value: 2, label: "Dissatisfied", icon: Meh, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { value: 3, label: "Neutral", icon: Smile, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { value: 4, label: "Satisfied", icon: ThumbsUp, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { value: 5, label: "Very Satisfied", icon: Heart, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
];

const SURVEY_QUESTIONS = [
  { id: "resolution_speed", label: "How satisfied are you with the resolution time?", type: "rating" },
  { id: "communication", label: "How satisfied were you with our communication?", type: "rating" },
  { id: "solution_quality", label: "How satisfied are you with the solution provided?", type: "rating" },
  { id: "overall_experience", label: "How would you rate your overall experience?", type: "rating" },
  { id: "recommend", label: "Would you recommend our service to others?", type: "yesno" },
  { id: "comments", label: "Any additional feedback?", type: "text" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatusConfig = (status) => {
  const map = {
    "Resolved":    { pill: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", dot: "bg-emerald-500", ring: "ring-emerald-500/20" },
    "In Progress": { pill: "bg-blue-500/12 text-blue-600 dark:text-blue-400 border-blue-500/30",             dot: "bg-blue-500",    ring: "ring-blue-500/20" },
    "Closed":      { pill: "bg-slate-500/12 text-slate-500 dark:text-slate-400 border-slate-500/30",         dot: "bg-slate-500",   ring: "ring-slate-500/20" },
    "Open":        { pill: "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/30",         dot: "bg-amber-500",   ring: "ring-amber-500/20" },
  };
  return map[status] || map["Open"];
};

const getPriorityConfig = (urgency) => {
  const map = {
    "Critical": { dot: "bg-red-500",     text: "text-red-500",     label: "Critical" },
    "High":     { dot: "bg-blue-500",    text: "text-blue-500",    label: "High" },
    "Medium":   { dot: "bg-amber-400",   text: "text-amber-500",   label: "Medium" },
    "Low":      { dot: "bg-emerald-500", text: "text-emerald-500", label: "Low" },
  };
  return map[urgency] || map["Low"];
};

const formatShortTime = (v) => {
  if (!v) return "--:--";
  return new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatReadableDate = (v) => {
  if (!v) return "";
  return new Date(v).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
};

const formatRelativeTime = (v) => {
  if (!v) return "";
  const diff = Date.now() - new Date(v).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return formatReadableDate(v);
};

const getUserDisplayName = (message, currentUser) => {
  if (!message?.user) return "Unknown";
  if (message.user?.name) return message.user.name;
  if (message.user?.username) return message.user.username;
  const msgUserId = message.user._id || message.user.id;
  const currUserId = currentUser?._id || currentUser?.id;
  if (msgUserId === currUserId) return "You";
  return "Support Team";
};

const getInitials = (name) =>
  (name || "?").split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

const getIssueTypeInitials = (issueType) => {
  if (!issueType) return "OT";
  const normalized = issueType.toLowerCase();
  return ISSUE_TYPE_INITIALS[normalized] || issueType.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
};

const getFullProfilePhoto = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${import.meta.env.VITE_API_URL}${photo}`;
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ user, size = "sm", className = "" }) => {
  const sizeMap = { xs: "w-6 h-6 text-[9px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const photo = getFullProfilePhoto(user?.profilePhoto);
  const name = user?.name || user?.username || "?";
  return (
    <div className={`${sizeMap[size]} rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-background ${className}`}>
      {photo ? (
        <img src={photo} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-primary">{getInitials(name)}</span>
      )}
    </div>
  );
};

// ─── Status Pill ──────────────────────────────────────────────────────────────
const StatusPill = ({ status, className = "" }) => {
  const cfg = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.pill} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

// ─── Share Note Modal ─────────────────────────────────────────────────────────
const ShareNoteModal = ({ availableUsers, selectedUsers, setSelectedUsers, onClose, onShare, currentSharedWith = [] }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">Share Note</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Select people to share this note with</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto mb-5 pr-1">
        {availableUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No users available</p>
        ) : availableUsers.map((u) => {
          const shared = currentSharedWith.includes(u.id);
          const selected = selectedUsers.includes(u.id);
          return (
            <label key={u.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors ${shared ? "bg-emerald-500/8 border border-emerald-500/20" : "hover:bg-secondary border border-transparent"}`}>
              <input type="checkbox" checked={selected}
                onChange={(e) => setSelectedUsers(e.target.checked ? [...selectedUsers, u.id] : selectedUsers.filter((s) => s !== u.id))}
                className="w-4 h-4 rounded border-border accent-primary" />
              <Avatar user={u} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{u.name || u.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
              </div>
              {shared && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium shrink-0">Shared</span>}
            </label>
          );
        })}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">Cancel</button>
        <button onClick={onShare} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors">Save changes</button>
      </div>
    </div>
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ title, description, preview, confirmLabel = "Confirm", confirmClass = "bg-destructive hover:bg-destructive/90 text-white", onConfirm, onClose, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors ml-4 shrink-0"><X size={16} /></button>
      </div>
      {preview && <p className="rounded-xl border border-border bg-secondary/50 p-3 text-sm text-foreground mb-5 italic">"{preview}"</p>}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${confirmClass}`}>
          {loading ? "Processing..." : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─── Code Modal (hide/unhide) ─────────────────────────────────────────────────
const CodeModal = ({ title, hint, confirmLabel, confirmClass, onConfirm, onClose, loading }) => {
  const [code, setCode] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code…"
          className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary font-mono tracking-widest" />
        <p className="mt-2 text-xs text-muted-foreground">Hint: {hint}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
          <button onClick={() => onConfirm(code)} disabled={!code.trim() || loading} className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${confirmClass}`}>
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ content, onSave, onClose, loading }) => {
  const [val, setVal] = useState(content);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Edit message</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>
        <textarea value={val} onChange={(e) => setVal(e.target.value)} rows={4}
          className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary resize-none" />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
          <button onClick={() => onSave(val)} disabled={!val.trim() || loading} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium disabled:opacity-50 transition-colors">
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Upload Modal ─────────────────────────────────────────────────────────────
const UploadModal = ({ onUpload, onClose, loading, progress, onViewDocs }) => {
  const [dragging, setDragging] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-foreground">Upload documents</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>
        <label
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-secondary/50"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files?.length) onUpload(Array.from(e.dataTransfer.files)); }}
        >
          <Upload size={22} className={`mb-2 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-medium text-foreground">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, images, documents (max 10 MB)</p>
          <input type="file" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) onUpload(Array.from(e.target.files)); }} />
        </label>
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" />
        </div>
        <button onClick={() => { onClose(); onViewDocs(); }} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border hover:bg-secondary text-sm text-muted-foreground transition-colors">
          <Eye size={15} /> View already uploaded
        </button>
        {loading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Uploading…</span><span>{progress}%</span></div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── AI Modal ─────────────────────────────────────────────────────────────────
const AIModal = ({ onGenerate, onClose, loading, aiUsageData, planTier }) => {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI response generator</h3>
              <p className="text-xs text-muted-foreground">Powered by Claude</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={16} /></button>
        </div>
        <div className="p-5">
          <label className="block text-xs font-medium text-muted-foreground mb-2">Custom instructions (optional)</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. Be empathetic and offer a follow-up call…" rows={3}
            className="w-full px-3 py-2.5 border border-border rounded-xl bg-secondary/50 text-sm text-foreground resize-none outline-none focus:border-primary placeholder:text-muted-foreground" />
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 mb-5 p-3 rounded-xl bg-secondary/50">
            <span>Plan: <span className="font-medium text-foreground">{planTier}</span></span>
            <span>Remaining: <span className="font-medium text-foreground">{aiUsageData?.remaining ?? 0}</span> / {aiUsageData?.maxPerHour === Infinity ? "∞" : aiUsageData?.maxPerHour}</span>
          </div>
          <button onClick={() => onGenerate(prompt)} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all disabled:opacity-60 text-sm">
            {loading ? <><Sparkles size={15} className="animate-spin" /> Generating…</> : <><Sparkles size={15} /> Generate response</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const FeedbackComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthenticationStore();
  const {
    tickets, fetchTickets, fetchSingleTicket, submitFeedback, addReply,
    editComment, deleteComment, editReply, deleteReply, loading,
    hideFeedback, unhideFeedback, managerIntervention, updateTicket,
    uploadFile, uploadLoading, uploadProgress, triggerAIResponse, getAIUsage, aiUsage,
  } = useTicketStore();

  const ticketFromStore = tickets.find((e) => e?._id === id);
  const [localTicket, setLocalTicket] = useState(null);
  const ticket = localTicket || ticketFromStore;

  // ── Layout state ────────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState("feedback");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState("main"); // "sidebar" | "main" | "notes"

  // ── Message state ───────────────────────────────────────────────────────────
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // { id, content, author }
  const [messageSearch, setMessageSearch] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Moderation / edit state ─────────────────────────────────────────────────
  const [moderating, setModerating] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [hideModal, setHideModal] = useState(null);   // commentId
  const [unhideModal, setUnhideModal] = useState(null);
  const [editModal, setEditModal] = useState(null);   // { message }
  const [deleteModal, setDeleteModal] = useState(null); // { message }
  const [uploadModal, setUploadModal] = useState(false);

  // ── Audit ───────────────────────────────────────────────────────────────────
  const [auditFilter, setAuditFilter] = useState("all");

  // ── Notes ───────────────────────────────────────────────────────────────────
  const { notes, fetchNotes, createNote, deleteNote, shareNote, unshareNote } = usePersonalNoteStore();
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteSearch, setNoteSearch] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState(new Set());
  const [noteColors, setNoteColors] = useState({});
  const [shareModal, setShareModal] = useState(null); // { noteId, sharedWith }
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  // ── AI ──────────────────────────────────────────────────────────────────────
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUsageData, setAiUsageData] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // ── Satisfaction Rating ─────────────────────────────────────────────────────
  const [ratingModal, setRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  // ── Resolution Survey ───────────────────────────────────────────────────────
  const [surveyModal, setSurveyModal] = useState(false);
  const [surveyData, setSurveyData] = useState({});
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // ── Follow-up Scheduling ────────────────────────────────────────────────────
  const [followUpModal, setFollowUpModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpLoading, setFollowUpLoading] = useState(false);

  // ── Draft persistence ───────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(`draft-${id}`);
    if (saved) setNewMessage(saved);
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`draft-${id}`, newMessage);
  }, [newMessage, id]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchVisible((v) => !v); }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); if (newMessage.trim()) handleSubmitMessage(); }
      if (e.key === "Escape") {
        setHideModal(null); setUnhideModal(null); setEditModal(null);
        setDeleteModal(null); setUploadModal(false); setShowAiModal(false);
        setReplyingTo(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [newMessage]);

  // ── Polling (paused when tab hidden) ───────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => { if (!document.hidden) fetchTickets(); }, 10000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tickets.length) fetchTickets();
    else if (!ticket) fetchSingleTicket(id);
  }, [id]);

  useEffect(() => {
    if (ticketFromStore?._id === id) setLocalTicket(ticketFromStore);
  }, [ticketFromStore, id]);

  useEffect(() => { if (id) fetchNotes(id); }, [id, fetchNotes]);

  useEffect(() => {
    api.get("/user/get-reviewers").then((r) => setAvailableUsers(r.data.users || [])).catch(() => {});
  }, []);

  useEffect(() => {
    getAIUsage().then(setAiUsageData).catch(() => {});
  }, [getAIUsage]);

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [localTicket?.comments]);

  // ── Derived: permissions ────────────────────────────────────────────────────
  const userId = user?._id || user?.id;
  const userRole = user?.role?.toUpperCase();
  const canModerate = ["REVIEWER", "MANAGER"].includes(userRole);
  const canChangeStatus = ticket && user && (["REVIEWER", "MANAGER"].includes(userRole) || ticket.assignedTo?._id === userId || ticket.assignedTo?.id === userId || ticket.assignedTo === userId);
  const canCreateInternalNotes = userRole === "MANAGER";
  const canProvideFeedback = useMemo(() => {
    if (!localTicket || !user) return false;
    if (["MANAGER", "REVIEWER"].includes(userRole)) return true;
    if (["CLIENT", "USER"].includes(userRole) && localTicket.user) {
      const ticketUserId = localTicket.user._id || localTicket.user.id;
      return ticketUserId === userId;
    }
    return false;
  }, [localTicket, user, userRole, userId]);

  const canUseAI = aiUsageData?.canUse && (aiUsageData?.remaining ?? 0) > 0;
  const planTier = aiUsageData?.planTier || "BASIC";
  const isClient = userRole === "CLIENT" || userRole === "USER";
  const canRate = isClient && ticket && (ticket.status === "Resolved" || ticket.status === "Closed");
  const canTakeSurvey = isClient && ticket && ticket.status === "Resolved" && !ticket.survey?.submittedAt;

  // ── Derived: messages ───────────────────────────────────────────────────────
  const allMessages = useMemo(() => {
    if (!localTicket?.comments?.length) return [];
    const map = new Map();
    localTicket.comments.forEach((comment) => {
      if (comment.isHidden && !canModerate) return;
      if (!map.has(comment._id)) map.set(comment._id, { ...comment, type: "comment", id: comment._id });
      comment.replies?.forEach((reply) => {
        if (!map.has(reply._id)) map.set(reply._id, { ...reply, type: "reply", commentId: comment._id, id: reply._id });
      });
    });
    return Array.from(map.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [canModerate, localTicket?.comments]);

  const filteredMessages = useMemo(() => {
    const q = messageSearch.trim().toLowerCase();
    if (!q) return allMessages;
    return allMessages.filter((m) => m.content?.toLowerCase().includes(q) || getUserDisplayName(m, { ...user, _id: userId, id: userId }).toLowerCase().includes(q));
  }, [allMessages, messageSearch, user, userId]);

  const groupedMessages = useMemo(() => {
    const groups = [];
    let current = null;
    filteredMessages.forEach((msg) => {
      const msgUid = msg.user?._id || msg.user?.id;
      const isSelf = !!(msgUid && userId && msgUid === userId);
      if (!current || current.isSelf !== isSelf) {
        if (current) groups.push(current);
        current = { isSelf, messages: [msg] };
      } else {
        current.messages.push(msg);
      }
    });
    if (current) groups.push(current);
    return groups;
  }, [filteredMessages, userId]);

  // ── Derived: audit ──────────────────────────────────────────────────────────
  const auditLogs = useMemo(() => {
    const logs = [];
    if (!ticket) return logs;
    logs.push({ id: "created", type: "created", title: "Ticket created", description: `#${ticket._id?.slice(-6).toUpperCase()} opened`, user: ticket.user, timestamp: ticket.createdAt });
    if (ticket.assignedTo) logs.push({ id: "assigned", type: "assigned", title: "Ticket assigned", description: `Assigned to ${ticket.assignedTo.name || ticket.assignedTo.username}`, user: ticket.assignedTo, timestamp: ticket.createdAt });
    (ticket.statusHistory || []).forEach((s, i) => logs.push({ id: `status-${i}`, type: "status_change", title: "Status updated", description: `${s.previousStatus} → ${s.newStatus}`, user: s.changedBy, timestamp: s.timestamp }));
    ticket.comments?.forEach((c) => {
      logs.push({ id: c._id, type: "comment", title: "Comment added", description: c.content?.slice(0, 80), user: c.user, timestamp: c.createdAt });
      c.replies?.forEach((r) => logs.push({ id: r._id, type: "reply", title: "Reply added", description: r.content?.slice(0, 80), user: r.user, timestamp: r.createdAt }));
    });
    if (ticket.files?.length) logs.push({ id: "files", type: "files", title: "Files attached", description: `${ticket.files.length} file(s) uploaded`, timestamp: ticket.updatedAt });
    (ticket.internalNotes || []).forEach((n, i) => logs.push({ id: `note-${i}`, type: "internal_note", title: "Internal note", description: n.content?.slice(0, 80), user: n.user, timestamp: n.createdAt }));
    return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [ticket]);

  const filteredAuditLogs = useMemo(() =>
    auditFilter === "all" ? auditLogs : auditLogs.filter((l) => l.type === auditFilter),
    [auditLogs, auditFilter]
  );

  const groupedAuditLogs = useMemo(() => {
    const groups = {};
    filteredAuditLogs.forEach((log) => {
      const key = formatReadableDate(log.timestamp);
      (groups[key] = groups[key] || []).push(log);
    });
    return groups;
  }, [filteredAuditLogs]);

  // ── Derived: notes ──────────────────────────────────────────────────────────
  const filteredNotes = useMemo(() => {
    const q = noteSearch.toLowerCase();
    let list = q ? notes.filter((n) => n.content?.toLowerCase().includes(q) || n.title?.toLowerCase().includes(q)) : notes;
    return [...list].sort((a, b) => {
      const aId = a._id || a.id;
      const bId = b._id || b.id;
      const ap = pinnedNotes.has(aId) ? 0 : 1;
      const bp = pinnedNotes.has(bId) ? 0 : 1;
      return ap - bp || new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [notes, noteSearch, pinnedNotes]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleStatusChange = async (nextStatus) => {
    if (!ticket || nextStatus === ticket.status) return;
    setStatusLoading(true);
    try {
      await updateTicket(id, { status: nextStatus });
      toast.success(`Status → ${nextStatus}`);
      fetchTickets();
    } catch { toast.error("Failed to update status"); }
    finally { setStatusLoading(false); }
  };

  const handleSubmitMessage = async () => {
    if (!localTicket || !newMessage.trim()) return;
    const content = newMessage.trim();
    const isFirst = !localTicket.comments?.length;
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempMsg = {
      _id: tempId, content, user: { _id: userId, id: userId, name: user?.name, username: user?.username, profilePhoto: getFullProfilePhoto(user?.profilePhoto), role: user?.role },
      createdAt: new Date().toISOString(), type: isFirst ? "comment" : "reply",
      ...(isFirst ? {} : { commentId: localTicket.comments[localTicket.comments.length - 1]?._id }),
    };
    setLocalTicket((prev) => {
      if (!prev) return prev;
      if (isFirst) return { ...prev, comments: [...(prev.comments || []), tempMsg] };
      const updated = [...prev.comments];
      const last = updated[updated.length - 1];
      if (last) last.replies = [...(last.replies || []), tempMsg];
      return { ...prev, comments: updated };
    });
    setNewMessage("");
    localStorage.removeItem(`draft-${id}`);
    setReplyingTo(null);
    setSendingMessage(true);
    try {
      if (isFirst) await submitFeedback(id, content);
      else {
        const latestComment = localTicket.comments[localTicket.comments.length - 1];
        await addReply(id, latestComment._id || latestComment.id, content);
      }
      fetchTickets();
    } catch (error) {
      setLocalTicket((prev) => {
        if (!prev) return prev;
        if (isFirst) return { ...prev, comments: prev.comments.filter((c) => c._id !== tempId) };
        const updated = [...prev.comments];
        const last = updated[updated.length - 1];
        if (last) last.replies = last.replies.filter((r) => r._id !== tempId);
        return { ...prev, comments: updated };
      });
      toast.error(error.response?.data?.message || "Failed to send");
    } finally { setSendingMessage(false); }
  };

  const handleHide = async (code) => {
    if (!code.trim() || !hideModal) return;
    setModerating(hideModal);
    try { await hideFeedback(id, hideModal, code); toast.success("Comment hidden"); fetchTickets(); setHideModal(null); }
    catch { toast.error("Failed to hide comment"); }
    finally { setModerating(null); }
  };

  const handleUnhide = async (code) => {
    if (!code.trim() || !unhideModal) return;
    setModerating(unhideModal);
    try { await unhideFeedback(id, unhideModal, code); toast.success("Comment visible"); fetchTickets(); setUnhideModal(null); }
    catch { toast.error("Failed to unhide comment"); }
    finally { setModerating(null); }
  };

  const handleEditMessage = async (msg, newContent) => {
    setModerating("edit");
    try {
      if (msg.type === "comment") await editComment(id, msg.id, newContent);
      else await editReply(id, msg.commentId, msg.id, newContent);
      toast.success("Message updated"); setEditModal(null); fetchTickets();
    } catch { toast.error("Failed to update"); }
    finally { setModerating(null); }
  };

  const handleDeleteMessage = async () => {
    if (!deleteModal || !localTicket) return;
    const msg = deleteModal;
    const prev = localTicket;
    setLocalTicket((t) => {
      if (!t) return t;
      if (msg.type === "comment") return { ...t, comments: t.comments.filter((c) => c._id !== msg.id) };
      const updated = [...t.comments];
      const target = updated.find((c) => c._id === msg.commentId);
      if (target) target.replies = target.replies.filter((r) => r._id !== msg.id);
      return { ...t, comments: updated };
    });
    setDeleteModal(null);
    setModerating("delete");
    toast.success("Message deleted");
    try {
      if (msg.type === "comment") await deleteComment(id, msg.id);
      else await deleteReply(id, msg.commentId, msg.id);
      fetchTickets();
    } catch { setLocalTicket(prev); toast.error("Failed to delete"); }
    finally { setModerating(null); }
  };

  const handleFileUpload = async (files) => {
    if (!files.length || !ticket) return;
    try { for (const f of files) await uploadFile(id, f); toast.success("Files uploaded"); setUploadModal(false); fetchTickets(); }
    catch { toast.error("Upload failed"); }
  };

  const handleSaveNote = async () => {
    if (!noteDraft.trim()) return;
    setSavingNote(true);
    try { await createNote(id, noteDraft.trim(), []); setNoteDraft(""); toast.success("Note saved"); fetchNotes(id); }
    catch (e) { toast.error(e?.response?.data?.message || "Failed to save note"); }
    finally { setSavingNote(false); }
  };

  const handleShareNote = async (noteId, users) => {
    if (!noteId) return;
    try { await shareNote(noteId, users); toast.success("Note sharing updated"); setShareModal(null); fetchNotes(id); }
    catch { toast.error("Failed to share note"); }
  };

  const handleCreateInternal = async () => {
    if (!ticket?.comments?.length) { toast.error("Add a conversation message first"); return; }
    if (!noteDraft.trim()) return;
    setModerating("intervention");
    try {
      const latest = ticket.comments[ticket.comments.length - 1];
      await managerIntervention(id, latest._id, noteDraft.trim());
      toast.success("Internal note added"); setNoteDraft(""); fetchTickets();
    } catch { toast.error("Failed to add internal note"); }
    finally { setModerating(null); }
  };

  const handleAIGenerate = async (prompt) => {
    if (!ticket?.comments?.length) { toast.error("No comment to reply to"); return; }
    setAiLoading(true);
    try {
      const latest = ticket.comments[ticket.comments.length - 1];
      await triggerAIResponse(id, latest._id || latest.id, prompt);
      toast.success("AI response generated"); setShowAiModal(false); fetchTickets();
    } catch (e) { toast.error(e.response?.data?.message || "AI generation failed"); }
    finally { setAiLoading(false); }
  };

  const handleSubmitRating = async () => {
    if (!rating || rating < 1 || rating > 5) return;
    setRatingLoading(true);
    try {
      await api.post(`/tickets/${id}/rating`, { rating, timestamp: new Date().toISOString() });
      toast.success("Thank you for your feedback!");
      setRatingSubmitted(true);
      setRatingModal(false);
      fetchTickets();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to submit rating"); }
    finally { setRatingLoading(false); }
  };

  const handleSubmitSurvey = async () => {
    setSurveyLoading(true);
    try {
      await api.post(`/tickets/${id}/survey`, { ...surveyData, submittedAt: new Date().toISOString() });
      toast.success("Survey submitted. Thank you!");
      setSurveySubmitted(true);
      setSurveyModal(false);
      fetchTickets();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to submit survey"); }
    finally { setSurveyLoading(false); }
  };

  const handleScheduleFollowUp = async () => {
    if (!followUpDate) return;
    setFollowUpLoading(true);
    try {
      await api.post(`/tickets/${id}/follow-up`, { scheduledDate: followUpDate, note: followUpNote });
      toast.success("Follow-up scheduled");
      setFollowUpModal(false);
      setFollowUpDate("");
      setFollowUpNote("");
      fetchTickets();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to schedule follow-up"); }
    finally { setFollowUpLoading(false); }
  };

  const handleRequestFollowUp = () => {
    if (!ticket?.comments?.length) { toast.error("Start a conversation first"); return; }
    setFollowUpModal(true);
  };

  const getRatingStats = () => {
    if (!ticket?.rating) return null;
    const r = ticket.rating;
    const config = RATING_STARS.find((s) => s.value === r.rating);
    return { ...r, config };
  };

  const exportAuditCSV = () => {
    const rows = [["Time", "Type", "Title", "Description", "User"]];
    auditLogs.forEach((l) => rows.push([
      new Date(l.timestamp).toISOString(), l.type, l.title,
      (l.description || "").replace(/,/g, ";"),
      l.user ? (l.user.name || l.user.username || "") : "",
    ]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `audit-${id}.csv`; a.click();
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return <FileImage size={18} className="text-primary" />;
    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) return <FileText size={18} className="text-primary" />;
    return <File size={18} className="text-primary" />;
  };

  const getAuditIcon = (type) => {
    const map = {
      created: <PlusCircle size={16} className="text-emerald-500" />,
      assigned: <UserPlus size={16} className="text-blue-500" />,
      status_change: <CheckCircle2 size={16} className="text-amber-500" />,
      comment: <MessageCircle size={16} className="text-primary" />,
      reply: <CornerUpLeft size={16} className="text-violet-500" />,
      files: <Paperclip size={16} className="text-orange-500" />,
      internal_note: <Lock size={16} className="text-rose-500" />,
    };
    return map[type] || <Clock3 size={16} className="text-muted-foreground" />;
  };

  // ── Loading / Not Found ─────────────────────────────────────────────────────
  if (!ticket && loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading ticket…</p>
        </div>
      </div>
    </DashboardLayout>
  );

  if (!ticket) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle size={40} className="mx-auto mb-3 text-destructive/60" />
          <p className="font-semibold text-foreground">Ticket not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary hover:underline">← Go back</button>
        </div>
      </div>
    </DashboardLayout>
  );

  const statusCfg = getStatusConfig(ticket.status);
  const priorityCfg = getPriorityConfig(ticket.urgency);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <DashboardLayout>
      {/* ── Top mobile bar ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20 gap-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors active:scale-95">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusCfg.dot}`} />
          <span className="text-sm font-bold text-foreground truncate">#{ticket._id.slice(-6).toUpperCase()}</span>
          <StatusPill status={ticket.status} className="hidden" />
        </div>
        <div className="flex items-center gap-1">
          <StatusPill status={ticket.status} className="text-[10px] px-1.5 py-0.5" />
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors active:scale-95">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* ── Mobile tab strip ── */}
      <div className="lg:hidden flex border-b border-border bg-card/80 backdrop-blur-md shrink-0">
        {[
          { id: "overview", label: "Overview", Icon: Grid2x2 },
          { id: "feedback", label: "Chat", Icon: MessageCircle },
          { id: "audit", label: "Audit", Icon: Clock3 },
          { id: "documents", label: "Docs", Icon: Paperclip },
        ].map(({ id: vid, label, Icon }) => {
          const badge = vid === "feedback" ? allMessages.length : vid === "audit" ? auditLogs.length : vid === "documents" ? getAttachments(ticket).length : null;
          return (
            <button key={vid} onClick={() => { setActiveView(vid); setMobilePane("main"); }}
              className={`flex-1 min-w-[72px] flex flex-col items-center gap-1 px-2 py-3 text-[10px] font-medium border-b-2 transition-all whitespace-nowrap ${activeView === vid ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon size={16} className={activeView === vid ? "text-primary" : ""} />
              <span>{label}</span>
              {badge != null && badge > 0 && (
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${activeView === vid ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </button>
          );
        })}
        <button onClick={() => setMobilePane(mobilePane === "notes" ? "main" : "notes")}
          className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 px-2 py-3 text-[10px] font-medium border-b-2 transition-all whitespace-nowrap ${mobilePane === "notes" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <Pencil size={16} className={mobilePane === "notes" ? "text-primary" : ""} />
          <span>Notes</span>
          {notes.length > 0 && (
            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${mobilePane === "notes" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
              {notes.length > 99 ? "99+" : notes.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Three-column layout ── */}
      <div className="flex h-[calc(100vh-180px)] lg:h-[calc(100vh-130px)] overflow-hidden">

        {/* ══ LEFT SIDEBAR ══════════════════════════════════════════════════════ */}
        <aside className={`
          ${mobileSidebarOpen ? "fixed inset-0 z-40 flex" : "hidden"} lg:flex
          flex-col w-full lg:flex-[0.8] xl:flex-[0.7] lg:min-w-[280px] h-full border-r border-border bg-card/95 backdrop-blur-sm overflow-hidden
        `}>
          {/* Mobile close */}
          {mobileSidebarOpen && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-border lg:hidden">
              <span className="text-sm font-semibold text-foreground">Ticket details</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary"><X size={16} /></button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Ticket ID + meta */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-0.5">Ticket</p>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">#{ticket._id.slice(-6).toUpperCase()}</h2>
                </div>
                <StatusPill status={ticket.status} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={11} />
                <span className="truncate">{ticket.location || "No location"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(ticket.createdAt)}</p>
            </div>

            {/* Assignee card */}
            {ticket.assignedTo && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border">
                <Avatar user={ticket.assignedTo} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{ticket.assignedTo.name || ticket.assignedTo.username}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{ticket.assignedTo.role || "Assigned"}</p>
                </div>
                <div className={`ml-auto w-2 h-2 rounded-full shrink-0 ${statusCfg.dot}`} />
              </div>
            )}

            {/* Priority + Type */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border">
                <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">Priority</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${priorityCfg.dot}`} />
                  <span className={`text-xs font-semibold ${priorityCfg.text}`}>{ticket.urgency || "Low"}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-secondary/40 border border-border">
                <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5">Type</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                    {getIssueTypeInitials(ticket.issueType)}
                  </span>
                  <span className="text-xs font-medium text-foreground truncate capitalize">{ticket.issueType || "Other"}</span>
                </div>
              </div>
            </div>

            {/* Status selector */}
            {canChangeStatus && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Change status</p>
                <Listbox value={ticket.status} onChange={handleStatusChange}>
                  <div className="relative">
                    <ListboxButton className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${statusCfg.pill} transition-all`}>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        {statusLoading ? "Updating…" : ticket.status}
                      </span>
                      <ChevronDown size={14} />
                    </ListboxButton>
                    <ListboxOptions className="absolute left-0 z-30 mt-1.5 w-full rounded-xl border border-border bg-card p-1 shadow-xl">
                      {STATUS_OPTIONS.map((s) => (
                        <ListboxOption key={s} value={s} disabled={s === ticket.status}
                          className={({ active, disabled }) => `cursor-pointer rounded-lg px-3 py-2 text-sm flex items-center gap-2 ${active ? "bg-secondary" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : "text-foreground"}`}>
                          <span className={`w-2 h-2 rounded-full ${getStatusConfig(s).dot}`} />
                          {s}
                          {s === ticket.status && <Check size={12} className="ml-auto text-primary" />}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>
            )}

            {/* Nav */}
            <nav className="space-y-0.5">
              {[
                { id: "overview",   label: "Overview",      Icon: Grid2x2,     badge: null },
                { id: "feedback",   label: "Conversation",  Icon: MessageCircle, badge: allMessages.length || null },
                { id: "audit",      label: "Audit trail",   Icon: Clock3,      badge: auditLogs.length || null },
                { id: "documents",  label: "Documents",     Icon: Paperclip,   badge: getAttachments(ticket).length || null },
              ].map(({ id: vid, label, Icon, badge }) => (
                <button key={vid} onClick={() => { setActiveView(vid); setMobileSidebarOpen(false); }}
                  className={`group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activeView === vid ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                  <Icon size={16} className="shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {badge != null && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${activeView === vid ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"}`}>{badge}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Close ticket */}
          <div className="p-5 border-t border-border">
            <button onClick={() => handleStatusChange("Closed")} disabled={ticket.status === "Closed" || statusLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-destructive/30">
              <X size={15} />
              Close ticket
            </button>
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        {mobileSidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

        {/* ══ CENTER ════════════════════════════════════════════════════════════ */}
        <main className={`flex-[2.5] flex flex-col min-h-0 min-w-0 bg-background h-full overflow-hidden ${mobilePane === "notes" ? "hidden lg:flex" : "flex"}`}>

          {/* ── Overview ────────────────────────────────────────────────────── */}
          {activeView === "overview" && (
            <>
              <div className="flex items-center justify-between px-5 lg:px-6 py-4 border-b border-border bg-card/50 shrink-0">
                <h3 className="font-semibold text-foreground">Overview</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Last update</span>
                  <span className="text-xs font-medium text-foreground">{formatRelativeTime(ticket.updatedAt)}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-5">
                {/* Subject card */}
                <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Subject</p>
                  <p className="font-semibold text-foreground text-base lg:text-lg leading-snug">{ticket.subject || ticket.issueType || "No subject"}</p>
                  {ticket.description && (
                    <>
                      <div className="h-px bg-border my-3" />
                      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Description</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
                    </>
                  )}
                </div>

                {/* Meta grid - responsive */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Submitted by", value: ticket.user?.name || ticket.user?.username || "—", icon: null },
                    { label: "Assigned to", value: ticket.assignedTo?.name || ticket.assignedTo?.username || "Unassigned", icon: null },
                    { label: "Date submitted", value: formatReadableDate(ticket.createdAt), icon: Calendar },
                    { label: "Last updated", value: formatRelativeTime(ticket.updatedAt), icon: Clock },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-border bg-card p-3 lg:p-4">
                      {Icon && <Icon size={12} className="text-muted-foreground mb-1" />}
                      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">{label}</p>
                      <p className="text-xs lg:text-sm font-medium text-foreground truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Stats cards - responsive grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{allMessages.length}</p>
                      <p className="text-[10px] text-muted-foreground">Messages</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Paperclip size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{getAttachments(ticket).length}</p>
                      <p className="text-[10px] text-muted-foreground">Documents</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Clock3 size={18} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{auditLogs.length}</p>
                      <p className="text-[10px] text-muted-foreground">Events</p>
                    </div>
                  </div>
                </div>

                {/* Conversation CTA */}
                <div className="rounded-2xl border border-border bg-card p-4 lg:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageCircle size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{allMessages.length} messages in conversation</p>
                      <p className="text-xs text-muted-foreground">Join the discussion</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveView("feedback")}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shrink-0 active:scale-95">
                    <MessageCircle size={15} /> View conversation
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                  {/* Feedback Summary Card */}
                  <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                          <Star size={14} className="text-white" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Feedback Summary</p>
                      </div>
                      {ticket.status === "Resolved" && !ticket.survey?.submittedAt && (
                        <button onClick={() => setSurveyModal(true)} className="text-xs text-primary hover:underline font-medium">
                          Take Survey
                        </button>
                      )}
                    </div>
                    
                    {ticket.rating ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-secondary/40 border border-border">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <Star key={v} size={20} className={v <= ticket.rating.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"} />
                          ))}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{RATING_STARS[ticket.rating.rating - 1]?.label || "Rated"}</p>
                          <p className="text-xs text-muted-foreground">{formatRelativeTime(ticket.rating.timestamp)}</p>
                        </div>
                      </div>
                    ) : ticket.status === "Resolved" ? (
                      <button onClick={() => setRatingModal(true)} className="w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/30 transition-all flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Star size={16} /> Rate this resolution
                      </button>
                    ) : (
                      <p className="text-xs text-muted-foreground italic text-center py-2">Feedback will be available after resolution</p>
                    )}

                    {ticket.survey?.submittedAt && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-3">Survey Results</p>
                        <div className="grid grid-cols-2 gap-2">
                          {SURVEY_QUESTIONS.filter((q) => q.type === "rating").map((q) => (
                            <div key={q.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                              <span className="text-xs text-muted-foreground truncate pr-2">{q.label.split(" ").slice(0, 2).join(" ")}</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((v) => (
                                  <div key={v} className={`w-2 h-2 rounded-full ${v <= (ticket.survey[q.id] || 0) ? "bg-primary" : "bg-border"}`} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {ticket.survey.recommend && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1 font-medium">
                            <ThumbsUp size={12} /> Would recommend our service
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Follow-up & Actions Card */}
                  <div className="rounded-2xl border border-border bg-card p-4 lg:p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Calendar size={14} className="text-blue-500" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Actions</p>
                    </div>
                    <div className="space-y-2">
                      <button onClick={handleRequestFollowUp} disabled={ticket.status === "Closed"}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <Calendar size={14} /> Schedule Follow-up
                      </button>
                      {ticket.followUp?.scheduledDate && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/8 border border-blue-500/20">
                          <Clock size={14} className="text-blue-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">Follow-up Scheduled</p>
                            <p className="text-[10px] text-muted-foreground">{formatReadableDate(ticket.followUp.scheduledDate)}</p>
                          </div>
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Conversation ─────────────────────────────────────────────────── */}
          {activeView === "feedback" && (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border bg-card/50 shrink-0 gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">Conversation</h3>
                  <span className="hidden sm:flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                  <span className="sm:hidden text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                    {allMessages.length} msgs
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {ticket.status === "Resolved" && !ticket.rating?.rating && (
                    <button onClick={() => setRatingModal(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors border border-amber-500/30 active:scale-95">
                      <Star size={12} className="fill-current" /> Rate
                    </button>
                  )}
                  <button onClick={() => setSearchVisible((v) => !v)}
                    className={`p-2 rounded-lg transition-colors ${searchVisible ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    <Search size={15} />
                  </button>
                </div>
              </div>

              {/* Search bar */}
              {searchVisible && (
                <div className="px-4 lg:px-5 py-2.5 border-b border-border bg-card/30 shrink-0">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input value={messageSearch} onChange={(e) => setMessageSearch(e.target.value)} placeholder="Search messages… (⌘K)"
                      className="w-full rounded-xl border border-border bg-card pl-9 pr-8 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" autoFocus />
                    {messageSearch && (
                      <button onClick={() => setMessageSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 py-4 space-y-4 lg:space-y-6">
                <div className="flex justify-center">
                  <span className="text-[10px] uppercase font-medium text-muted-foreground bg-card/60 px-3 py-1 rounded-full border border-border backdrop-blur-sm">
                    Opened {formatReadableDate(ticket.createdAt)} · {formatShortTime(ticket.createdAt)}
                  </span>
                </div>

                {groupedMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <MessageCircle size={36} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs mt-1">{messageSearch ? "No results found" : "Start the conversation below"}</p>
                  </div>
                )}

                {groupedMessages.map((group, gi) => {
                  const { isSelf, messages: msgs } = group;
                  const owner = getUserDisplayName(msgs[0], { ...user, _id: userId, id: userId });
                  return (
                    <div key={gi} className="space-y-1.5">
                      <div className={`flex items-center gap-2 px-1 ${isSelf ? "justify-end" : ""}`}>
                        {!isSelf && <Avatar user={msgs[0].user} size="xs" />}
                        <span className="text-[11px] text-muted-foreground font-medium">{isSelf ? "You" : owner}</span>
                        {isSelf && <Avatar user={msgs[0].user} size="xs" />}
                      </div>
                      {msgs.map((msg) => {
                        const isHidden = Boolean(msg.isHidden);
                        return (
                          <div key={`${msg.type}-${msg.id}`} className={`group flex items-end gap-2 ${isSelf ? "flex-row-reverse" : ""} max-w-[90%] sm:max-w-[85%] ${isSelf ? "ml-auto" : ""}`}>
                            <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"} gap-1`}>
                              <div className={`relative px-3 sm:px-4 py-2.5 rounded-2xl text-sm leading-relaxed transition-all ${
                                isHidden
                                  ? "bg-muted/50 border border-dashed border-border text-muted-foreground italic"
                                  : isSelf
                                  ? "bg-primary text-primary-foreground rounded-br-sm"
                                  : "bg-card border border-border text-foreground rounded-bl-sm"
                              }`}>
                                {isHidden && canModerate && <Lock size={10} className="inline mr-1.5 opacity-60" />}
                                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              </div>
                              <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isSelf ? "flex-row-reverse" : ""}`}>
                                <span className="text-[10px] text-muted-foreground">{formatShortTime(msg.createdAt)}</span>
                                <button onClick={() => { navigator.clipboard.writeText(msg.content || ""); toast.success("Copied"); }}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                  <Clipboard size={11} />
                                </button>
                                <button onClick={() => setReplyingTo({ id: msg.id, content: msg.content, author: getUserDisplayName(msg, { ...user, _id: userId, id: userId }) })}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                  <CornerUpLeft size={11} />
                                </button>
                                {isSelf && (
                                  <button onClick={() => setEditModal(msg)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                                    <Pencil size={11} />
                                  </button>
                                )}
                                {canModerate && msg.type === "comment" && (
                                  <button onClick={() => isHidden ? setUnhideModal(msg.id) : setHideModal(msg.id)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors">
                                    {isHidden ? <Eye size={11} /> : <EyeOff size={11} />}
                                  </button>
                                )}
                                <button onClick={() => setDeleteModal(msg)}
                                  className="w-6 h-6 flex items-center justify-center rounded-lg border border-destructive/20 bg-destructive/8 text-destructive hover:bg-destructive/15 transition-colors">
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              {canProvideFeedback ? (
                <div className="shrink-0 p-3 lg:p-4 border-t border-border bg-card/50">
                  {replyingTo && (
                    <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-primary/6 border border-primary/20">
                      <CornerUpLeft size={13} className="text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-medium text-primary">Replying to {replyingTo.author}</span>
                        <p className="text-xs text-muted-foreground truncate">{replyingTo.content}</p>
                      </div>
                      <button onClick={() => setReplyingTo(null)} className="text-muted-foreground hover:text-foreground shrink-0 p-1">
                        <X size={13} />
                      </button>
                    </div>
                  )}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden focus-within:border-primary/50 transition-colors shadow-sm">
                    <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} ref={textareaRef} rows={2} minRows={2}
                      placeholder="Type a message… (Enter to send)"
                      className="w-full bg-transparent px-4 py-3 text-sm text-foreground resize-none outline-none placeholder:text-muted-foreground"
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmitMessage(); } }} />
                    <div className="flex items-center justify-between px-3 pb-2.5 pt-1.5 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Listbox>
                          <div className="relative">
                            <ListboxButton className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                              <Paperclip size={16} />
                            </ListboxButton>
                            <ListboxOptions className="absolute left-0 z-20 mt-2 w-52 rounded-xl border border-border bg-card p-1 shadow-xl">
                              <ListboxOption value="view" onClick={() => setActiveView("documents")}
                                className={({ active }) => `flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${active ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
                                <Eye size={14} /><span>View documents</span>
                              </ListboxOption>
                              <ListboxOption value="device"
                                className={({ active }) => `flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${active ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
                                <label className="flex cursor-pointer w-full">
                                  <input type="file" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleFileUpload(Array.from(e.target.files)); }} />
                                  <span className="flex items-center gap-2.5"><Upload size={14} />Upload from device</span>
                                </label>
                              </ListboxOption>
                            </ListboxOptions>
                          </div>
                        </Listbox>
                        <span className={`text-[10px] transition-colors ml-1 ${newMessage.length > 1800 ? "text-destructive" : "text-muted-foreground"}`}>
                          {newMessage.length}/2000
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {canUseAI && (
                          <button onClick={() => setShowAiModal(true)} disabled={aiLoading}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium hover:from-blue-500/15 hover:to-violet-500/15 transition-all disabled:opacity-50 active:scale-95">
                            {aiLoading ? <Sparkles size={13} className="animate-spin" /> : <Sparkles size={13} />}
                            <span className="hidden sm:inline">AI</span>
                          </button>
                        )}
                        {!canUseAI && (
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground px-1.5" title={`Plan: ${planTier}`}>
                            <Zap size={11} /> {aiUsageData?.remaining ?? 0}
                          </span>
                        )}
                        <button onClick={handleSubmitMessage} disabled={sendingMessage || !newMessage.trim() || newMessage.length > 2000}
                          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-1.5 px-3 sm:px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm">
                          {sendingMessage ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={14} />}
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5 px-1 hidden sm:block">Shift+Enter for new line · Esc to cancel reply</p>
                </div>
              ) : (
                <div className="shrink-0 px-4 py-3 border-t border-border bg-amber-500/6">
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>Only ticket participants can send messages.</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Audit Trail ──────────────────────────────────────────────────── */}
          {activeView === "audit" && (
            <>
              <div className="flex items-center justify-between px-4 lg:px-5 py-3 border-b border-border bg-card/50 shrink-0 gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm">Audit trail</h3>
                  <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-medium">{filteredAuditLogs.length}</span>
                </div>
                <button onClick={exportAuditCSV} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors border border-border">
                  <Download size={13} /> <span className="hidden sm:inline">Export</span>
                </button>
              </div>

              {/* Filter pills */}
              <div className="flex gap-1.5 px-4 lg:px-5 py-3 border-b border-border overflow-x-auto shrink-0 scrollbar-hide">
                {["all", "comment", "status_change", "assigned", "files"].map((type) => (
                  <button key={type} onClick={() => setAuditFilter(type)}
                    className={`flex-none text-[10px] font-medium px-3 py-1.5 rounded-full border capitalize transition-colors whitespace-nowrap ${auditFilter === type ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    {type === "all" ? "All" : type.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4">
                {Object.entries(groupedAuditLogs).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Clock3 size={36} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No events</p>
                    <p className="text-xs mt-1">Activity will appear here</p>
                  </div>
                ) : Object.entries(groupedAuditLogs).map(([date, logs]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{date}</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="space-y-2">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-3 items-start">
                          <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                            {getAuditIcon(log.type)}
                          </div>
                          <div className="flex-1 min-w-0 bg-card rounded-xl border border-border p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-foreground">{log.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{log.description}</p>
                              </div>
                              <span className="text-[10px] text-muted-foreground shrink-0">{formatShortTime(log.timestamp)}</span>
                            </div>
                            {log.user && (
                              <div className="flex items-center gap-1.5 mt-2">
                                <Avatar user={log.user} size="xs" />
                                <span className="text-[10px] text-muted-foreground">{log.user.name || log.user.username}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Documents ────────────────────────────────────────────────────── */}
          {activeView === "documents" && (
            <>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card/50 shrink-0">
                <h3 className="font-semibold text-foreground text-sm">Documents</h3>
                <button onClick={() => setUploadModal(true)}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-xl transition-colors">
                  <Upload size={13} /> Upload
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {!getAttachments(ticket).length ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                      <FileCheck size={24} className="opacity-40" />
                    </div>
                    <p className="text-sm font-medium">No documents</p>
                    <p className="text-xs mt-1 mb-4">Attach files to this ticket</p>
                    <button onClick={() => setUploadModal(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                      <Upload size={14} /> Upload first file
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getAttachments(ticket).map((att, i) => {
                      const fileUrl = att.url || `${import.meta.env.VITE_API_URL}/uploads/${att.filename}`;
                      return (
                        <div key={i} className="flex gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors group">
                          <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                            {getFileIcon(att.filename)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{att.originalName || att.filename}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{att.size ? `${(att.size / 1024).toFixed(1)} KB` : "Unknown size"}</p>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5">
                              <Download size={11} /> View / download
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* ══ RIGHT SIDEBAR — NOTES ════════════════════════════════════════════ */}
        <aside className={`
          ${mobilePane === "notes" ? "flex" : "hidden"} lg:flex
          flex-col w-full lg:flex-[1] xl:flex-[0.9] lg:min-w-[320px] h-full overflow-hidden border-l border-border bg-card/95 backdrop-blur-sm
        `}>
          <div className="flex-1 flex flex-col min-h-0 p-4 lg:p-5 space-y-4 lg:space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Pencil size={14} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Personal Notes</h3>
              </div>
              <span className="text-[10px] text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border font-medium">{notes.length}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">Private notes visible only to you (unless shared).</p>

            {/* Note input */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden focus-within:border-primary/40 transition-colors">
              <textarea value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add a quick note…" rows={3}
                className="w-full bg-transparent px-4 py-3 text-sm text-foreground resize-none outline-none placeholder:text-muted-foreground" />
              <div className="flex items-center justify-end gap-2 px-3 py-2.5 border-t border-border/50">
                {canCreateInternalNotes && (
                  <button onClick={handleCreateInternal} disabled={!noteDraft.trim() || moderating === "intervention"}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground border border-border transition-colors disabled:opacity-40 flex items-center gap-1.5">
                    <Lock size={11} /> Internal
                  </button>
                )}
                <button onClick={handleSaveNote} disabled={savingNote || !noteDraft.trim()}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center gap-1.5">
                  <Check size={12} /> {savingNote ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            {/* Note search */}
            {notes.length > 2 && (
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input value={noteSearch} onChange={(e) => setNoteSearch(e.target.value)} placeholder="Search notes…"
                  className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" />
              </div>
            )}

            {/* Notes list */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Saved notes</p>
                {filteredNotes.length !== notes.length && (
                  <span className="text-[10px] text-primary">{filteredNotes.length} of {notes.length}</span>
                )}
              </div>
              {filteredNotes.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 rounded-xl border border-dashed border-border">
                  <Pencil size={24} className="mx-auto mb-2 opacity-30" />
                  <p>{noteSearch ? "No matching notes" : "No notes yet"}</p>
                  <p className="text-xs mt-1">Start adding notes above</p>
                </div>
              ) : filteredNotes.map((note) => {
                const noteId = note._id || note.id;
                const noteUserId = note.user?._id || note.user?.id;
                const colorCfg = NOTE_COLORS.find((c) => c.id === (noteColors[noteId] || "default")) || NOTE_COLORS[0];
                const isPinned = pinnedNotes.has(noteId);
                return (
                  <div key={noteId} className={`relative rounded-xl border p-4 ${colorCfg.bg} ${colorCfg.border} group transition-all`}>
                    {isPinned && <div className={`absolute top-0 left-4 w-px h-2 ${colorCfg.dot} opacity-80`} />}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {NOTE_COLORS.map((c) => (
                          <button key={c.id} onClick={() => setNoteColors((prev) => ({ ...prev, [noteId]: c.id }))}
                            className={`w-3.5 h-3.5 rounded-full ${c.dot} transition-transform ${noteColors[noteId] === c.id || (!noteColors[noteId] && c.id === "default") ? "scale-125 ring-2 ring-offset-1 ring-current" : "opacity-50 hover:opacity-80"}`}
                            title={c.id} />
                        ))}
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setPinnedNotes((prev) => { const next = new Set(prev); isPinned ? next.delete(noteId) : next.add(noteId); return next; })}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isPinned ? "text-amber-500 bg-amber-50 dark:bg-amber-950" : "text-muted-foreground hover:text-amber-500 hover:bg-secondary"}`}>
                          <Pin size={12} />
                        </button>
                        <button onClick={() => { setShareModal({ noteId, sharedWith: note.sharedWith || [] }); setSelectedUsers(note.sharedWith || []); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                          <Share2 size={12} />
                        </button>
                        {noteUserId === userId && (
                          <button onClick={() => { deleteNote(noteId); toast.success("Note deleted"); fetchNotes(id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    {noteUserId !== userId && note.user && (
                      <p className="text-[10px] font-medium text-primary mb-1.5">By {note.user?.name || note.user?.username}</p>
                    )}
                    <p className="text-sm text-foreground/80 leading-relaxed mb-3 whitespace-pre-wrap break-words">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">{formatRelativeTime(note.createdAt)}</p>
                      {note.sharedWith?.length > 0 && (
                        <span className="text-[10px] text-blue-500 flex items-center gap-1"><Share2 size={10} /> {note.sharedWith.length}</span>
                      )}
                    </div>
                    {note.sharedWith?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {note.sharedWith.map((uid) => {
                          const su = availableUsers.find((u) => (u._id || u.id) === uid);
                          return (
                            <span key={uid} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md text-[10px]">
                              {su?.name || su?.username || uid.slice(0, 6)}
                              <button onClick={() => unshareNote(noteId, uid).then(() => fetchNotes(id))} className="hover:text-red-500 transition-colors ml-0.5"><X size={9} /></button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer tags */}
          <div className="p-4 lg:p-5 border-t border-border">
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-3">Quick Info</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: ticket.location, icon: MapPin },
                { label: ticket.issueType, icon: null },
                { label: ticket.status, icon: null },
              ].filter((t) => t.label).map((tag) => (
                <span key={tag.label} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary border border-border rounded-lg text-[10px] font-medium text-muted-foreground">
                  {tag.icon && <tag.icon size={10} />}
                  {tag.label}
                </span>
              ))}
            </div>
            <button onClick={() => navigate(-1)} className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back to tickets
            </button>
          </div>
        </aside>
      </div>

      {/* ════════════════ MODALS ════════════════ */}
      {hideModal && (
        <CodeModal title="Hide comment" hint="SOLEASEHIDE" confirmLabel="Hide" confirmClass="bg-destructive hover:bg-destructive/90 text-white"
          onConfirm={handleHide} onClose={() => setHideModal(null)} loading={moderating === hideModal} />
      )}
      {unhideModal && (
        <CodeModal title="Unhide comment" hint="SOLEASEUNHIDE" confirmLabel="Unhide" confirmClass="bg-emerald-500 hover:bg-emerald-600 text-white"
          onConfirm={handleUnhide} onClose={() => setUnhideModal(null)} loading={moderating === unhideModal} />
      )}
      {editModal && (
        <EditModal content={editModal.content} onSave={(val) => handleEditMessage(editModal, val)} onClose={() => setEditModal(null)} loading={moderating === "edit"} />
      )}
      {deleteModal && (
        <ConfirmModal title="Delete message" description="This action cannot be undone." preview={deleteModal.content?.slice(0, 120)}
          confirmLabel="Delete" confirmClass="bg-destructive hover:bg-destructive/90 text-white"
          onConfirm={handleDeleteMessage} onClose={() => setDeleteModal(null)} loading={moderating === "delete"} />
      )}
      {uploadModal && (
        <UploadModal onUpload={handleFileUpload} onClose={() => setUploadModal(false)} loading={uploadLoading} progress={uploadProgress} onViewDocs={() => setActiveView("documents")} />
      )}
      {shareModal && (
        <ShareNoteModal availableUsers={availableUsers} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
          onClose={() => setShareModal(null)} onShare={() => handleShareNote(shareModal.noteId, selectedUsers)} currentSharedWith={shareModal.sharedWith} />
      )}
      {showAiModal && (
        <AIModal onGenerate={handleAIGenerate} onClose={() => setShowAiModal(false)} loading={aiLoading} aiUsageData={aiUsageData} planTier={planTier} />
      )}

      {/* ── Rating Modal ────────────────────────────────────────────────────────── */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setRatingModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Rate Your Experience</h3>
                <p className="text-xs text-muted-foreground mt-0.5">How satisfied are you with this ticket?</p>
              </div>
              <button onClick={() => setRatingModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                <X size={16} />
              </button>
            </div>
            {!canRate ? (
              <div className="text-center py-6">
                <ThumbsDown size={32} className="mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Ratings are available after the ticket is resolved.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-2 mb-6">
                  {RATING_STARS.map((star) => {
                    const Icon = star.icon;
                    const isActive = rating >= star.value;
                    const isHovered = ratingHover >= star.value;
                    return (
                      <button key={star.value} onClick={() => setRating(star.value)} onMouseEnter={() => setRatingHover(star.value)} onMouseLeave={() => setRatingHover(0)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isActive || isHovered ? `${star.bg} ${star.border} border` : "hover:bg-secondary"}`}>
                        <Icon size={24} className={`${isActive || isHovered ? star.color : "text-muted-foreground"}`} />
                      </button>
                    );
                  })}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm font-medium text-foreground mb-5">{RATING_STARS[rating - 1].label}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button onClick={() => setRatingModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">Cancel</button>
                  <button onClick={handleSubmitRating} disabled={!rating || ratingLoading} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50">
                    {ratingLoading ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Survey Modal ────────────────────────────────────────────────────────── */}
      {surveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSurveyModal(false)}>
          <div className="w-full max-w-lg max-h-[90vh] rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Resolution Survey</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Help us improve by sharing your experience</p>
              </div>
              <button onClick={() => setSurveyModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-5">
              {SURVEY_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-foreground mb-2">{q.label}</p>
                  {q.type === "rating" && (
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button key={v} onClick={() => setSurveyData((prev) => ({ ...prev, [q.id]: v }))}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${surveyData[q.id] === v ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "yesno" && (
                    <div className="flex gap-2">
                      {["Yes", "No"].map((opt) => (
                        <button key={opt} onClick={() => setSurveyData((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${surveyData[q.id] === opt ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "text" && (
                    <textarea value={surveyData[q.id] || ""} onChange={(e) => setSurveyData((prev) => ({ ...prev, [q.id]: e.target.value }))} placeholder="Your comments (optional)"
                      rows={3} className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary resize-none" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setSurveyModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">Skip</button>
              <button onClick={handleSubmitSurvey} disabled={surveyLoading} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50">
                {surveyLoading ? "Submitting..." : "Submit Survey"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Follow-up Modal ────────────────────────────────────────────────────── */}
      {followUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setFollowUpModal(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Schedule Follow-up</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Set a reminder for this ticket</p>
              </div>
              <button onClick={() => setFollowUpModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Follow-up Date</label>
                <input type="datetime-local" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Note (optional)</label>
                <textarea value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} placeholder="Add a note for the follow-up..."
                  rows={2} className="w-full rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setFollowUpModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={handleScheduleFollowUp} disabled={!followUpDate || followUpLoading} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors disabled:opacity-50">
                {followUpLoading ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FeedbackComponent;