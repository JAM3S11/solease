import { create } from "zustand";
import api from "../lib/axios.js";
import { useAuthenticationStore } from "../store/authStore.js";

// Helper function to get full URL for profile photos
const getFullPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    // Use environment variable for API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    // Remove trailing slash if present
    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    return `${baseUrl}${photoPath}`;
};

export const useProfileStore = create((set, get) => ({
    personal: {},
    contact: {},
    availability: {
        timezone: "UTC",
        workingHoursStart: "09:00",
        workingHoursEnd: "17:00",
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        preferredContactTime: "business-hours",
        autoResponseEnabled: true,
        responseDelayMinutes: 0,
    },
    availabilityStatus: {
        isAvailable: false,
        isWorkingDay: false,
        isWithinWorkingHours: false,
        currentDay: "",
        currentTime: "",
        userTimezone: "UTC",
        isOnline: false,
    },
    loading: false,
    error: null,
    profilePhoto: null,
    profilePhotoLoading: false,
    availabilityLoading: false,
    getProfile: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/profile/get-profile");
            const profilePhoto = getFullPhotoUrl(res.data.personal?.profilePhoto);
            
            set({
                personal: res.data.personal,
                contact: res.data.contact,
                profilePhoto: profilePhoto,
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
            
            // Safely get setUser from auth store
            try {
                const authState = useAuthenticationStore.getState();
                if (authState && typeof authState.setUser === 'function' && res.data.user) {
                    authState.setUser(res.data.user);
                }
            } catch (err) {
                console.warn("Warning: Could not update auth store:", err);
            }
            
            return res.data;
        } catch (error) {
            console.error("Error updating a profile:", error);
            set({
                loading: false,
                error: error.response?.data?.message || "Update failed",
            });
            throw error;
        }
    },
    uploadProfilePhoto: async (file) => {
        set({ profilePhotoLoading: true, error: null });
        try {
            console.log("[ProfileStore] uploadProfilePhoto called with:", file?.name, file?.type, file?.size);
            
            if (!file) {
                throw new Error("No file provided");
            }
            
            const formData = new FormData();
            formData.append("profilePhoto", file);
            
            console.log("[ProfileStore] Sending request to /profile/upload-photo");
            
            const res = await api.post("/profile/upload-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            console.log("[ProfileStore] Upload response status:", res.status);
            console.log("[ProfileStore] Upload response data:", res.data);
            
            if (!res.data.success) {
                throw new Error(res.data.message || "Upload failed");
            }
            
            const fullPhotoUrl = getFullPhotoUrl(res.data.profilePhoto);
            console.log("[ProfileStore] Full photo URL:", fullPhotoUrl);
            
            // Update both profilePhoto and personal with the full URL
            set((state) => ({
                profilePhoto: fullPhotoUrl,
                personal: state.personal ? { ...state.personal, profilePhoto: fullPhotoUrl } : { profilePhoto: fullPhotoUrl },
                profilePhotoLoading: false,
            }));
            
            // Update user in auth store with full URL
            useAuthenticationStore.setState((state) => ({ 
                user: state.user ? { ...state.user, profilePhoto: fullPhotoUrl } : null 
            }));
            
            return { ...res.data, profilePhoto: fullPhotoUrl };
        } catch (error) {
            console.error("[ProfileStore] Error uploading profile photo:", error);
            console.error("[ProfileStore] Error response:", error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || "Failed to upload photo";
            set({
                profilePhotoLoading: false,
                error: errorMessage,
            });
            throw new Error(errorMessage);
        }
    },
    deleteProfilePhoto: async () => {
        set({ profilePhotoLoading: true, error: null });
        try {
            const res = await api.delete("/profile/delete-photo");
            
            // Update both profilePhoto and personal
            set((state) => ({
                profilePhoto: null,
                personal: state.personal ? { ...state.personal, profilePhoto: null } : {},
                profilePhotoLoading: false,
            }));
            
            // Update user in auth store
            useAuthenticationStore.setState((state) => ({ 
                user: state.user ? { ...state.user, profilePhoto: null } : null 
            }));
            
            return res.data;
        } catch (error) {
            console.error("Error deleting profile photo:", error);
            set({
                profilePhotoLoading: false,
                error: error.response?.data?.message || "Failed to delete photo",
            });
            throw error;
        }
    },
    getAvailability: async () => {
        set({ availabilityLoading: true, error: null });
        try {
            const res = await api.get("/profile/availability");
            set({
                availability: res.data.availability,
                availabilityLoading: false,
            });
            return res.data.availability;
        } catch (error) {
            console.error("Error fetching availability:", error);
            set({
                availabilityLoading: false,
                error: error.response?.data?.message || "Failed to load availability settings",
            });
            return null;
        }
    },
    putAvailability: async (data) => {
        set({ availabilityLoading: true, error: null });
        try {
            const res = await api.put("/profile/availability", data);
            set({
                availability: res.data.availability,
                availabilityLoading: false,
            });
            return res.data;
        } catch (error) {
            console.error("Error updating availability:", error);
            set({
                availabilityLoading: false,
                error: error.response?.data?.message || "Failed to update availability",
            });
            throw error;
        }
    },
    checkAvailabilityStatus: async () => {
        try {
            const res = await api.get("/profile/availability/status");
            set({
                availabilityStatus: res.data.status,
            });
            return res.data.status;
        } catch (error) {
            console.error("Error checking availability status:", error);
            return null;
        }
    },
}));