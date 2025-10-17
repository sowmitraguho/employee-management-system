import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import contactAnim from "../../../assets/Lottifiles/Email.json"; // your lottie file
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-6">
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-16">
        <motion.div
          className="md:w-1/2 space-y-4"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in <span className="text-blue-600 dark:text-blue-400">Touch</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We’d love to hear from you! Reach out anytime and we’ll get back to you as soon as possible.
          </p>
        </motion.div>
        <motion.div
          className="md:w-1/3 max-w-md mt-6 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Lottie animationData={contactAnim} loop />
        </motion.div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
        >
          <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-3xl mb-3" />
          <h3 className="text-lg font-semibold">Our Location</h3>
          <p className="text-gray-600 dark:text-gray-400">123 Business Street, City, Country</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
        >
          <FaPhoneAlt className="text-green-600 dark:text-green-400 text-3xl mb-3" />
          <h3 className="text-lg font-semibold">Call Us</h3>
          <p className="text-gray-600 dark:text-gray-400">+880 1234 567 890</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
        >
          <FaEnvelope className="text-red-600 dark:text-red-400 text-3xl mb-3" />
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-gray-600 dark:text-gray-400">info@example.com</p>
        </motion.div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 md:px-24">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" required />
                  <Input placeholder="Your Email" type="email" required />
                </div>
                <Input placeholder="Subject" required />
                <Textarea placeholder="Your Message" rows={5} required />
                <div className="text-center">
                  <Button className="px-6 py-2 text-lg">
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
        </motion.div>
      </section>
    </div>
  );
}
