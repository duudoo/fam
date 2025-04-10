
import { useState, useEffect } from 'react';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { Event } from '@/utils/types';
import EventDetail from './EventDetail';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UpcomingEventsProps {
  events: Event[];
  limit?: number;
  alwaysShowToggle?: boolean;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const UpcomingEvents = ({ 
  events, 
  limit = 2, 
  alwaysShowToggle = false,
  onEditEvent,
  onDeleteEvent
}: UpcomingEventsProps) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  useEffect(() => {
    // Filter and sort all upcoming events
    const now = new Date();
    const filtered = events
      .filter(event => {
        const eventDate = parseISO(event.startDate);
        return isToday(eventDate) || !isPast(eventDate);
      })
      .sort((a, b) => {
        return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
      });
    
    setFilteredEvents(filtered);
    
    // Set the displayed events based on showAll state
    if (showAll) {
      setUpcomingEvents(filtered);
    } else {
      setUpcomingEvents(filtered.slice(0, limit));
    }
  }, [events, limit, showAll]);
  
  const handleToggleShowAll = () => {
    setShowAll(prev => !prev);
  };
  
  const handleEditEvent = (event: Event) => {
    onEditEvent && onEditEvent(event);
  };
  
  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (eventToDelete && onDeleteEvent) {
      onDeleteEvent(eventToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  
  const shouldShowToggle = alwaysShowToggle || filteredEvents.length > limit;
  
  return (
    <div className="bg-famacle-blue-light/10 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium flex items-center text-famacle-slate">
          <Calendar className="h-5 w-5 mr-2 text-famacle-blue" />
          Upcoming
        </h3>
        
        {shouldShowToggle && filteredEvents.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleShowAll}
            className="text-famacle-blue hover:text-famacle-blue/80 text-xs flex items-center h-7 px-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Show All {filteredEvents.length > 0 && `(${filteredEvents.length})`} <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="space-y-2 mt-4">
        {upcomingEvents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1
                }}
              >
                <div className={cn(
                  "mb-3 font-medium text-sm text-famacle-slate",
                  index > 0 ? "mt-4" : ""
                )}>
                  {isToday(parseISO(event.startDate)) 
                    ? "Today" 
                    : format(parseISO(event.startDate), 'EEEE, MMMM d')}
                </div>
                <EventDetail 
                  event={event} 
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteClick}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white p-5 rounded-md text-center border border-dashed border-gray-200">
            <p className="text-gray-500">No upcoming events scheduled.</p>
          </div>
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              "{eventToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-famacle-coral hover:bg-famacle-coral/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UpcomingEvents;
