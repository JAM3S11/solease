import { create } from "zustand";
import api from "../lib/utils";

const useTicketStore = create((set) => ({
    tickets: [],
    loading: false,
    error: null,

    // Fetch tickets
    fetchTickets: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/ticket/get-ticket");
            set({ tickets: res.data.tickets, loading: false });
        } catch (error) {
            console.error("Error fetching tickets:", error);
            set({ error: "Error fetching tickets", loading: false });
        }
    },
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
        }
    },
    updateTicket: async (id, updateData) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/ticket/update-ticket/${id}`, updateData);

            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                ticket._id === id ? res.data.ticket : ticket
                ),
                loading: false,
            }));

            return res.data.ticket;
        } catch (error) {
            console.error("Failed to update ticket:", error);
            set({
                error: error.response?.data?.message || "Failed to update ticket",
                loading: false,
            });
            return null;
        }
    },
}));

export default useTicketStore;