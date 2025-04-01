
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Event } from '@/utils/types';
import { 
  CalendarRange, 
  MapPin, 
  Clock, 
  Calendar,
  Info,
  AlertCircle,
  Chrome,
  Mail
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventDetailProps {
  event: Event;
  compact?: boolean;
}

const EventDetail = ({ event, compact = false }: EventDetailProps) => {
  const startDate = parseISO(event.startDate);
  const endDate = event.endDate ? parseISO(event.endDate) : null;
  
  const priorityColors = {
    high: 'bg-famacle-coral text-white',
    medium: 'bg-famacle-blue text-white',
    low: 'bg-famacle-slate-light text-white'
  };
  
  const sourceIcon = useMemo(() => {
    if (!event.source) return null;
    
    switch (event.source) {
      case 'google':
        return <Chrome className="h-3 w-3 mr-1" />;
      case 'outlook':
        return <Mail className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  }, [event.source]);
  
  return (
    <div className={cn(
      "bg-white rounded-lg border p-3 shadow-sm hover:shadow transition-all",
      compact ? "p-2" : "p-3"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className={cn(
              "font-medium text-famacle-slate",
              compact ? "text-sm" : "text-base"
            )}>
              {event.title}
            </h3>
            
            {event.source && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="ml-2 text-xs py-0 h-5 flex items-center">
                      {sourceIcon}
                      {event.source}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Synced from {event.source}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {!compact && event.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{event.description}</p>
          )}
          
          <div className={cn("flex flex-wrap gap-y-1", compact ? "mt-1" : "mt-2")}>
            {event.allDay ? (
              <div className={cn(
                "flex items-center text-gray-500 mr-3",
                compact ? "text-xs" : "text-sm"
              )}>
                <CalendarRange className={cn(
                  "text-famacle-blue mr-1",
                  compact ? "h-3 w-3" : "h-4 w-4"
                )} />
                All day
              </div>
            ) : (
              <div className={cn(
                "flex items-center text-gray-500 mr-3",
                compact ? "text-xs" : "text-sm"
              )}>
                <Clock className={cn(
                  "text-famacle-blue mr-1",
                  compact ? "h-3 w-3" : "h-4 w-4"
                )} />
                {format(startDate, 'h:mm a')}
                {endDate && ` - ${format(endDate, 'h:mm a')}`}
              </div>
            )}
            
            {!compact && (
              <div className="flex items-center text-gray-500 mr-3 text-sm">
                <Calendar className="text-famacle-blue h-4 w-4 mr-1" />
                {format(startDate, 'MMM d, yyyy')}
              </div>
            )}
            
            {event.location && (
              <div className={cn(
                "flex items-center text-gray-500",
                compact ? "text-xs" : "text-sm"
              )}>
                <MapPin className={cn(
                  "text-famacle-blue mr-1",
                  compact ? "h-3 w-3" : "h-4 w-4"
                )} />
                {event.location}
              </div>
            )}
          </div>
        </div>
        
        <Badge className={cn(
          "ml-2",
          priorityColors[event.priority],
          compact ? "text-xs py-0 px-2" : ""
        )}>
          {event.priority}
        </Badge>
      </div>
    </div>
  );
};

export default EventDetail;
