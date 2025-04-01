
import { Event } from '@/utils/types';
import { isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import EventDetail from '../EventDetail';

interface WeekEventsProps {
  events: Event[];
  selectedDate: Date | null;
}

const WeekEvents = ({ events, selectedDate }: WeekEventsProps) => {
  if (!selectedDate) return null;
  
  const dayEvents = events.filter(event => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
    
    return event.allDay 
      ? isSameDay(eventStartDate, selectedDate)
      : isSameDay(eventStartDate, selectedDate) || isSameDay(eventEndDate, selectedDate);
  });
  
  return (
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
  );
};

export default WeekEvents;
