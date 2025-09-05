import { motion } from "framer-motion";
import { FiTrendingUp, FiClock, FiShield, FiSmile } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import about from '../../../assets/Lottifiles/about.json';
import Lottie from "lottie-react";

export default function AboutSection({data}) {
  console.log("AboutSection data:", data);
  const icon = {
    FiTrendingUp: <FiTrendingUp className="text-indigo-500 w-12 h-12" />,
    FiClock: <FiClock className="text-green-500 w-12 h-12" />,
    FiShield: <FiShield className="text-red-500 w-12 h-12" />,
    FiSmile: <FiSmile className="text-yellow-500 w-12 h-12" />,
  }
  if(!data) return <h2 className="text-center text-gray-500">Loading...</h2>;

//   {
//     id: 1,
//     icon: <FiTrendingUp className="text-indigo-500 w-12 h-12" />,
//     title: "Proven Growth",
//     description:
//       "We focus on results that help your business grow consistently with data-driven strategies.",
//   },
//   {
//     id: 2,
//     icon: <FiClock className="text-green-500 w-12 h-12" />,
//     title: "Time Efficiency",
//     description:
//       "Save valuable time with our automated tools, seamless workflows, and smart integrations.",
//   },
//   {
//     id: 3,
//     icon: <FiShield className="text-red-500 w-12 h-12" />,
//     title: "Trusted Security",
//     description:
//       "Your data is safe with enterprise-grade security, encryption, and constant monitoring.",
//   },
//   {
//     id: 4,
//     icon: <FiSmile className="text-yellow-500 w-12 h-12" />,
//     title: "User Satisfaction",
//     description:
//       "We prioritize user-friendly solutions to ensure a smooth experience for everyone.",
//   },
// ];
  return (
    <section  
      className="
        relative overflow-hidden
        bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-400  /* Light mode */
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900       /* Dark mode */
        py-20 px-6 text-center
      "
    >
      {/* Wavy Top Shape to Match Hero Bottom */}
      <div className="absolute -top-1 left-0 w-full overflow-hidden leading-none rotate-180">
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

      {/* Scroll Animation Container */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/*  Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-gray-200 mb-6">
          Why Choose Us?
        </h2>

        {/*  Subtitle */}
        <motion.p
          className="text-lg text-gray-100 dark:text-gray-400 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          We help businesses manage employees, payroll, and workflow efficiently.
          Our platform is secure, scalable, and designed for teams of all sizes.
        </motion.p>

        {/*  Optional Icon/Divider */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-1 rounded-full bg-white/50 dark:bg-gray-600"></div>
        </motion.div>
      </motion.div>
      {/* Grid + Lottie Space */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-6 py-12">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    {icon[item.icon]}
                    <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Reserved Lottie Animation Space */}
          <div className="flex justify-center items-center">
            {/*  Add your Lottie animation here */}
            <div className="w-80 h-80 border-2 border-dashed rounded-2xl flex items-center justify-center text-muted-foreground">
              <Lottie animationData={about} loop={true} />
            </div>
          </div>
        </div>
    </section>
  );
}
