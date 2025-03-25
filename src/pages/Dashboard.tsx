
import { useEffect } from "react";
import DashboardComponent from "@/components/dashboard";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const DashboardPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "Dashboard | Famacle";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <DashboardComponent />
      </main>
      <Toaster />
    </div>
  );
};

export default DashboardPage;
