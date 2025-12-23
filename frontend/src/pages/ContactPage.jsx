import React, { useState } from "react";
import api from "../lib/utils.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [ formData, setFormData ] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [ isSending, setIsSending ] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the fields are empty
    if(!formData.fullName || !formData.email || !formData.message){
      toast.error("All fields are required!");
      return;
    };

    try {
      setIsSending(true);
      await api.post("/contact", formData);
      setFormData({
        fullName: "",
        email: "",
        message: "",
      })

      // Toast message
      toast.success("Thank you for reaching out to us! We shall get back to you!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're navigating too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to fill contact form");
      }
    } finally{
      setIsSending(false);
    }
  }
  return (
    <div id="contact" className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      {/* Heading */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Get in Touch</h1>
        <p className="text-gray-600 text-lg">
          Have questions or need support? Our team is here to help. 
          Reach out to us and we’ll respond as soon as possible.
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
        {/* Contact Form */}
        <div className="card bg-white shadow-xl p-6 mx-2 md:mx-0">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Send us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered input-secondary w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="suport@solease.com"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Message</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="textarea textarea-bordered w-full h-32"
              ></textarea>
            </div>

            <button className="btn btn-primary btn-md rounded-md w-full" disabled={isSending}>
              {isSending ? "Sending.." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card bg-white shadow-md p-6 mx-2 md:mx-0">
            <h2 className="text-xl font-bold text-blue-600 mb-3">Contact Information</h2>
            <p className="text-gray-600 mb-2">
              Feel free to reach out via phone, email, or visit our office.
            </p>
            <ul className="space-y-2">
              <li>
                📍 <span className="font-semibold">Address:{" "}</span>GPO, Huduma Center, Nairobi
              </li>
              <li>
                📞 <span className="font-semibold">Phone:{" "}</span> +254 700 123 456
              </li>
              <li>
                📧 <span className="font-semibold">Email:{" "}</span> support@solease.com
              </li>
            </ul>
          </div>

          <div className="card bg-white shadow-md p-6 mx-2 md:mx-0">
            <p className="card-title mb-4 text-blue-600">Availability</p>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <p className="text-base text-black">Status</p>
              <p className="text-gray-500 text-xs bg-green-400 p-1">Free Trial Available</p>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base mt-2">
              <p className="text-base text-black">Demo activity</p>
              <p className="text-gray-500 text-sm">Same day scheduling</p>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base mt-2">
              <p className="text-base text-black">Support hours</p>
              <p className="text-gray-500 text-sm">24/7 Enterprise Solution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;