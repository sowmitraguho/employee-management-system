import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Lottie from "lottie-react";
import footerAnim from "../../../assets/Lottifiles/services.json"; 
import { CompanyLogo } from "../../../Components/CompanyLogo/CompanyLogo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-4 md:grid-cols-2">
        
        {/* 1️⃣ Brand & 3D Animation */}
        <div>
          <CompanyLogo/>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            We Provide Smart Business Solutions
          </p>

          {/* 3D Animation */}
          <div className="mt-6 w-40 h-40">
            <Lottie animationData={footerAnim} loop={true} />
          </div>
        </div>

        {/*  Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#services" className="hover:text-indigo-400 transition">Services</a></li>
            <li><a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a></li>
            <li><a href="#testimonials" className="hover:text-indigo-400 transition">Testimonials</a></li>
            <li><a href="/contactus" className="hover:text-indigo-400 transition">Contact</a></li>
          </ul>
        </div>

        {/*  Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="flex items-center gap-3 mb-3">
            <FaEnvelope className="text-indigo-400" /> support@apptechx.com
          </div>
          <div className="flex items-center gap-3 mb-3">
            <FaPhoneAlt className="text-green-400" /> +880 125650
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-pink-400" /> Dhaka, Bangladesh
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {[
              { icon: <FaFacebookF />, color: "hover:text-blue-500" },
              { icon: <FaTwitter />, color: "hover:text-sky-400" },
              { icon: <FaLinkedinIn />, color: "hover:text-blue-400" }
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ scale: 1.2 }}
                className={`text-gray-400 text-xl transition ${item.color}`}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Divider + Bottom Text */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} EmployeeManager. All Rights Reserved.
      </div>
    </footer>
  );
}
