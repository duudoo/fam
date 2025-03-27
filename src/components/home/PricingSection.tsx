
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const features = [
    "Unlimited expense tracking",
    "Advanced calendar with notifications",
    "Receipt scanning & storage",
    "Payment request & approvals",
    "Financial reports & analytics",
    "Priority support"
  ];

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-famacle-slate mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay only for what you need, with no hidden costs
          </p>
        </motion.div>
        
        <div className="flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 border border-famacle-blue shadow-lg relative bg-famacle-blue-light/10 max-w-xl w-full"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-famacle-blue text-white text-xs font-bold py-1 px-3 rounded-full">
              Family Plan
            </span>
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-bold text-famacle-slate">Per Child Pricing</h3>
              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-famacle-slate">$5</span>
                <span className="ml-1 text-gray-500">/month for first child</span>
              </div>
              <div className="mt-2 flex items-baseline justify-center">
                <span className="text-3xl font-bold text-famacle-slate">$2</span>
                <span className="ml-1 text-gray-500">/month for each additional child</span>
              </div>
              <p className="mt-4 text-gray-600">Perfect for families of any size, with flexible pricing that grows with your family</p>
            </div>
            
            <ul className="mt-6 space-y-3">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-famacle-teal flex-shrink-0 mr-2" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8">
              <Button 
                asChild
                className="w-full bg-famacle-blue hover:bg-famacle-blue/90"
              >
                <Link to="/signup">
                  Start Free Trial
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="text-center mt-12 text-gray-600">
          <p>All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
