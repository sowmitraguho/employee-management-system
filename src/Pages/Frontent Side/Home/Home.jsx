
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
  const [homepageData, setHomepageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchHomepageData = async () => {
    try {
      const res = await useProtectedAxios.get(`/content`);
      console.log("fetched homepage data", res.data);
      setHomepageData(res.data || []);
    } catch (err) {
      console.error("Error fetching homepage data:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchHomepageData();
  }, []);

  const {whyChooseUs, logos, services, projects, pricingPlans, testimonials, inviteSection} = homepageData;

  if (loading) return <div className="relative flex items-center justify-center max-w-5xl mx-auto h-[60vh]">
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
    <Lottie animationData={loadingAnim} loop={true} />
    </div>;

  return (
    <div className="flex flex-col">
      {/*  Hero Section */}
      <HeroSection/>

      {/*  About Section */}
      <AboutSection data={whyChooseUs} />

       {/* Company Logo Slider Section */}
      <CompanyLogoSlider logos={logos} />

      {/*  Services Section */}
      <ServicesSection data={services} />

      {/*  Projects Section */}
      <ProjectsSection data={projects} />

      {/*  Testimonials Section */}
      <TestimonialSection data={testimonials} />

      {/* pricing section */}
      <PricingSection data={pricingPlans} />

      {/* Invitation section */}
      <InvitationSection data={inviteSection} />

      {/* message us section */}
      <MessageUsSection/>

     
    </div>
  );
}
