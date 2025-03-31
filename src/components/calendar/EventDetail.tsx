
import { format, parseISO } from 'date-fns';
import { Flag, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Event, EventPriority } from '@/utils/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EventDetailProps {
  event: Event;
}

const EventDetail = ({ event }: EventDetailProps) => {
  const startTime = format(parseISO(event.startDate), 'h:mm a');
  const endTime = event.endDate ? format(parseISO(event.endDate), 'h:mm a') : '';
  
  return (
    <motion.div 
      className="p-4 border-l-3 border-famacle-blue mb-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-famacle-slate">{event.title}</h4>
        <Flag className={cn("w-4 h-4", getPriorityColor(event.priority))} />
      </div>
      
      {!event.allDay && (
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {startTime} {endTime && `- ${endTime}`}
        </p>
      )}
      
      {event.location && (
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {event.location}
        </p>
      )}
      
      {event.description && (
        <p className="text-sm mt-2 text-gray-600 border-t border-gray-100 pt-2">
          {event.description}
        </p>
      )}

      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-famacle-blue">
          Edit
        </Button>
      </div>
    </motion.div>
  );
};

export const getPriorityColor = (priority: EventPriority) => {
  switch(priority) {
    case 'high':
      return 'text-famacle-coral';
    case 'medium':
      return 'text-famacle-blue';
    case 'low':
    default:
      return 'text-famacle-slate-light';
  }
};

export default EventDetail;
