
import { useState } from 'react';
import { motion } from 'framer-motion';
import CalendarNav from './CalendarNav';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

const CalendarView = () => {
  const { 
    events, 
    selectedDate,
    setSelectedDate,
    view,
    setView,
    isLoading
  } = useCalendarEvents();

  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
  };
  
  // Handler for day clicks in week view
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  return (
    <motion.div 
      className="space-y-4 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <CalendarNav 
          date={selectedDate}
          view={view}
          setDate={setSelectedDate}
          toggleView={toggleView}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-famacle-slate animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {view === 'month' ? (
              <MonthView 
                date={selectedDate}
                setDate={setSelectedDate}
                events={events}
              />
            ) : (
              <WeekView 
                date={selectedDate}
                events={events}
                onDayClick={handleDayClick}
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CalendarView;
