
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import { DayContentProps } from 'react-day-picker';
import { motion } from 'framer-motion';

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
  
  // Access the correct properties from DayContentProps
  const isToday = props.activeModifiers?.today ?? false;
  const isSelected = props.activeModifiers?.selected ?? false;
  const isOutside = props.activeModifiers?.outside ?? false;
  
  return (
    <div
      className={cn(
        "relative p-2 transition-colors hover:bg-muted/30 rounded-md",
        isToday && "font-bold bg-famacle-blue-light/30",
        isSelected && "bg-famacle-blue-light text-famacle-blue hover:bg-famacle-blue-light/90",
        isOutside && "text-muted-foreground opacity-40",
        hasEvents && !isSelected && "font-medium"
      )}
      style={{ textAlign: "center" }}
    >
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        {hasEvents && !isSelected && (
          <div className="flex gap-0.5 mt-1">
            {dayEvents.length > 0 && (
              <motion.span 
                className="w-1.5 h-1.5 bg-famacle-blue rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
            {dayEvents.length > 1 && (
              <motion.span 
                className="w-1.5 h-1.5 bg-famacle-coral rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              />
            )}
          </div>
        )}
      </div>
      
      <div className="mb-0.5 text-sm md:text-base">{format(dayDate, "d")}</div>
      
      {hasEvents && dayEvents.length > 0 && (
        <div className="mt-1 space-y-1">
          {dayEvents.slice(0, 2).map((event, idx) => (
            <motion.div 
              key={event.id} 
              className={cn(
                "text-xs truncate rounded px-1 py-0.5",
                isSelected
                  ? "bg-white/20 text-famacle-slate" 
                  : "bg-famacle-blue-light/80 text-famacle-slate"
              )}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + idx * 0.1 }}
            >
              {event.title}
            </motion.div>
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
