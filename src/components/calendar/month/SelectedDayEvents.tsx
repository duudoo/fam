
import { format } from 'date-fns';
import { Event } from '@/utils/types';
import EventDetail from '../EventDetail';
import { Button } from '@/components/ui/button';
import { Check, Plus, ArrowLeft } from 'lucide-react';

interface SelectedDayEventsProps {
  date: Date;
  events: Event[];
  onAddEvent?: () => void;
  onBackToUpcoming?: () => void;
}

const SelectedDayEvents = ({ date, events, onAddEvent, onBackToUpcoming }: SelectedDayEventsProps) => {
  // Get the actual count of events
  const eventCount = events.length;
  
  return (
    <div className="bg-famacle-blue-light/10 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium flex items-center text-famacle-slate">
          <span className="bg-white p-1 rounded mr-2 shadow-sm">
            {format(date, 'd')}
          </span>
          {eventCount === 0 ? 'No events' : 
            eventCount === 1 ? '1 Event' : 
            `${eventCount} Events`} for {format(date, 'MMMM d, yyyy')}
        </h3>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBackToUpcoming}
          className="text-famacle-blue hover:text-famacle-blue/80"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Upcoming
        </Button>
      </div>
      
      <div className="space-y-2 mt-4">
        {events.length > 0 ? (
          events.map(event => (
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
    </div>
  );
};

export default SelectedDayEvents;
