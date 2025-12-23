import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">SOLEASE</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Empowering your business with modern IT solutions to streamline workflows and enhance support efficiency.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-blue-400 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#home" className="hover:text-blue-400 transition">Home</a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-400 transition">About</a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-400 transition">Services</a>
            </li>
            {/* <li>
              <a href="#testimonials" className="hover:text-blue-400 transition">Testimonials</a>
            </li> */}
            <li>
              <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Ticket Management</li>
            <li>Analytics & Reporting</li>
            <li>User Management</li>
            <li>Support & Maintenance</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-sm">📍 GPO, Huduma Center, Nairobi</p>
          <p className="text-sm">📞 +254 700 123 456</p>
          <p className="text-sm">📧 support@solease.com</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SOLEASE. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;