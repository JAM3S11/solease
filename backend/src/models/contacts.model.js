// models/contactUs.model.js
import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export const ContactUs = mongoose.model("ContactUs", contactUsSchema);
