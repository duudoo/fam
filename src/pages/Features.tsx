
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { FeaturesSection } from '@/components/home/FeaturesSection';

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-famacle-slate mb-6">
            Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover all the powerful tools Famacle offers to simplify your co-parenting experience.
          </p>
        </motion.div>
        
        {/* Reuse the existing FeaturesSection component */}
        <FeaturesSection />
        
        {/* Additional features details section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="bg-white rounded-xl shadow-soft p-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-famacle-slate mb-6">
                Famacle is designed with your family in mind
              </h2>
              <p className="text-gray-600 mb-6">
                Our platform was built specifically to address the unique challenges of co-parenting
                and shared family responsibilities. We've spent countless hours researching and
                developing features that make coordination seamless and stress-free.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-famacle-blue-light/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-famacle-slate mb-3">Secure Communication</h3>
                  <p className="text-gray-600">All conversations and shared information are encrypted and stored securely, ensuring your family's privacy.</p>
                </div>
                <div className="bg-famacle-blue-light/20 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-famacle-slate mb-3">Real-time Updates</h3>
                  <p className="text-gray-600">Receive instant notifications about schedule changes, expense approvals, and other important updates.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;
