
import { motion } from "framer-motion";
import { CreditCard, FileCheck, Calendar, MessageCircle } from "lucide-react";

const LandingFeatures = () => {
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
  );
};

export default LandingFeatures;
