
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CalendarNav from './CalendarNav';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import UpcomingEvents from './UpcomingEvents';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';

const CalendarView = () => {
  const { 
    events, 
    selectedDate,
    setSelectedDate,
    view,
    setView,
    isLoading
  } = useCalendarEvents();

  const [dateSelected, setDateSelected] = useState(false);

  // Reset dateSelected flag when view changes
  useEffect(() => {
    setDateSelected(false);
  }, [view]);

  // Reset dateSelected flag when date changes
  useEffect(() => {
    setDateSelected(false);
  }, [selectedDate]);

  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
  };
  
  // Handler for day clicks in week view
  const handleDayClick = (date: Date) => {
    console.log('Day clicked:', date);
    setSelectedDate(date);
    setDateSelected(true);
  };
  
  // Update the date handler
  const handleDateChange = (date: Date) => {
    console.log('Setting new date:', date);
    setSelectedDate(date);
    setDateSelected(false);
  };
  
  return (
    <motion.div 
      className="space-y-4 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <CalendarNav 
            date={selectedDate}
            view={view}
            setDate={handleDateChange}
            toggleView={toggleView}
          />
          
          <Link to="/settings?tab=calendar" className="mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="text-famacle-slate flex items-center gap-1">
              <LinkIcon size={14} />
              Sync Calendars
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-famacle-slate animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <motion.div
            key={`${view}-${selectedDate.toISOString()}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {view === 'month' ? (
              <MonthView 
                date={selectedDate}
                setDate={handleDayClick}
                events={events}
                showDayEvents={dateSelected}
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
