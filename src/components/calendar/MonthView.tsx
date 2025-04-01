
import { isSameDay } from 'date-fns';
import { Event } from '@/utils/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import CalendarWrapper from './month/CalendarWrapper';
import SelectedDayEvents from './month/SelectedDayEvents';
import UpcomingEvents from './UpcomingEvents';

interface MonthViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: Event[];
  showDayEvents?: boolean;
}

const MonthView = ({ date, setDate, events, showDayEvents = false }: MonthViewProps) => {
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
  
  const todayEvents = getEventsByDate(date);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-4">
          <CalendarWrapper
            date={date}
            events={events}
            onDayClick={handleDayClick}
            getEventsByDate={getEventsByDate}
          />
        </div>
        
        <div className="md:col-span-3">
          {showDayEvents ? (
            <SelectedDayEvents date={date} events={todayEvents} />
          ) : (
            <UpcomingEvents events={events} limit={4} alwaysShowToggle={true} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MonthView;
