
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        <div className="animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-famacle-slate">Calendar</h1>
              <p className="text-gray-500 mt-1">Manage your family's schedule and activities</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <CalendarView />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h2 className="font-medium text-lg mb-3">Calendar Tips</h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-famacle-blue-light text-famacle-blue rounded-full p-1 mt-0.5">•</span>
                    <span>Switch between Month and Week views</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-famacle-blue-light text-famacle-blue rounded-full p-1 mt-0.5">•</span>
                    <span>Click on a day to see detailed events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-famacle-blue-light text-famacle-blue rounded-full p-1 mt-0.5">•</span>
                    <span>Set priority levels for important activities</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h2 className="font-medium text-lg mb-3">Priority Legend</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 bg-famacle-coral rounded-full"></span>
                    <span className="text-sm">High Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 bg-famacle-blue rounded-full"></span>
                    <span className="text-sm">Medium Priority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="block w-3 h-3 bg-famacle-slate-light rounded-full"></span>
                    <span className="text-sm">Low Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default CalendarPage;
