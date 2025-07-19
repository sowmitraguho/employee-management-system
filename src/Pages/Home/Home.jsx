import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import TestimonialSection from "./TestimonialSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ✅ Hero Section */}
      <HeroSection/>

      {/* ✅ About Section */}
     
      <AboutSection/>

      {/* ✅ Services Section */}
      {/* <section className="py-16 px-6 bg-white dark:bg-gray-950">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Our Core Services
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Employee Management",
              desc: "Easily manage employee details, roles, and workflows.",
            },
            {
              title: "Payroll Automation",
              desc: "Seamless salary payments with approval tracking.",
            },
            {
              title: "Workflow Tracking",
              desc: "Monitor employee productivity and daily tasks.",
            },
          ].map((service, idx) => (
            <Card
              key={idx}
              className="hover:shadow-xl transition rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900"
            >
              <CardContent className="p-8 text-center">
                <CheckCircle className="mx-auto text-blue-600 dark:text-blue-400 w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}
      <ServicesSection/>

      {/* ✅ Testimonials Section */}
     
      <TestimonialSection/>

      {/* ✅ Call-to-Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Workforce?
        </h2>
        <p className="mb-6 max-w-xl mx-auto text-gray-100 dark:text-gray-300">
          Join hundreds of companies using our platform to manage employees effortlessly.
        </p>
        <Button className="bg-white text-blue-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg shadow-md">
          Create Your Account Now
        </Button>
      </section>
    </div>
  );
}
