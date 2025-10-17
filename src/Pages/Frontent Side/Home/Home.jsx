
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import ProjectsSection from "./ProjectsSection";
import TestimonialSection from "./TestimonialSection";
import PricingSection from "./PricingSection";
import MessageUsSection from "./MessageUsSection";
import CompanyLogoSlider from "./CompanyLogoSlider";
import InvitationSection from "./InvitationSection";
import useProtectedAxios from "../../../Hooks/useProtectedAxios";
import { use, useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingAnim from "../../../assets/Lottifiles/loading.json";
import Particles from "../../../Components/BackgroundAnimation/Particles";

export default function HomePage() {
  
  //const [loading, setLoading] = useState(false);
  
  

  const homepageData = {
    "whyChooseUs": [
      {
        "id": 1,
        "icon": "FiTrendingUp",
        "title": "Proven Growth",
        "description": "We focus on results that help your business grow consistently with data-driven strategies."
      },
      {
        "id": 2,
        "icon": "FiClock",
        "title": "Time Efficiency",
        "description": "Save valuable time with our automated tools, seamless workflows, and smart integrations."
      },
      {
        "id": 3,
        "icon": "FiShield",
        "title": "Trusted Security",
        "description": "Your data is safe with enterprise-grade security, encryption, and constant monitoring."
      },
      {
        "id": 4,
        "icon": "FiSmile",
        "title": "User Satisfaction",
        "description": "We prioritize user-friendly solutions to ensure a smooth experience for everyone."
      }
    ],
    "logos": [
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
      "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      "https://i.ibb.co/bRGHSty4/indonesian-halal-logo-2022.jpg"
    ],
    "services": [
      {
        "id": "1",
        "icon": "MdOutlineCampaign",
        "title": "Digital Marketing",
        "description": "Promote services online, manage campaigns, and track marketing performance insights."
      },
      {
        "id": "2",
        "icon": "FiShield",
        "title": "Hard Security System",
        "description": "Protect sensitive data, ensure secure access, and safeguard the system from threats."
      },
      {
        "id": "3",
        "icon": "FaPencilRuler",
        "title": "Business App Design",
        "description": "Design intuitive interfaces, improve user experience, and build engaging applications."
      },
      {
        "id": "4",
        "icon": "FiBarChart2",
        "title": "Data Analysis",
        "description": "Analyze business data, generate reports, and gain valuable insights for decisions."
      }
    ],
    "projects": [
      {
        "id": 1,
        "title": "E-commerce Customer Service",
        "category": "Web Application",
        "description": "A complete e-commerce customer service platform with order management, chat support, and feedback collection.",
        "image": "https://i.postimg.cc/0y8hSfPJ/customer-care-webpage-interface-word.jpg"
      },
      {
        "id": 2,
        "title": "Delivery Tracking System",
        "category": "Machine Learning",
        "description": "AI-powered mobile application that tracks delivery vehicles in real-time using GPS and machine learning.",
        "image": "https://i.postimg.cc/Zn4xQwf8/red-delivery-car-deliver-express-shipping-fast-delivery-background-3d-rendering-illustration.jpg"
      },
      {
        "id": 3,
        "title": "Cost Management App",
        "category": "Full-Stack Project",
        "description": "A comprehensive cost management application for businesses.",
        "image": "https://i.postimg.cc/XqvvzhNj/19197149.jpg"
      },
      {
        "id": 4,
        "title": "Security System",
        "category": "Full-Stack Project",
        "description": "A service-sharing platform with authentication, booking, and real-time delivery tracking system.",
        "image": "https://i.postimg.cc/BZxWrNPs/smart-car-security-unlock-via-smartphone-digital-remix.jpg"
      }
    ],
    "pricingPlans": [
      {
        "id": 1,
        "title": "Simple",
        "price": "$19/mo",
        "icon": "FaUserTie",
        "features": [
          "Up to 10 Employees",
          "Basic Workflow Tracking",
          "Email Support"
        ],
        "highlighted": false
      },
      {
        "id": 2,
        "title": "Professional",
        "price": "$49/mo",
        "icon": "FaUsers",
        "features": [
          "Up to 50 Employees",
          "Advanced Workflow & Payroll",
          "Priority Support"
        ],
        "highlighted": true
      },
      {
        "id": 3,
        "title": "Enterprise",
        "price": "$99/mo",
        "icon": "FaBuilding",
        "features": [
          "Unlimited Employees",
          "Dedicated Manager",
          "24/7 Premium Support"
        ],
        "highlighted": false
      }
    ],
    "testimonials": [
      {
        "id": 1,
        "name": "Sarah Johnson",
        "role": "HR Manager, TechCorp",
        "feedback": "This Employee Management System has streamlined our workflow. Payroll and task tracking are now effortless!",
        "rating": 5,
        "img": "https://i.pravatar.cc/100?img=1"
      },
      {
        "id": 2,
        "name": "Michael Lee",
        "role": "Operations Lead, InnovateX",
        "feedback": "We love the role-based access control. It ensures security and makes managing employees a breeze.",
        "rating": 4,
        "img": "https://i.pravatar.cc/100?img=2"
      },
      {
        "id": 3,
        "name": "Priya Das",
        "role": "CEO, SoftBridge",
        "feedback": "The UI is clean and intuitive. I can monitor the entire team’s workflow in real-time. Highly recommended!",
        "rating": 5,
        "img": "https://i.pravatar.cc/100?img=3"
      }
    ],
    "inviteSection": {
      "heading": "Get the Business IT Service That Your Company Needs",
      "highlight": "Business IT Service",
      "paragraph": "Manage employees, monitor workflows, track payments, and boost your company's productivity with our all-in-one solution."
    }
  }

  const { whyChooseUs, logos, services, projects, pricingPlans, testimonials, inviteSection } = homepageData;

  // if (loading) return <div className="relative flex items-center justify-center max-w-5xl mx-auto h-[60vh]">
  //   {/* Background Animation */}
  //   <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
  //     <Particles
  //       particleColors={['#ffffff', '#ffffff']}
  //       particleCount={200}
  //       particleSpread={10}
  //       speed={0.1}
  //       particleBaseSize={100}
  //       moveParticlesOnHover={true}
  //       alphaParticles={false}
  //       disableRotation={false}
  //     />
  //   </div>
  //   <Lottie animationData={loadingAnim} loop={true} />
  // </div>;

  return (
    <div className="flex flex-col">
      {/*  Hero Section */}
      <HeroSection />

      {/*  About Section */}
      <AboutSection />

      {/* Company Logo Slider Section */}
      <CompanyLogoSlider />

      {/*  Services Section */}
      <ServicesSection  />

      {/*  Projects Section */}
      <ProjectsSection  />

      {/*  Testimonials Section */}
      <TestimonialSection />

      {/* pricing section */}
      <PricingSection  />

      {/* Invitation section */}
      <InvitationSection  />

      {/* message us section */}
      <MessageUsSection />


    </div>
  );
}
