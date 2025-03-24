
import { useEffect } from "react";
import DashboardComponent from "@/components/Dashboard";
import Navbar from "@/components/Navbar";

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
    </div>
  );
};

export default DashboardPage;
