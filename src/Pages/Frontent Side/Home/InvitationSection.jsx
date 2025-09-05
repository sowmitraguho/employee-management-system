import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/Components/ui/button";
import Lottie from "lottie-react";
import animationData from "../../../assets/Lottifiles/user.json";
import { useNavigate } from "react-router";

const InvitationSection = ({data}) => {
    const navigation = useNavigate();
    console.log('data of invitation', data)
    return (
        <section className="min-h-screen md:px-20 py-16 px-8 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100 p-12 rounded-lg max-w-7xl mx-auto shadow-lg">
                {/* Left content */}
            <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl "
            >
                <h1 className="text-2xl md:text-5xl font-bold text-gray-800 leading-tight dark:text-gray-100">
                    Get the <span className="text-indigo-600">Business IT Service</span>
                    That Your Company Needs
                </h1>
                <p className="my-4 text-gray-600 text-lg">
                    Manage employees, monitor workflows, track payments, and boost your
                    company's productivity with our all-in-one solution.
                </p>
                <Button onClick={() => navigation("/contactus")} className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 text-lg font-semibold px-8 py-6">
                    Get Started Now
                </Button>
            </motion.div>

            {/* Right animated image */}
            <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full md:w-1/3 mt-10 md:mt-0"
            >
                <Lottie animationData={animationData} loop={true} />
            </motion.div>
            </div>
        </section>
    );
};

export default InvitationSection;