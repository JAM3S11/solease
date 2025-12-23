// controllers/ticket.controller.js
import { Ticket } from "../models/tickets.model.js";
import { User } from "../models/user.model.js";

// Create a ticket
export const createTicket = async (req, res) => {
    const { location, issueType, subject, description, urgency } = req.body;

    try {
        // Check if the fields are empty
        if(!location || !issueType || !subject || !description || !urgency){
            return res.status(400).json({
                success: false,
                message: "Kindly fill in all the details"
            });
        };

        // Object of the ticket
        const ticket = await Ticket({
            user: req.user._id, // taken from the protect middleware
            location,
            issueType,
            subject,
            description,
            urgency,
        });

        // Save the ticket
        await ticket.save();

        // return a response
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket,
        })
    } catch (error) {
        console.log("Error creating the ticket", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating ticket"
        })
    }
};

// Get tickets
export const getTickets = async (req, res) => {
    try {
        let query = {};
        let sort = { createdAt: -1 }; // default: newest first

        if(req.user.role === "Client"){
            // Clients only views his own tickets
            query.user = req.user._id;
            sort = { createdAt: -1 }; // still sort by newest first
        } else if(req.user.role === "IT Support"){
            // Views tickets assigned and not assigned to him
            query = {
                $or: [
                    { assignedTo: req.user._id }, // tickets assigned to them
                    { assignedTo: { $exists: false } }, // views all unassigned tickets
                    { assignedTo: null }, // explicitly null
                ]
            };
            // Sort IT Support tickets by urgency first, then status, then newest
            sort = { 
                urgency: -1,    // Critical > High > Medium > Low
                status: 1,      // Open < In Progress < Resolved < Closed
                createdAt: -1   // Newest first
            };

            // IT Support only sees tickets assigned to them
            // query.assignedTo = req.user._id;
        } else if(req.user.role === "Service Desk" || req.user.role === "Manager"){
            // They will see all tickets
            query = {}
            // Sort by urgency then newest
            sort = { 
                urgency: -1,
                createdAt: -1
            };
        };

        // Fetch tickets
        const tickets = await Ticket.find(query)
        .populate("user", "username role")
        .populate("assignedTo", "username role")
        .select("location issueType subject description urgency status createdAt updatedAt")
        .sort(sort);

        res.status(200).json({
            success: true,
            tickets
        });
    } catch (error) {
        console.log("Error fetching the tickets", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching tickets"
        });
    }
};

// Update tickets
export const updateTicket = async (req, res) => {
    const { id } = req.params; // Ticket id from the url
    const { assignedTo, status } = req.body;

    try {
        const ticket = await Ticket.findById(id);

        // If the ticket is not found
        if(!ticket){
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        };

        // Admin and Service desk can assign ticket to IT support
        if((req.user.role === "Manager" || req.user.role === "Service Desk") && assignedTo){
            // Get the IT support user
            const itSupportUser = await User.findOne({ _id: assignedTo, role: "IT Support" });
            //If not found
            if(!itSupportUser){
                return res.status(400).json({
                    success: false,
                    message: "Assigned user must be an IT Support"
                });
            };
            ticket.assignedTo = assignedTo;
        };

        // IT Support can be the only one to update the status of the assigned tickets
        if(req.user.role === "IT Support"){
            if(!ticket.assignedTo || ticket.assignedTo.toString() !== req.user._id.toString()){
                return res.status(403).json({ 
                    success: false, 
                    message: "You are not assigned to this ticket" 
                });
            };
            if(status){
                ticket.status = status;
            };
        };

        // Service desk has the role to update a ticket status
        if((req.user.role === "Service Desk") && status){
            ticket.status = status;
        }

        // Save the ticket
        await ticket.save();

        // return a response
        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket,
        });
    } catch (error) {
        console.log("Error updating a ticket", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error while updating ticket" 
        });
    }
};