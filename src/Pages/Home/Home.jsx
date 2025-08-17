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

export default function HomePage() {
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

      {/* message us section */}
      <MessageUsSection/>

     
    </div>
  );
}
