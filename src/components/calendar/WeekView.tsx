
import { format, isSameDay, parseISO, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

interface WeekViewProps {
  date: Date;
  events: Event[];
}

const WeekView = ({ date, events }: WeekViewProps) => {
  const { getEventsByDate } = useCalendarEvents(events);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(date, i - date.getDay()));
  
  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {weekDays.map((day, index) => (
        <div key={index} className="min-h-[200px]">
          <div className={cn(
            "text-center p-2 rounded-t-md font-medium",
            isSameDay(day, new Date()) ? "bg-famacle-blue text-white" : "bg-gray-100"
          )}>
            <div className="text-xs">{format(day, 'EEE')}</div>
            <div className="text-sm">{format(day, 'd')}</div>
          </div>
          
          <div className="border border-t-0 rounded-b-md p-1 h-full min-h-[160px]">
            {getEventsByDate(day).map(event => (
              <div 
                key={event.id} 
                className="text-xs p-1 mb-1 rounded bg-famacle-blue-light text-famacle-blue truncate"
              >
                {!event.allDay && format(parseISO(event.startDate), 'h:mm a')} {event.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekView;
