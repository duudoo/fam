
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import { DayContentProps } from 'react-day-picker';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, MapPin } from 'lucide-react';
import { parseISO } from 'date-fns';

interface DayCellProps extends DayContentProps {
  events: Event[];
  getEventsByDate: (date: Date) => Event[];
  selectedDate: Date;
  onDayClick?: (date: Date) => void;
}

const DayCell = ({ 
  date: dayDate, 
  events, 
  getEventsByDate,
  selectedDate,
  onDayClick,
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
        "relative p-2 transition-colors hover:bg-muted/30 rounded-md cursor-pointer",
        isToday && "font-bold bg-famacle-blue-light/30",
        isSelected && "bg-famacle-blue-light text-famacle-blue hover:bg-famacle-blue-light/90",
        isOutside && "text-muted-foreground opacity-40",
        hasEvents && !isSelected && "font-medium"
      )}
      style={{ textAlign: "center" }}
      onClick={() => dayDate && onDayClick && onDayClick(dayDate)}
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
            <Tooltip key={event.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <motion.div 
                  className={cn(
                    "text-xs truncate rounded px-1 py-0.5 cursor-pointer",
                    isSelected
                      ? "bg-white/20 text-famacle-slate" 
                      : "bg-famacle-blue-light/80 text-famacle-slate"
                  )}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + idx * 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering day click
                  }}
                >
                  {event.title}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs p-3 bg-white border border-gray-100 shadow-md rounded-md z-50">
                <div className="space-y-2">
                  <div className="font-medium text-famacle-slate">{event.title}</div>
                  {!event.allDay && (
                    <div className="text-xs flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(parseISO(event.startDate), 'h:mm a')}
                        {event.endDate && ` - ${format(parseISO(event.endDate), 'h:mm a')}`}
                      </span>
                    </div>
                  )}
                  {event.location && (
                    <div className="text-xs flex items-center gap-1 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.description && (
                    <div className="text-xs text-gray-600 pt-1 mt-1 border-t border-gray-100">
                      {event.description}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
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
