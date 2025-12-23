import { ContactUs } from "../models/contacts.model.js";

export const submitContactForm = async (req, res) => {
    const { fullName, email, message } = req.body;

    try {
        // Check if the fields are empty
        if(!fullName || !email || !message){
            throw new Error("All Fields are required for one to proceed");
        };

        //Object for the contact
        const contactUs = new ContactUs({
            fullName,
            email,
            message,
        });

        //Save the contact us form
        await contactUs.save();

        //return a response
        res.status(200).json({
            success: true,
            message: "Thank you for reach out to us!",
            data: contactUs,
        })
    } catch (error) {
        console.log("Error is filling the contact us page", error);
        res.status(400).json({ success: false, message: error.message });
    }
}