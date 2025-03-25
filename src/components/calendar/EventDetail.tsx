
import { format, parseISO } from 'date-fns';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Event, EventPriority } from '@/utils/types';

interface EventDetailProps {
  event: Event;
}

const EventDetail = ({ event }: EventDetailProps) => {
  const startTime = format(parseISO(event.startDate), 'h:mm a');
  const endTime = event.endDate ? format(parseISO(event.endDate), 'h:mm a') : '';
  
  return (
    <div className="p-3 border-l-2 border-famacle-blue mb-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{event.title}</h4>
        <Flag className={cn("w-4 h-4", getPriorityColor(event.priority))} />
      </div>
      
      {!event.allDay && (
        <p className="text-sm text-gray-500">
          {startTime} {endTime && `- ${endTime}`}
        </p>
      )}
      
      {event.location && (
        <p className="text-sm text-gray-500 mt-1">
          {event.location}
        </p>
      )}
      
      {event.description && (
        <p className="text-sm mt-2">
          {event.description}
        </p>
      )}
    </div>
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
