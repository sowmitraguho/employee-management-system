import React from "react";
import { motion } from "framer-motion";

import works from '../../assets/Lottifiles/projects.json';
import Lottie from "lottie-react";

// Fake project data
const projects = [
    {
        id: 1,
        title: "E-commerce Customer Service",
        category: "Web Application",
        description:
            "A complete e-commerce customer service platform with order management, chat support, and feedback collection.",
        image: "https://i.postimg.cc/0y8hSfPJ/customer-care-webpage-interface-word.jpg",
    },
    {
        id: 2,
        title: "Delivery Tracking System",
        category: "Machine Learning",
        description:
            "AI-powered mobile application that tracks delivery vehicles in real-time using GPS and machine learning.",
        image: "https://i.postimg.cc/Zn4xQwf8/red-delivery-car-deliver-express-shipping-fast-delivery-background-3d-rendering-illustration.jpg",
    },
    {
        id: 3,
        title: "Cost Management App",
        category: "Full-Stack Project",
        description:
            "A comprehensive cost management application for businesses.",
        image: "https://i.postimg.cc/XqvvzhNj/19197149.jpg",
    },
    {
        id: 4,
        title: "Security System",
        category: "Full-Stack Project",
        description:
            "A service-sharing platform with authentication, booking, and real-time delivery tracking system.",
        image: "https://i.postimg.cc/BZxWrNPs/smart-car-security-unlock-via-smartphone-digital-remix.jpg",
    },
];


export default function ProjectsSection() {
    return (
        <section id="projects" className="py-16 px-8 bg-gray-50 dark:bg-gray-900 ">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row  gap-12">
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                        Recently Completed Projects
                    </h2>
                    <p className="max-w-xl mx-auto lg:mx-0 mb-24 text-gray-600 dark:text-gray-300 text-lg">
                        Take a look at some of the projects we have successfully delivered
                        for our clients across different domains.
                    </p>
                    <div className="w-full">
                        <Lottie animationData={works} loop={true} />
                    </div>

                </div>
                <div className="flex-1">
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                        {projects.map(({ id, title, description, image, category }) => (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: id * 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg cursor-pointer"
                            >
                                <img
                                    src={image}
                                    alt={title}
                                    className="rounded-md mb-4 w-full h-40 object-cover"
                                />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {title}
                                </h3>
                                <span className="text-sm text-indigo-500 font-medium">
                                    {category}
                                </span>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    {description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
