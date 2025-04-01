
import { Event } from '@/utils/types';
import { format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';
import EventDetail from '../EventDetail';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
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

interface WeekEventsProps {
  events: Event[];
  selectedDate: Date | null;
  onAddEvent?: () => void;
  onBackToUpcoming?: () => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const WeekEvents = ({ 
  events, 
  selectedDate, 
  onAddEvent, 
  onBackToUpcoming,
  onEditEvent,
  onDeleteEvent
}: WeekEventsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  if (!selectedDate) return null;
  
  const dayEvents = events.filter(event => {
    const eventStartDate = new Date(event.startDate);
    const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate;
    
    return event.allDay 
      ? isSameDay(eventStartDate, selectedDate)
      : isSameDay(eventStartDate, selectedDate) || isSameDay(eventEndDate, selectedDate);
  });
  
  // Get the actual count of events
  const eventCount = dayEvents.length;
  
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
  
  return (
    <div className="space-y-2 mt-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className="text-lg font-medium text-famacle-slate">
          {eventCount === 0 ? 'No events' : 
            eventCount === 1 ? '1 Event' : 
            `${eventCount} Events`} for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBackToUpcoming}
          className="text-famacle-blue hover:text-famacle-blue/80 whitespace-nowrap flex-shrink-0"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Upcoming
        </Button>
      </div>
      
      {dayEvents.length > 0 ? (
        dayEvents.map(event => (
          <EventDetail 
            key={event.id} 
            event={event}
            onEdit={handleEditEvent}
            onDelete={handleDeleteClick}
          />
        ))
      ) : (
        <div className="bg-white p-4 rounded-md text-center border border-dashed border-gray-200">
          <p className="text-gray-500 mb-2">No events scheduled for this day.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-1 text-famacle-blue border-famacle-blue-light"
            onClick={onAddEvent}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Event
          </Button>
        </div>
      )}
      
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

export default WeekEvents;
