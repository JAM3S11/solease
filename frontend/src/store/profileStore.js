import { create } from "zustand";
import api from "../lib/axios.js";
import { useAuthenticationStore } from "../store/authStore.js";

// Helper function to get full URL for profile photos
const getFullPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    // Default to localhost:5001 for development
    return `http://localhost:5001${photoPath}`;
};

export const useProfileStore = create((set, get) => ({
    personal: {},
    contact: {},
    loading: false,
    error: null,
    profilePhoto: null,
    profilePhotoLoading: false,
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
            const formData = new FormData();
            formData.append("profilePhoto", file);
            
            const res = await api.post("/profile/upload-photo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            const fullPhotoUrl = getFullPhotoUrl(res.data.profilePhoto);
            console.log("Uploaded photo URL:", fullPhotoUrl);
            
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
            console.error("Error uploading profile photo:", error);
            set({
                profilePhotoLoading: false,
                error: error.response?.data?.message || "Failed to upload photo",
            });
            throw error;
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
}));