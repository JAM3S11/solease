// frontend/src/store/adminStore.js
import { create } from "zustand";
import api from "../lib/axios";

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
        users: state.users.filter((user) => user._id !== id && user.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error("Error deleting user: ", error);
      set({ error: "Failed to delete user", loading: false });
      throw error;
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
  },

  // Active users
  activeUsers: [],
  activeUsersLoading: false,

  // Fetch active users
  fetchActiveUsers: async () => {
    set({ activeUsersLoading: true, error: null });
    try {
      const res = await api.get("/admin/active-users");
      set({ activeUsers: res.data.activeUsers, activeUsersLoading: false });
    } catch (err) {
      console.error("Error fetching active users:", err);
      set({ activeUsersLoading: false });
    }
  },

  // Update user activity (call periodically from frontend)
  updateActivity: async () => {
    try {
      await api.post("/admin/activity");
    } catch (err) {
      console.error("Error updating activity:", err);
    }
  },

// Mark user as offline
  markOffline: async () => {
    try {
      await api.post("/admin/offline");
    } catch (err) {
      console.error("Error marking offline:", err);
    }
  },

  // Plan tier management
  planUsers: [],
  planUsersLoading: false,

  // Fetch all users plan usage
  fetchPlanUsers: async () => {
    set({ planUsersLoading: true, error: null });
    try {
      const res = await api.get("/admin/users/plan-usage");
      set({ planUsers: res.data.users, planUsersLoading: false });
    } catch (err) {
      console.error("Error fetching plan users:", err);
      set({ planUsersLoading: false });
    }
  },

  // Update user plan tier
  updateUserPlanTier: async (username, planTier) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/admin/users/${username}/plan-tier`, { planTier });
      set((state) => ({
        planUsers: state.planUsers.map((u) =>
          u.username === username ? res.data.user : u
        ),
        users: state.users.map((u) =>
          u.username === username ? res.data.user : u
        ),
        loading: false
      }));
      return res.data;
    } catch (err) {
      console.error("Error updating plan tier:", err);
      set({ error: "Failed to update plan tier", loading: false });
      throw err;
    }
  }
}));

export default useAdminStore;