
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
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
            <Link to="/landing">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
