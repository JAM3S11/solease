import { create } from "zustand";
import api from "../lib/axios";

const useTicketStore = create((set) => ({
    tickets: [],
    loading: false,
    error: null,
    uploadLoading: false,
    uploadError: null,
    uploadProgress: 0,
    
    // Fetch tickets
    fetchTickets: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/ticket/get-ticket");
            set({ tickets: res.data.tickets, loading: false });
        } catch (error) {
            console.error("Error fetching tickets:", error);
            set({ error: error.message || "Error fetching tickets", loading: false });
        }
    },

    // Fetch single ticket
    fetchSingleTicket: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/ticket/get-ticket");
            const ticket = res.data.tickets.find(t => t._id === id);
            if (ticket) {
                set((state) => ({
                    tickets: [...state.tickets.filter(t => t._id !== id), ticket],
                    loading: false
                }));
                return ticket;
            } else {
                set({ error: "Ticket not found", loading: false });
                return null;
            }
        } catch (error) {
            console.error("Error fetching single ticket:", error);
            set({ error: error.message || "Error fetching ticket", loading: false });
            return null;
        }
    },
    
    // Create ticket
    createTicket: async (ticketData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post("/ticket/create-ticket", ticketData);
            set((state) => ({
                tickets: [ ...state.tickets, res.data.ticket ],
                loading: false,
            }));
        } catch (error) {
            console.error("Failed to create a ticket:", error);
            set({
                error: error.response?.data?.message || "Failed to create a ticket",
                loading: false,
            });
            throw error;
        }
    },
    
    // Update ticket status (for automation or admin purposes only)
    updateTicket: async (id, updateData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ticket/${id}/status`, updateData);
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === id ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.ticket;
        } catch (error) {
            console.error("Failed to update ticket:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: `/ticket/${id}/status`,
                updateData
            });
            set({
                error: error.response?.data?.message || "Failed to update ticket",
                loading: false,
            });
            return null;
        }
    },
    
    // Submit feedback/comment on resolved ticket
    submitFeedback: async (ticketId, content) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post(`/ticket/${ticketId}/feedback`, { content });
            const updatedTicket = res.data.ticket;
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? updatedTicket : ticket
                ),
                loading: false,
            }));

            return res.data.ticket;
        } catch (error) {
            console.log("Error submitting feedback:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: `/ticket/${ticketId}/feedback`,
                content
            });
            set({
                error: error.response?.data?.message || "Error submitting feedback",
                loading: false,
            });
            throw error;
        }
    },
    
    // Add reply to feedback/comment
    addReply: async (ticketId, commentId, content) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post(`/ticket/${ticketId}/comment/${commentId}/reply`, { content });
            const updatedTicket = res.data.ticket;
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? updatedTicket : ticket
                ),
                loading: false,
            }));

            return res.data.comment;
        } catch (error) {
            console.log("Error adding reply:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: `/ticket/${ticketId}/comment/${commentId}/reply`,
                content
            });
            set({
                error: error.response?.data?.message || "Error adding reply",
                loading: false,
            });
            throw error;
        }
    },
    
    // Edit reply
    editReply: async (ticketId, commentId, replyId, content) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ticket/${ticketId}/comment/${commentId}/reply/${replyId}`, { content });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.reply;
        } catch (error) {
            console.error("Error editing reply:", error);
            set({
                error: error.response?.data?.message || "Error editing reply",
                loading: false,
            });
            throw error;
        }
    },
    
    // Delete reply
    deleteReply: async (ticketId, commentId, replyId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.delete(`/ticket/${ticketId}/comment/${commentId}/reply/${replyId}`);
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
        } catch (error) {
            console.error("Error deleting reply:", error);
            set({
                error: error.response?.data?.message || "Error deleting reply",
                loading: false,
            });
        }
    },
    
    // Hide feedback (Reviewer only)
    hideFeedback: async (ticketId, commentId, unhideCode) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ticket/${ticketId}/comment/${commentId}/hide`, { unhideCode });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.comment;
        } catch (error) {
            console.error("Error hiding feedback:", error);
            set({
                error: error.response?.data?.message || "Error hiding feedback",
                loading: false,
            });
            throw error;
        }
    },
    
    // Unhide feedback (Reviewer only)
    unhideFeedback: async (ticketId, commentId, unhideCode) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ticket/${ticketId}/comment/${commentId}/unhide`, { unhideCode });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.comment;
        } catch (error) {
            console.error("Error unhiding feedback:", error);
            set({
                error: error.response?.data?.message || "Error unhiding feedback",
                loading: false,
            });
            throw error;
        }
    },
    
    // View hidden feedback with code (Manager only)
    viewHiddenFeedback: async (ticketId, commentId, code) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post(`/ticket/${ticketId}/comment/${commentId}/view-hidden`, { code });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.comment;
        } catch (error) {
            console.error("Error viewing hidden feedback:", error);
            set({
                error: error.response?.data?.message || "Error viewing hidden feedback",
                loading: false,
            });
            throw error;
        }
    },
    
    // Approve hidden feedback for Manager view (Reviewer only)
    approveHiddenForManager: async (ticketId, commentId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ticket/${ticketId}/comment/${commentId}/approve`);
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.comment;
        } catch (error) {
            console.error("Error approving hidden feedback:", error);
            set({
                error: error.response?.data?.message || "Error approving hidden feedback",
                loading: false,
            });
            throw error;
        }
    },
    
    // Manager intervention - add reply to conversation
    managerIntervention: async (ticketId, commentId, content) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post(`/ticket/${ticketId}/comment/${commentId}/manager-intervention`, { content });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.comment;
        } catch (error) {
            console.error("Error adding manager intervention:", error);
            set({
                error: error.response?.data?.message || "Error adding manager intervention",
                loading: false,
            });
            throw error;
        }
    },
    
    // AI-triggered reply (for automation)
    triggerAIResponse: async (ticketId, commentId, aiContent) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post(`/ticket/${ticketId}/comment/${commentId}/ai-response`, { aiContent });
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                loading: false,
            }));
            return res.data.comment;
        } catch (error) {
            console.error("Error triggering AI response:", error);
            set({
                error: error.response?.data?.message || "Error triggering AI response",
                loading: false,
            });
            throw error;
        }
    },

    // Upload file to ticket
    uploadFile: async (ticketId, file) => {
        set({ uploadLoading: true, uploadError: null, uploadProgress: 0 });
        try {
            const formData = new FormData();
            formData.append("attachment", file);

            const res = await api.post(`/ticket/${ticketId}/attachment`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    set({ uploadProgress: progress });
                }
            });

            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket._id === ticketId ? res.data.ticket : ticket
                ),
                uploadLoading: false,
                uploadProgress: 100
            }));

            return res.data.attachment;
        } catch (error) {
            console.error("Error uploading file:", error);
            set({
                uploadError: error.response?.data?.message || "Error uploading file",
                uploadLoading: false,
                uploadProgress: 0
            });
            throw error;
        }
    }
}));

export default useTicketStore;
