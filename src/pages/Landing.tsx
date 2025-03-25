
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, MessageCircle, Calendar, CreditCard, FileCheck } from "lucide-react";

const LandingPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "Welcome to Famacle";
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      {/* Hero Section with Auth CTA */}
      <section className="pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
              
              <h1 className="text-4xl md:text-5xl font-bold text-famacle-slate mb-6">
                Manage childcare together, <span className="text-famacle-blue">even when apart</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Famacle helps separated parents coordinate childcare expenses, 
                schedules, and communications in one seamless platform.
              </p>
              
              <div className="hidden md:block">
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
              className="bg-white p-8 rounded-xl shadow-soft text-center"
            >
              <h2 className="text-2xl font-bold text-famacle-slate mb-4">
                Ready to simplify co-parenting?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of parents who use Famacle to make co-parenting 
                easier, more organized, and less stressful.
              </p>
              <div className="space-y-4">
                <Button asChild variant="default" size="lg" className="w-full">
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
      
      {/* Features Section */}
      <motion.section 
        className="py-20 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-famacle-slate mb-4">
              All the tools you need to coordinate with confidence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Famacle provides everything you need to manage shared parenting responsibilities effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-famacle-slate mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Testimonial/Trust Section */}
      <section className="py-16 px-4 bg-famacle-blue-light/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-12 w-12 text-famacle-blue" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-famacle-slate mb-4">
            Trusted by thousands of co-parents
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of parents who use Famacle to make co-parenting simpler,
            more organized, and less stressful.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="text-md px-8">
              <Link to="/signup">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-gray-50 text-gray-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-famacle-blue rounded-xl w-8 h-8 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <h2 className="font-semibold text-famacle-slate text-xl">Famacle</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/" className="text-gray-600 hover:text-famacle-blue">Home</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-famacle-blue">Dashboard</Link>
              <Link to="/expenses" className="text-gray-600 hover:text-famacle-blue">Expenses</Link>
              <Link to="/calendar" className="text-gray-600 hover:text-famacle-blue">Calendar</Link>
              <Link to="/notifications" className="text-gray-600 hover:text-famacle-blue">Notifications</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Famacle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
