import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { FaUserTie, FaUsers, FaBuilding } from "react-icons/fa";

const staticPricingPlans = [
  {
    id: 1,
    title: "Basic",
    price: "$19/mo",
    icon: <FaUserTie className="text-indigo-500 w-10 h-10" />,
    features: ["Up to 10 Employees", "Basic Workflow Tracking", "Email Support"],
    highlighted: false,
  },
  {
    id: 2,
    title: "Professional",
    price: "$49/mo",
    icon: <FaUsers className="text-green-500 w-10 h-10" />,
    features: [
      "Up to 50 Employees",
      "Advanced Workflow & Payroll",
      "Priority Support",
    ],
    highlighted: true,
  },
  {
    id: 3,
    title: "Enterprise",
    price: "$99/mo",
    icon: <FaBuilding className="text-pink-500 w-10 h-10" />,
    features: [
      "Unlimited Employees",
      "Dedicated Manager",
      "24/7 Premium Support",
    ],
    highlighted: false,
  },
];
    

export default function PricingSection() {
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Amazing Pricing Package For Professional Solutions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 mb-12 max-w-2xl mx-auto">
          Choose the best plan that fits your team’s needs and unlock the full
          power of seamless employee management.
        </p>

        {/* Carousel */}
        <Slider {...settings}>
          {staticPricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="px-4"
            >
              {/* Card Container */}
              <div
                className={`flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl shadow-lg p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                {/* LEFT SECTION: Icon + Name + Price */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-semibold">{plan.title}</h3>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      plan.highlighted ? "text-white" : "text-indigo-600"
                    }`}
                  >
                    {plan.price}
                  </p>
                </div>

                {/* RIGHT SECTION: Features + Button */}
                <div className="flex flex-col gap-4 text-left">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 ${
                          plan.highlighted
                            ? "text-indigo-100"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button with LEFT-TO-RIGHT hover animation */}
                  <button className="relative overflow-hidden mt-4 px-6 py-3 font-medium rounded-lg text-white z-10 bg-gradient-to-r from-indigo-500 to-purple-500 hover:before:translate-x-0">
                    <span className="relative z-10">Choose Plan</span>
                    {/* Hover overlay */}
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 translate-x-full transition-transform duration-500 ease-out hover:translate-x-0"></span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
