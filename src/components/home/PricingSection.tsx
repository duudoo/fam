
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "per month",
      description: "Perfect for single parents with minimal co-parenting needs",
      features: [
        "Track up to 10 expenses per month",
        "Basic calendar sharing",
        "Simple expense splitting",
        "Email support"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Family",
      price: "$19.99",
      period: "per month",
      description: "Ideal for co-parents with regular shared responsibilities",
      features: [
        "Unlimited expense tracking",
        "Advanced calendar with notifications",
        "Detailed payment history",
        "Receipt scanning & storage",
        "Priority support",
        "Payment request & approvals"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Extended Family",
      price: "$29.99",
      period: "per month",
      description: "Designed for complex family structures with multiple caregivers",
      features: [
        "All Family plan features",
        "Support for up to 6 family members",
        "Customizable expense categories",
        "Financial reports & analytics",
        "Legal document storage",
        "24/7 premium support"
      ],
      cta: "Start Free Trial",
      highlighted: false
    }
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
            Choose the plan that works best for your family's needs
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl p-6 border flex flex-col ${
                plan.highlighted 
                  ? 'border-famacle-blue shadow-lg relative bg-famacle-blue-light/10' 
                  : 'border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-famacle-blue text-white text-xs font-bold py-1 px-3 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-famacle-slate">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-famacle-slate">{plan.price}</span>
                  <span className="ml-1 text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>
              
              <ul className="mt-6 space-y-3 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-famacle-teal flex-shrink-0 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8">
                <Button 
                  asChild
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-famacle-blue hover:bg-famacle-blue/90' 
                      : ''
                  }`}
                >
                  <Link to="/landing">
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12 text-gray-600">
          <p>All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
