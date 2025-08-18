
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import ProjectsSection from "./ProjectsSection";
import TestimonialSection from "./TestimonialSection";
import PricingSection from "./PricingSection";
import MessageUsSection from "./MessageUsSection";
import CompanyLogoSlider from "./CompanyLogoSlider";
import InvitationSection from "./InvitationSection";
import useProtectedAxios from "../../Hooks/useProtectedAxios";
import { use, useEffect, useState } from "react";

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
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchHomepageData();
  }, []);

  const {whyChooseUs, logos, services, projects, pricingPlans, testimonials, inviteSection} = homepageData;

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
