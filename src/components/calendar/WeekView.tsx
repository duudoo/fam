
import { isSameDay, addDays, format } from 'date-fns';
import { Event } from '@/utils/types';
import WeekDayCell from './WeekDayCell';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import UpcomingEvents from './UpcomingEvents';
import EventDetail from './EventDetail';

interface WeekViewProps {
  date: Date;
  events: Event[];
  onDayClick?: (date: Date) => void;
}

const WeekView = ({ date, events, onDayClick }: WeekViewProps) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<Event[]>([]);
  
  // Reset selected day when week view date changes
  useEffect(() => {
    setSelectedDate(null);
  }, [date]);
  
  // Handler for day clicks
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    
    // Get events for the selected day
    const filteredEvents = events.filter(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, day)
        : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
    });
    
    setDayEvents(filteredEvents);
    
    // Call parent handler
    onDayClick && onDayClick(day);
  };
  
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mt-4">
            {weekDays.map((day, index) => {
              const dayEvents = events.filter(event => {
                const eventStartDate = new Date(event.startDate);
                const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
                
                return event.allDay 
                  ? isSameDay(eventStartDate, day)
                  : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
              });
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <WeekDayCell
                    day={day}
                    events={dayEvents}
                    isToday={isSameDay(day, new Date())}
                    onDayClick={handleDayClick}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="md:col-span-3">
          {selectedDate ? (
            <div className="bg-famacle-blue-light/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center text-famacle-slate">
                <span className="bg-white p-1 rounded mr-2 shadow-sm">
                  {format(selectedDate, 'd')}
                </span>
                Events for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              
              <div className="space-y-2 mt-4">
                {dayEvents.length > 0 ? (
                  dayEvents.map(event => (
                    <EventDetail key={event.id} event={event} />
                  ))
                ) : (
                  <div className="bg-white p-4 rounded-md text-center border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-2">No events scheduled for this day.</p>
                  </div>
                )}
              </div>
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
