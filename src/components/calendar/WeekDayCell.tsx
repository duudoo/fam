
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';

interface WeekDayCellProps {
  day: Date;
  events: Event[];
  isToday: boolean;
}

const WeekDayCell = ({ day, events, isToday }: WeekDayCellProps) => {
  return (
    <div className="min-h-[200px]">
      <div className={cn(
        "text-center p-2 rounded-t-md font-medium",
        isToday ? "bg-famacle-blue text-white" : "bg-gray-100"
      )}>
        <div className="text-xs">{format(day, 'EEE')}</div>
        <div className="text-sm">{format(day, 'd')}</div>
      </div>
      
      <div className="border border-t-0 rounded-b-md p-1 h-full min-h-[160px]">
        {events.map(event => (
          <div 
            key={event.id} 
            className="text-xs p-1 mb-1 rounded bg-famacle-blue-light text-famacle-blue truncate"
          >
            {!event.allDay && format(parseISO(event.startDate), 'h:mm a')} {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekDayCell;
