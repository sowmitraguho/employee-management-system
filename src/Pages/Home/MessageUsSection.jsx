import React, { useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Lottie from "lottie-react";
import contactAnim from "../../../public/Email.json";

export default function MessageUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900"
    >
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 sm:grid-cols-1 items-center"
          >
            {/* LEFT: Heading + Contact Info */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                Message Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                Got questions or feedback? Reach out to us anytime. We’d love to
                hear from you!
              </p>

              {/* ✅ Contact Info + Lottie side-by-side on large, stacked on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                {/* Contact info */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FaEnvelope className="text-indigo-500" />
                    <span className="truncate">support@company.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FaPhoneAlt className="text-green-500" /> +1 (234) 567-890
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <FaMapMarkerAlt className="text-pink-500" />
                    123 Business St, New York, USA
                  </div>
                </div>

                {/* ✅ Lottie Animation - responsive size */}
                <div className="flex justify-center sm:justify-end">
                  <div className="w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72">
                    <Lottie animationData={contactAnim} loop={true} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Contact Form */}
            <motion.form
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  placeholder="Write your message..."
                  rows="4"
                  className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              {/* ✅ Submit button with hover animation */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                type="submit"
              >
                <span className="relative z-10">Send Message</span>
                {/* Hover shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out opacity-30"></span>
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
