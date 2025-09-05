import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "HR Manager, TechCorp",
    feedback:
      "This Employee Management System has streamlined our workflow. Payroll and task tracking are now effortless!",
    rating: 5,
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "Operations Lead, InnovateX",
    feedback:
      "We love the role-based access control. It ensures security and makes managing employees a breeze.",
    rating: 4,
    img: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Priya Das",
    role: "CEO, SoftBridge",
    feedback:
      "The UI is clean and intuitive. I can monitor the entire team’s workflow in real-time. Highly recommended!",
    rating: 5,
    img: "https://i.pravatar.cc/100?img=3",
  },
];

export default function TestimonialSection() {
  return (
    <section id='testimonials' className="py-20 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Hear from businesses who transformed their employee workflow with our system.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md text-left relative"
            >
              {/* Quote icon */}
              <FaQuoteLeft className="absolute top-4 left-4 text-indigo-500 text-2xl opacity-30" />

              {/* Feedback */}
              <p className="text-gray-700 dark:text-gray-300 mt-6 mb-4">
                {t.feedback}
              </p>

              {/* Star Rating */}
              <div className="flex mb-4 text-yellow-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
