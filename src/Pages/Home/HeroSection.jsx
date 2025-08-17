import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Particles from "../../Components/BackgroundAnimation/Particles";

//import heroImg from ""; // Replace with your image

export default function HeroSection() {
  
  return (
    <section className="
    relative overflow-hidden
    bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-400  
    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
  ">
      {/* Background Animation */} 
      <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Wave Shape at Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-24 md:h-32 lg:h-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1920 200"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            d="M0,96L80,85.3C160,75,320,53,480,69.3C640,85,800,139,960,165.3C1120,192,1280,192,1440,165.3C1600,139,1760,75,1840,42.7L1920,10L1920,200H1840C1760,200,1600,200,1440,200C1280,200,1120,200,960,200C800,200,640,200,480,200C320,200,160,200,80,200H0Z"
          />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center justify-between relative z-10">
        {/* Left Text with Animation */}
        <motion.div
          className="text-center md:text-left max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            We Provide{" "}
            <span className="text-yellow-300">Smart Business</span> Solutions
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Grow your business with our powerful, tech-driven workforce solutions.
          </p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 text-lg font-semibold px-8 py-6">
              <a href="#projects">Learn More</a>
            </Button>
            <Button
              variant="outline"
              className="border-white text-blue-500 hover:border-blue-500 hover:text-purple-500 text-lg font-semibold px-8 py-6 rounded-md"
            >
              <a href="#services">Our Services</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Illustration with Floating Animation */}
        <motion.div
          className="relative mb-10 md:mb-0"
          animate={{
            y: [0, -15, 0], // floating effect
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        >
          <motion.img
            src='https://i.ibb.co/8gnjkHkG/Innovation-amico.png'
            alt="Business Solutions"
            className="w-[300px] md:w-[400px] lg:w-[450px] drop-shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
