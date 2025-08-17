import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import aboutAnim from "../../assets/Lottifiles/about.json";
import { FaUsers, FaBullseye, FaLightbulb } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import axios from "axios";

export default function AboutUs() {
  const [team, setTeam] = useState([]);

  // Fetch team members
  useEffect(() => {
    const fetchTeam = async () => {
      try {
       // const res = await fetch(`${import.meta.env.VITE_API_URL}/users`); // Replace with your API
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/teams`);
        console.log(res.data);
        setTeam(res.data);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-8">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 md:px-16">
        <motion.div
          className="md:w-1/2 space-y-4"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            About <span className="text-blue-600 dark:text-blue-400">Us</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We're a team of passionate professionals dedicated to building
            world-class employee management solutions.
          </p>
        </motion.div>
        <motion.div
          className="md:w-1/2 max-w-md mt-6 md:mt-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Lottie animationData={aboutAnim} loop />
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-6 md:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
        >
          <FaUsers className="text-blue-600 dark:text-blue-400 text-3xl mb-3" />
          <h3 className="text-lg font-semibold">Who We Are</h3>
          <p className="text-gray-600 dark:text-gray-400">
            A team of innovators building next-gen workflow solutions.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
        >
          <FaBullseye className="text-green-600 dark:text-green-400 text-3xl mb-3" />
          <h3 className="text-lg font-semibold">Our Mission</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Simplify payroll, workflow, and employee management.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800"
        >
          <FaLightbulb className="text-yellow-500 dark:text-yellow-400 text-3xl mb-3" />
          <h3 className="text-lg font-semibold">Our Vision</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Empower organizations with intuitive tools.
          </p>
        </motion.div>
      </section>

      {/* Meet Our Team - Slider */}
      <section className="py-16 px-6 md:px-24">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
            Our amazing team members who make everything possible.
          </p>
        </motion.div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {team.map((member) => (
            <SwiperSlide key={member._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center"
              >
                <img
                  src={member.imageUrl || "https://via.placeholder.com/150"}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {member.Designation || "Team Member"}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Call To Action */}
      <section className="py-12 text-center bg-blue-600 dark:bg-blue-500 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold">Want to join our team?</h2>
          <p className="mt-2 text-lg">We're always looking for talented people.</p>
          <a
            href="/contactus"
            className="inline-block mt-4 bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200"
          >
            Contact Us
          </a>
        </motion.div>
      </section>
    </div>
  );
}
