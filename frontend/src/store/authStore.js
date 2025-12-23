import { create } from "zustand";
import api from "../lib/utils.js";


export const useAuthenticationStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true, //till checking authentication finishes
    message: null,
    
    setUser: (updateUserDetail) => set({ user: updateUserDetail }),
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
                user: response.data.user,
                isAuthenticated: true,
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
            set({
                isAuthenticated: true,
                user: response.data.user,
                error: null,
                isLoading: false,
            });
            return response.data.user;
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
            })
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
            })
        } catch (error) {
            set({
                error: null,
                isCheckingAuth: false,
                isAuthenticated: false,
            });
            throw error;
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
    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password });
            set({
                message: response.data.message,
                isLoading: false,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Error reseting password",
            });
            throw error;
        }
    },
}))