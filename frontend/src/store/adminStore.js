// frontend/src/store/adminStore.js
import { create } from "zustand";
import api from "../lib/utils";

const useAdminStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/admin/users");
      set({ users: res.data.users, loading: false });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({ error: "Failed to fetch users", loading: false });
    }
  },

  // Update role & status
  updateUserRoleAndStatus: async (username, role, status) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/admin/users/${username}`, { role, status });
      set((state) => ({
        users: state.users.map((u) =>
          u.username === username ? res.data.user : u
        ),
        loading: false
      }));
    } catch (err) {
      console.error("Error updating user:", err);
      set({ error: "Failed to update user", loading: false });
    }
  },

  // delete user
  deleteUser: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.delete(`/admin/users/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        loading: false
      }));
    } catch (error) {
      console.error("Error deleting user: ", error);
      set({ error: "Failed to delete user", loading: false })
    }
  },

  // create reviewer
  createReviewer: async (username, name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/create-reviewer", { username, name, email, password });
      set((state) => ({
        users: [...state.users, res.data.user],
        loading: false
      }));
      return res.data;
    } catch (error) {
      console.error("Error creating reviewer:", error);
      set({ error: "Failed to create reviewer", loading: false });
      throw error;
    }
  }
}));

export default useAdminStore;