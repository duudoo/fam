
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, MapPin } from 'lucide-react';

interface WeekDayCellProps {
  day: Date;
  events: Event[];
  isToday: boolean;
}

const WeekDayCell = ({ day, events, isToday }: WeekDayCellProps) => {
  return (
    <div className="min-h-[200px] flex flex-col rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={cn(
        "text-center p-2 font-medium",
        isToday ? "bg-famacle-blue text-white" : "bg-gray-100"
      )}>
        <div className="text-xs">{format(day, 'EEE')}</div>
        <div className="text-lg">{format(day, 'd')}</div>
      </div>
      
      <div className="p-1 flex-1 bg-white overflow-y-auto max-h-[160px]">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No events
          </div>
        ) : (
          events.map((event, index) => (
            <TooltipProvider key={event.id}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <motion.div 
                    className={cn(
                      "text-xs p-1.5 mb-1 rounded truncate cursor-pointer",
                      event.priority === 'high' ? "bg-famacle-coral/10 text-famacle-coral border-l-2 border-famacle-coral" :
                      event.priority === 'medium' ? "bg-famacle-blue-light text-famacle-blue border-l-2 border-famacle-blue" :
                      "bg-gray-50 text-gray-600 border-l-2 border-gray-300"
                    )}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {!event.allDay && (
                      <span className="font-medium mr-1">
                        {format(parseISO(event.startDate), 'h:mm a')}
                      </span>
                    )}
                    {event.title}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs p-3 bg-white border border-gray-100 shadow-md rounded-md">
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
            </TooltipProvider>
          ))
        )}
      </div>
    </div>
  );
};

export default WeekDayCell;
