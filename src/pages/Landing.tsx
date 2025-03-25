
import { useEffect } from "react";
import { motion } from "framer-motion";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingTestimonial from "@/components/landing/LandingTestimonial";
import LandingFooter from "@/components/landing/LandingFooter";

const LandingPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "Welcome to Famacle";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      {/* Hero Section with Auth CTA */}
      <LandingHero />
      
      {/* Features Section */}
      <LandingFeatures />
      
      {/* Testimonial/Trust Section */}
      <LandingTestimonial />
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
