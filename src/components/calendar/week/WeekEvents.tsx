
import { Event } from '@/utils/types';
import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import EventDetail from '../EventDetail';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface WeekEventsProps {
  events: Event[];
  selectedDate: Date | null;
  onAddEvent?: () => void;
}

const WeekEvents = ({ events, selectedDate, onAddEvent }: WeekEventsProps) => {
  if (!selectedDate) return null;
  
  const dayEvents = events.filter(event => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
    
    return event.allDay 
      ? isSameDay(eventStartDate, selectedDate)
      : isSameDay(eventStartDate, selectedDate) || isSameDay(eventEndDate, selectedDate);
  });
  
  // Get the actual count of events
  const eventCount = dayEvents.length;
  
  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-lg font-medium mb-2 text-famacle-slate">
        {eventCount === 0 ? 'No events' : 
          eventCount === 1 ? '1 Event' : 
          `${eventCount} Events`} for {format(selectedDate, 'MMMM d, yyyy')}
      </h3>
      
      {dayEvents.length > 0 ? (
        dayEvents.map(event => (
          <EventDetail key={event.id} event={event} />
        ))
      ) : (
        <div className="bg-white p-4 rounded-md text-center border border-dashed border-gray-200">
          <p className="text-gray-500 mb-2">No events scheduled for this day.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1 text-famacle-blue border-famacle-blue-light"
            onClick={onAddEvent}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeekEvents;
