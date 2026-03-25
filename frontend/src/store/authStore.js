import { create } from "zustand";
import api from "../lib/axios.js";
import useNotificationStore from "./notificationStore.js";


export const useAuthenticationStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true, //till checking authentication finishes
    message: null,
    passwordUpdateRequired: false,
    passwordUpdateDeadline: null,
    
    setUser: (updateUserDetail) => set({ user: updateUserDetail }),
    setPasswordUpdateRequired: (required, deadline) => set({ 
        passwordUpdateRequired: required, 
        passwordUpdateDeadline: deadline 
    }),
    signup: async (username, name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/signup", { username, name, email, password });
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isLoading: false, 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error signing up", 
                isLoading: false 
            });
            throw error;
        }
    },
    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/verify-email", { code });
            set({
                // user: response.data.user,
                // isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error verifying email",
                isLoading: false,
            });
            throw error;
        }
    },
    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/login", { username, password });
            const { passwordUpdateRequired, passwordUpdateDeadline, user } = response.data;
            
            set({
                isAuthenticated: true,
                user: user,
                error: null,
                isLoading: false,
                passwordUpdateRequired: passwordUpdateRequired || false,
                passwordUpdateDeadline: passwordUpdateDeadline || null,
            });
            useNotificationStore.getState().fetchNotifications();
            // Return full response data including passwordUpdateRequired
            return { user, passwordUpdateRequired, passwordUpdateDeadline };
        } catch (error) {
            const message = error.response?.data?.message || "Error logging in";
            set({
                error: message,
                isLoading: false,
            });

            throw new Error(message); // ✅ propagate exact message to LoginForm
        }
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await api.post("/auth/logout");
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: "Error logging out",
                isLoading: false,
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await api.get("/auth/check-auth");
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
            useNotificationStore.getState().fetchNotifications();
            return response.data.user;
        } catch (error) {
            set({
                user: null,
                error: null,
                isCheckingAuth: false,
                isAuthenticated: false,
            });
            // Treat "not logged in" as a normal state; don't surface as an unhandled promise.
            return null;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post("/auth/forgot-password", { email });
            set({
                message: response.data.message,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error sending reset password email"
            });
            throw error;
        }
    },

    resetPassword: async (token, password, oldPassword) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password, oldPassword });
            set({
                message: response.data.message,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error reseting password"
            });
            throw error;
        }
    },

    updateActivity: async () => {
        try {
            await api.post("/admin/activity");
        } catch (error) {
            console.error("Error updating activity:", error);
        }
    },
}))