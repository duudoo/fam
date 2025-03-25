
import { motion } from 'framer-motion';
import { Calendar, CreditCard, FileCheck, CheckCircle, Shield, MessageCircle } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
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
    <section id="features" className="py-24 px-4 bg-white">
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
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
