import React from "react";
//import { FiUsers, FiSettings, FiDollarSign, FiClipboard } from "react-icons/fi";
import { motion } from "framer-motion";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FiUsers, FiSettings, FiDollarSign, FiClipboard, FiShield, FiBarChart2 } from "react-icons/fi";
import { MdOutlineCampaign } from "react-icons/md";
import { FaPencilRuler } from "react-icons/fa";

const services = [
  {
    id: 5,
    icon: <MdOutlineCampaign className="text-blue-500 w-12 h-12" />,
    title: "Digital Marketing",
    description:
      "Promote services online, manage campaigns, and track marketing performance insights.",
  },
  {
    id: 6,
    icon: <FiShield className="text-red-500 w-12 h-12" />,
    title: "Security System",
    description:
      "Protect sensitive data, ensure secure access, and safeguard the system from threats.",
  },
  {
    id: 7,
    icon: <FaPencilRuler className="text-purple-500 w-12 h-12" />,
    title: "UI/UX Design",
    description:
      "Design intuitive interfaces, improve user experience, and build engaging applications.",
  },
  {
    id: 8,
    icon: <FiBarChart2 className="text-orange-500 w-12 h-12" />,
    title: "Data Analysis",
    description:
      "Analyze business data, generate reports, and gain valuable insights for decisions.",
  },
];

// Simple rotating cube component for 3D illustration
function RotatingCube() {
  return (
    <mesh rotation={[0.6, 0.8, 0]}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial color="#6366F1" metalness={0.5} roughness={0.1} />
    </mesh>
  );
}

export default function ServicesSection() {
  return (
    <section className="py-16 px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center  gap-12">
        {/* Left side: Services */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Our Services
          </h2>
          <p className="max-w-xl mx-auto lg:mx-0 mb-12 text-gray-600 dark:text-gray-300 text-lg">
            Explore the wide range of features we offer to help manage your
            organization effectively and efficiently.
          </p>

          <div className="grid gap-8 sm:grid-cols-2">
            {services.map(({ id, icon, title, description }) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: id * 0.15 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg cursor-pointer"
              >
                <div className="mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side: 3D illustration */}
        <div className="hidden md:flex flex-1 w-full max-w-md h-80 sm:h-96 mt-24">
          <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <RotatingCube />
            <OrbitControls enableZoom={false} />
          </Canvas>
        
        </div>
      </div>
    </section>
  );
}
