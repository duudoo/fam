
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import { DayContentProps } from 'react-day-picker';

interface DayCellProps extends DayContentProps {
  events: Event[];
  getEventsByDate: (date: Date) => Event[];
  selectedDate: Date;
}

const DayCell = ({ 
  date: dayDate, 
  events, 
  getEventsByDate,
  selectedDate,
  ...props
}: DayCellProps) => {
  if (!dayDate) return null;
  
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
      onClick={() => dayDate && props.onClick?.(dayDate)}
    >
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        {hasEvents && !isSameDay(dayDate, selectedDate) && (
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
                isSameDay(dayDate, selectedDate)
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

export default DayCell;
