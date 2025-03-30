
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, FileCheck, Calendar, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const LandingHero = () => {
  const isMobile = useIsMobile();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Features list
  const features = [
    {
      title: "Track & Split Expenses",
      description: "Log child-related expenses and automatically calculate each parent's share based on your agreements.",
      icon: <CreditCard className="w-6 h-6 text-famacle-blue" />
    },
    {
      title: "Upload Receipts",
      description: "Attach digital receipts to expenses for clear documentation and transparency.",
      icon: <FileCheck className="w-6 h-6 text-famacle-teal" />
    },
    {
      title: "Calendar & Scheduling",
      description: "Coordinate activities, appointments, and important events with shared calendars.",
      icon: <Calendar className="w-6 h-6 text-famacle-coral" />
    },
    {
      title: "Secure Communication",
      description: "Keep all co-parenting communications organized in one secure place.",
      icon: <MessageCircle className="w-6 h-6 text-purple-500" />
    },
  ];

  return (
    <section className={`pt-8 ${isMobile ? 'pb-10' : 'pb-16'} px-4`}>
      <div className="max-w-7xl mx-auto">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'md:grid-cols-2 gap-12'} items-center`}>
          {/* Left column - Hero content */}
          <motion.div 
            className="flex flex-col justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="inline-block mb-4 px-3 py-1 bg-famacle-blue-light text-famacle-blue rounded-full text-sm font-medium">
              Simplifying Co-Parenting
            </div>
            
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold text-famacle-slate mb-6`}>
              Manage childcare together, {!isMobile && <br className="hidden md:block" />}
              <span className="text-famacle-blue">even when apart</span>
            </h1>
            
            <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600 mb-8`}>
              Famacle helps separated parents coordinate childcare expenses, 
              schedules, and communications in one seamless platform.
            </p>
            
            <div className={`${isMobile ? 'hidden' : 'hidden md:block'}`}>
              <div className="flex flex-wrap gap-y-3 gap-x-8 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0 text-famacle-blue">
                      {feature.icon}
                    </div>
                    <span className="text-gray-600">{feature.title}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild size="lg" className="text-md px-8">
                <Link to="/dashboard">
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          {/* Right column - Auth CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`bg-white ${isMobile ? 'p-6' : 'p-8'} rounded-xl shadow-soft text-center`}
          >
            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-famacle-slate mb-4`}>
              Ready to simplify co-parenting?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of parents who use Famacle to make co-parenting 
              easier, more organized, and less stressful.
            </p>
            <div className="space-y-4">
              <Button asChild variant="default" size={isMobile ? "default" : "lg"} className="w-full">
                <Link to="/signup">
                  Sign up for free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/signin" className="text-famacle-blue hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
