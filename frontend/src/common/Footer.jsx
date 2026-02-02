import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#fafbfc] text-gray-600 pt-20 pb-10 mt-24 border-t border-gray-300/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
            SOLEASE<span className="text-blue-600">.</span>
          </h2>
          <p className="text-sm leading-relaxed font-medium max-w-xs">
            Empowering your business with modern IT solutions to streamline workflows and enhance support efficiency for every user.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: FaFacebookF, href: "#" },
              { icon: FaTwitter, href: "#" },
              { icon: FaLinkedinIn, href: "#" },
              { icon: FaGithub, href: "https://github.com/JAM3S11/solease.git" },
            ].map((social, i) => (
              <a 
                key={i}
                href={social.href} 
                className="w-10 h-10 rounded-xl bg-gray-100/5 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-gray-300/10"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-[0.02em] mb-8">Navigation</h3>
          <ul className="space-y-4 text-sm font-semibold">
            {["Home", "About", "Services", "Contact"].map((link) => (
              <li key={link}>
                <a 
                  href={`#${link.toLowerCase()}`} 
                  className="hover:text-blue-500 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-[0.02em] mb-8">Offerings</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="hover:text-blue-500 transition-colors cursor-default">Ticket Management</li>
            <li className="hover:text-blue-500 transition-colors cursor-default">Analytics & Reporting</li>
            <li className="hover:text-blue-500 transition-colors cursor-default">User Management</li>
            <li className="hover:text-blue-500 transition-colors cursor-default">Support & Maintenance</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-[0.02em] mb-8">Get In Touch</h3>
          <div className="space-y-4 text-sm font-medium">
            <p className="flex items-start gap-3">
              <span className="text-blue-500">📍</span> 
              Crossways, Westlands
            </p>
            <p className="flex items-center gap-3">
              <span className="text-blue-500">📞</span> 
              +254 700 123 456
            </p>
            <p className="flex items-center gap-3">
              <span className="text-blue-500">📧</span> 
              support@solease.com
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-gray-300/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-wide text-gray-600">
          <p>&copy; {new Date().getFullYear()} SOLEASE. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-gray-500 transition">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-gray-500 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;