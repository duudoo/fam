
import { format, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/utils/types';
import { motion } from 'framer-motion';

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
            <motion.div 
              key={event.id} 
              className={cn(
                "text-xs p-1.5 mb-1 rounded truncate",
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
          ))
        )}
      </div>
    </div>
  );
};

export default WeekDayCell;
