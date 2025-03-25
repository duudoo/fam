
import { format, isSameDay, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import EventDetail from './EventDetail';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { type DayContentProps } from 'react-day-picker';

interface MonthViewProps {
  date: Date;
  setDate: (date: Date) => void;
  events: Event[];
}

const MonthView = ({ date, setDate, events }: MonthViewProps) => {
  const { getEventsByDate, eventForDate } = useCalendarEvents(events);
  
  // Custom day component for the calendar that works with DayContentProps
  const CustomDay = (props: DayContentProps) => {
    const dayDate = props.date;
    const hasEvents = getEventsByDate(dayDate).length > 0;
    const dayEvents = getEventsByDate(dayDate);
    
    return (
      <div
        className={cn(
          "relative p-3 transition-colors hover:bg-muted/50",
          props.today && "font-bold",
          props.selected && "bg-primary text-primary-foreground hover:bg-primary/90",
          props.outside && "text-muted-foreground opacity-50",
          hasEvents && !props.selected && "font-medium text-famacle-blue"
        )}
        style={{ textAlign: "center" }}
        onClick={() => props.onClick?.(dayDate)}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          {hasEvents && !isSameDay(dayDate, date) && (
            <div className="w-1 h-1 bg-famacle-blue rounded-full mt-1" />
          )}
        </div>
        <span className="text-sm">{format(dayDate, "d")}</span>
        
        {hasEvents && dayEvents.length > 0 && (
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div 
                key={event.id} 
                className={cn(
                  "text-xs truncate rounded px-1 py-0.5",
                  isSameDay(dayDate, date)
                    ? "bg-white/20 text-white" 
                    : "bg-famacle-blue-light text-famacle-blue"
                )}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
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
          event: (date) => eventForDate(date),
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
