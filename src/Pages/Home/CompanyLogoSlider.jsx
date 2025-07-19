import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function CompanyLogoSlider() {

    const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0e/Meta_Platforms_Inc._logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/9/98/Adobe_logo.svg"
];


    // Duplicate for seamless loop
    const loopLogos = [...logos, ...logos];
    

    return (
        <section className="relative py-10 overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Section Title */}
            <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                Trusted by Leading Companies
            </h2>

            {/* Scroll Container */}
            <div className="relative flex overflow-hidden group">
                {/* Moving track */}
                <motion.div
                    className="flex gap-10 sm:gap-16 md:gap-24"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 20, // slow & smooth
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    // Pause animation on hover
                    whileHover={{ animationPlayState: "paused" }}
                >
                    {loopLogos.map((logo, idx) => (
                        <img
                            key={idx}
                            src={logo}
                            alt={`Company logo ${idx}`}
                            className="h-8 sm:h-10 md:h-14 lg:h-16 object-contain filter dark:invert-0"
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
