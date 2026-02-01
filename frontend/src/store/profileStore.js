import { create } from "zustand";
import api from "../lib/axios.js";
import { useAuthenticationStore } from "../store/authStore.js";

export const useProfileStore = create((set) => ({
    personal: {},
    contact: {},
    loading: false,
    error: null,
    getProfile: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/profile/get-profile");
            set({
                personal: res.data.personal,
                contact: res.data.contact,
                loading: false,
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            set({
                loading: false,
                error: error.response?.data?.message || "Failed to load profile",
            })
        }
    },
    putProfile: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put("/profile/put-profile", data);
            set({
                personal: res.data.personal,
                contact: res.data.contact,
                loading: false,
            });
            const { setUser } = useAuthenticationStore.getState();
            if (res.data.user) {
                setUser(res.data.user);
            }
            return res.data;
        } catch (error) {
            console.error("Error updating a profile:", error);
            set({
                loading: false,
                error: error.response?.data?.message || "Update failed",
            })
        }
    },
}));