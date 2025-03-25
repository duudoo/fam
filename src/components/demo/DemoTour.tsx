
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Calendar, DollarSign, MessageCircle } from "lucide-react";
import DemoExpenses from "./DemoExpenses";
import DemoCalendar from "./DemoCalendar";
import DemoCommunication from "./DemoCommunication";

interface DemoTourProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
}

const DemoTour = ({ currentStep, setCurrentStep, onComplete }: DemoTourProps) => {
  const totalSteps = 3;
  
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DemoExpenses />;
      case 1:
        return <DemoCalendar />;
      case 2:
        return <DemoCommunication />;
      default:
        return <DemoExpenses />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return "Manage Expenses Together";
      case 1:
        return "Coordinate Schedules Seamlessly";
      case 2:
        return "Communicate Effectively";
      default:
        return "";
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 0:
        return <DollarSign className="h-6 w-6 text-famacle-blue" />;
      case 1:
        return <Calendar className="h-6 w-6 text-famacle-blue" />;
      case 2:
        return <MessageCircle className="h-6 w-6 text-famacle-blue" />;
      default:
        return <DollarSign className="h-6 w-6 text-famacle-blue" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-famacle-slate mb-2">Interactive Demo</h1>
        <p className="text-gray-600">Explore how Famacle makes co-parenting easier</p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? "bg-famacle-blue" : "bg-gray-300"
              }`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Card className="p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          {getStepIcon()}
          <h2 className="text-2xl font-semibold">{getStepTitle()}</h2>
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {renderStepContent()}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button onClick={nextStep}>
            {currentStep < totalSteps - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Complete Tour"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DemoTour;
