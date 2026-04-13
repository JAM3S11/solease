import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#060b18] text-white/[0.48] pt-20 pb-10 border-t border-white/[0.06] font-sans relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tighter">
            SOLEASE<span className="text-blue-500">.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs">
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
                className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/[0.48] hover:bg-blue-600 hover:text-white transition-all duration-300 border border-white/[0.06] hover:border-transparent"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.02em] mb-6">Navigation</h3>
          <ul className="space-y-3 text-sm font-medium">
            {["Home", "About", "Services", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`${link.toLowerCase()}`}
                  className="text-white/[0.48] hover:text-blue-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.02em] mb-6">Offerings</h3>
          <ul className="space-y-3 text-sm font-normal">
            <li className="text-white/[0.48] hover:text-blue-400 transition-colors cursor-default">Ticket Management</li>
            <li className="text-white/[0.48] hover:text-blue-400 transition-colors cursor-default">Analytics & Reporting</li>
            <li className="text-white/[0.48] hover:text-blue-400 transition-colors cursor-default">User Management</li>
            <li className="text-white/[0.48] hover:text-blue-400 transition-colors cursor-default">Support & Maintenance</li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.02em] mb-6">Get In Touch</h3>
          <div className="space-y-3 text-sm font-normal">
            <p className="flex items-start gap-3 text-white/[0.48]">
              <span className="text-blue-400">📍</span>
              Crossways, Westlands
            </p>
            <p className="flex items-center gap-3 text-white/[0.48]">
              <span className="text-blue-400">📞</span>
              +254 700 123 456
            </p>
            <p className="flex items-center gap-3 text-white/[0.48]">
              <span className="text-blue-400">📧</span>
              support@solease.com
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-white/[0.06] mt-16 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium uppercase tracking-wide text-white/[0.38]">
          <p>&copy; {new Date().getFullYear()} SOLEASE. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-blue-400 transition">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-blue-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;