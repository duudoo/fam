
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import EventDetail from './EventDetail';
import { DayContentProps } from 'react-day-picker';
import DayCell from './DayCell';

interface MonthViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: Event[];
}

const MonthView = ({ date, setDate, events }: MonthViewProps) => {
  // Helper function to determine if a date has events
  const eventForDate = (day: Date) => {
    return events.some(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, day)
        : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
    });
  };
  
  // Helper function to get events for a specific date
  const getEventsByDate = (day: Date) => {
    return events.filter(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, day)
        : isSameDay(eventStartDate, day) || isSameDay(eventEndDate, day);
    });
  };
  
  // Custom day component wrapper that passes our props to DayCell
  const CustomDay = (props: DayContentProps) => {
    return (
      <DayCell
        {...props}
        events={events}
        getEventsByDate={getEventsByDate}
        selectedDate={date}
      />
    );
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        className="rounded-md border"
        modifiers={{
          event: (day) => eventForDate(day),
        }}
        modifiersClassNames={{
          event: "has-event",
        }}
        components={{
          Day: CustomDay,
        }}
      />
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">
          Events for {format(date, 'MMMM d, yyyy')}
        </h3>
        
        <div className="space-y-2">
          {getEventsByDate(date).length > 0 ? (
            getEventsByDate(date).map(event => (
              <EventDetail key={event.id} event={event} />
            ))
          ) : (
            <p className="text-gray-500">No events scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
