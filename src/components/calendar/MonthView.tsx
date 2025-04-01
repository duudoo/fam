
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import EventDetail from './EventDetail';
import { DayContentProps } from 'react-day-picker';
import DayCell from './DayCell';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

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
  
  // Handler for day clicks
  const handleDayClick = (day: Date) => {
    setDate(day);
  };
  
  // Custom day component wrapper that passes our props to DayCell
  const CustomDay = (props: DayContentProps) => {
    return (
      <DayCell
        {...props}
        events={events}
        getEventsByDate={getEventsByDate}
        selectedDate={date}
        onDayClick={handleDayClick}
      />
    );
  };

  const todayEvents = getEventsByDate(date);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border overflow-hidden"
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
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-famacle-blue-light/10 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center text-famacle-slate">
              <span className="bg-white p-1 rounded mr-2 shadow-sm">
                {format(date, 'd')}
              </span>
              Events for {format(date, 'MMMM d, yyyy')}
            </h3>
            
            <div className="space-y-2 mt-4">
              {todayEvents.length > 0 ? (
                todayEvents.map(event => (
                  <EventDetail key={event.id} event={event} />
                ))
              ) : (
                <div className="bg-white p-4 rounded-md text-center border border-dashed border-gray-200">
                  <p className="text-gray-500 mb-2">No events scheduled for this day.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-1 text-famacle-blue border-famacle-blue-light"
                  >
                    <Check className="mr-1 h-4 w-4" /> Add Event
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MonthView;
