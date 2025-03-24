import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CreditCard, FileCheck, CheckCircle, Shield, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent flash of unstyled content
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
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
      title: "Payment Approvals",
      description: "Request reimbursements and approve payments within the app.",
      icon: <CheckCircle className="w-6 h-6 text-green-500" />
    },
    {
      title: "Secure Communication",
      description: "Keep all co-parenting communications organized in one secure place.",
      icon: <MessageCircle className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Privacy Protection",
      description: "Your family's information is protected with enterprise-grade security.",
      icon: <Shield className="w-6 h-6 text-gray-700" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block mb-4 px-3 py-1 bg-famacle-blue-light text-famacle-blue rounded-full text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Simplifying Co-Parenting
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-famacle-slate mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Manage childcare together, <br className="hidden md:block" />
            <span className="text-famacle-blue">even when apart</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Famacle helps separated parents coordinate childcare expenses, 
            schedules, and communications in one seamless platform.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button asChild size="lg" className="text-md px-8">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-md">
              <Link to="/dashboard">
                View Demo
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Abstract background shape */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 -z-10 overflow-hidden">
        <div className="absolute right-0 top-0 w-full h-full bg-famacle-blue-light/20 rounded-bl-[100px]"></div>
      </div>
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-famacle-slate mb-4">
              All the tools you need to coordinate with confidence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Famacle provides everything you need to manage shared parenting responsibilities effectively.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-famacle-slate mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-famacle-slate text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to simplify your co-parenting coordination?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of parents who use Famacle to manage childcare responsibilities seamlessly.
            </p>
            <Button asChild size="lg" className="bg-white text-famacle-slate hover:bg-gray-100 text-md px-8">
              <Link to="/dashboard">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
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

export default Index;
