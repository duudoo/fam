
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar, Check } from "lucide-react";

const DemoCalendar = () => {
  const features = [
    "Visualize custody schedules with color-coded calendar",
    "Manage child pickups and drop-offs seamlessly",
    "Set up recurring events for regular schedules",
    "Get reminders for important dates and appointments",
    "Share calendars with caregivers and family members"
  ];

  // Sample calendar days
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i % 31 + 1;
    const isWeekend = i % 7 === 0 || i % 7 === 6;
    const hasEvent = [3, 8, 15, 22, 27].includes(day);
    const isHighlighted = [7, 8, 9, 10, 11, 12, 13, 28, 29, 30].includes(day);
    
    return { day, isWeekend, hasEvent, isHighlighted };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <p className="text-gray-600 mb-6">
          Famacle's shared calendar makes it easy to coordinate pickups, dropoffs, activities, and important events, ensuring everyone is on the same page.
        </p>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <motion.li 
              key={index}
              className="flex items-start gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="rounded-full bg-famacle-blue-light p-1 mt-0.5">
                <Check className="h-3 w-3 text-famacle-blue" />
              </span>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      
      <div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-famacle-blue" />
            August 2023
          </h3>
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.slice(0, 35).map((day, index) => (
              <motion.div
                key={index}
                className={`relative aspect-square flex items-center justify-center rounded text-sm ${
                  day.isWeekend ? "text-gray-400" : "text-gray-800"
                } ${
                  day.isHighlighted ? "bg-famacle-blue-light/50" : ""
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(0.5 + index * 0.01, 1) }}
              >
                {day.day <= 31 && (
                  <>
                    {day.day}
                    {day.hasEvent && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-famacle-blue rounded-full"></span>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="block w-3 h-3 bg-famacle-blue-light/50 rounded"></span>
              <span>Your parenting time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="block w-3 h-3 bg-white border border-gray-200 rounded"></span>
              <span>Co-parent's time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoCalendar;
