
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import CalendarView from "@/components/calendar";
import { Toaster } from "@/components/ui/toaster";

const CalendarPage = () => {
  useEffect(() => {
    // Set page title
    document.title = "Calendar | Famacle";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-famacle-slate">Calendar</h1>
              <p className="text-gray-500 mt-1">Manage activities and appointments</p>
            </div>
          </div>
          
          <CalendarView />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default CalendarPage;
