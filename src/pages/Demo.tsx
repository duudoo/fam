
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DemoTour from "@/components/demo/DemoTour";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";

const DemoPage = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [tourStep, setTourStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Set page title
    document.title = "Interactive Demo | Famacle";
  }, []);

  const handleStartTour = () => {
    setShowWelcomeDialog(false);
  };

  const handleSkipTour = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-famacle-blue-light/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <DemoTour 
          currentStep={tourStep} 
          setCurrentStep={setTourStep} 
          onComplete={() => navigate("/dashboard")}
        />
      </main>

      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-famacle-blue text-xl">Welcome to the Famacle Demo</DialogTitle>
            <DialogDescription>
              This guided tour will show you the key features of Famacle and how it helps co-parents manage childcare together.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              You'll see how Famacle helps track expenses, manage schedules, and improve communication between co-parents.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleSkipTour}>Skip Tour</Button>
            <Button onClick={handleStartTour}>
              Start Guided Tour
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoPage;
