
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingTestimonial = () => {
  return (
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
  );
};

export default LandingTestimonial;
