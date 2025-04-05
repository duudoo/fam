
import { useEffect } from "react";
import DashboardComponent from "@/components/dashboard";
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Navbar from "@/components/Navbar";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

const DashboardPage = () => {
  // Initialize calendar events hook to catch sync callbacks
  useCalendarEvents();
  
  useEffect(() => {
    // Set page title
    document.title = "Dashboard | Famacle";
  }, []);

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-12 max-w-6xl">
          <DashboardComponent />
        </main>
        <Toaster />
      </div>
    </CurrencyProvider>
  );
};

export default DashboardPage;
