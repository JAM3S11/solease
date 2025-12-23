//backend>src>models>contactuser.model.js
import mongoose from "mongoose";

const contactUserSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address : {
        type: String,
        default: "",
    },
    country: {
        type: String,
        default: "",
    },
    county: {
        type: String,
        default: "",
    },
    telephoneNumber: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export const ContactUserProfile = mongoose.model("ContactUserProfile", contactUserSchema);