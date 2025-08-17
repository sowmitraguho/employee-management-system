import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import ProjectsSection from "./ProjectsSection";
import TestimonialSection from "./TestimonialSection";
import PricingSection from "./PricingSection";
import MessageUsSection from "./MessageUsSection";
import Footer from "../Shared/Footer/Footer";
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

  return (
    <div className="flex flex-col">
      {/*  Hero Section */}
      <HeroSection/>

      {/*  About Section */}
      <AboutSection/>

       {/* Company Logo Slider Section */}
      <CompanyLogoSlider/>

      {/*  Services Section */}
     
      <ServicesSection/>

      {/*  Projects Section */}
      <ProjectsSection/>

      {/*  Testimonials Section */}
     
      <TestimonialSection/>

      {/* pricing section */}
      <PricingSection/>

      {/* Invitation section */}
      <InvitationSection/>

      {/* message us section */}
      <MessageUsSection/>

     
    </div>
  );
}
