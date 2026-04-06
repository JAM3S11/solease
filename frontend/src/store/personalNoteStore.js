import { create } from "zustand";
import api from "../lib/axios";

const usePersonalNoteStore = create((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/personal-notes", { params: { ticketId } });
      set({ notes: res.data.notes, loading: false });
    } catch (error) {
      console.error("Error fetching notes:", error);
      set({ error: error.response?.data?.message || "Error fetching notes", loading: false });
    }
  },

  createNote: async (ticketId, content, sharedWith = []) => {
    try {
      console.log("personalNoteStore: Creating note with", { ticketId, contentLength: content.length, sharedWith });
      const res = await api.post("/personal-notes", { ticketId, content, sharedWith });
      console.log("personalNoteStore: Create note response:", res.data);
      set((state) => ({ notes: [res.data.note, ...state.notes] }));
      return res.data.note;
    } catch (error) {
      console.error("Error creating note:", error.response || error);
      throw error;
    }
  },

  updateNote: async (noteId, content, sharedWith) => {
    try {
      const res = await api.put(`/personal-notes/${noteId}`, { content, sharedWith });
      set((state) => ({
        notes: state.notes.map((n) => (n.id === noteId ? res.data.note : n))
      }));
      return res.data.note;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    try {
      await api.delete(`/personal-notes/${noteId}`);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== noteId)
      }));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },

  shareNote: async (noteId, sharedWith) => {
    try {
      console.log("personalNoteStore: Sharing note", { noteId, sharedWith });
      const res = await api.put(`/personal-notes/${noteId}/share`, { sharedWith });
      console.log("personalNoteStore: Share response:", res.data);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === noteId ? res.data.note : n))
      }));
      return res.data.note;
    } catch (error) {
      console.error("Error sharing note:", error.response || error);
      throw error;
    }
  },

  unshareNote: async (noteId, userIdToRemove) => {
    try {
      console.log("personalNoteStore: Unsharing note", { noteId, userIdToRemove });
      const res = await api.put(`/personal-notes/${noteId}/unshare`, { userId: userIdToRemove });
      console.log("personalNoteStore: Unshare response:", res.data);
      set((state) => ({
        notes: state.notes.map((n) => (n.id === noteId ? res.data.note : n))
      }));
      return res.data.note;
    } catch (error) {
      console.error("Error unsharing note:", error.response || error);
      throw error;
    }
  },

  clearNotes: () => {
    set({ notes: [], error: null });
  }
}));

export default usePersonalNoteStore;