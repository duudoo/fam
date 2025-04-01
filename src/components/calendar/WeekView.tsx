
import { useEffect, useState } from 'react';
import { Event } from '@/utils/types';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import WeekGrid from './week/WeekGrid';
import WeekEvents from './week/WeekEvents';
import SelectedDayHeader from './week/SelectedDayHeader';
import UpcomingEvents from './UpcomingEvents';

interface WeekViewProps {
  date: Date;
  events: Event[];
  onDayClick?: (date: Date) => void;
}

const WeekView = ({ date, events, onDayClick }: WeekViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Reset selected day when week view date changes
  useEffect(() => {
    setSelectedDate(null);
  }, [date]);
  
  // Handler for day clicks
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    
    // Call parent handler
    onDayClick && onDayClick(day);
  };
  
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-4">
          <WeekGrid 
            date={date}
            events={events}
            onDayClick={handleDayClick}
          />
        </div>
        
        <div className="md:col-span-3">
          {selectedDate ? (
            <div className="bg-famacle-blue-light/10 p-4 rounded-lg">
              <SelectedDayHeader selectedDate={selectedDate} />
              <WeekEvents events={events} selectedDate={selectedDate} />
            </div>
          ) : (
            <UpcomingEvents events={events} limit={2} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WeekView;
