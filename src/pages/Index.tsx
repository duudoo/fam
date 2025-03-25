
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HomeHeader from '@/components/home/HomeHeader';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PricingSection from '@/components/home/PricingSection';
import CTASection from '@/components/home/CTASection';
import HomeFooter from '@/components/home/HomeFooter';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent flash of unstyled content
  }

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      {/* Header with Auth Links */}
      <HomeHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Abstract background shape */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 w-full h-full bg-famacle-blue-light/20 rounded-bl-[100px]"></div>
      </div>
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default Index;
