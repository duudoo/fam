
import { format } from 'date-fns';
import { Event } from '@/utils/types';
import EventDetail from '../EventDetail';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
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
import { useState } from 'react';

interface SelectedDayEventsProps {
  date: Date;
  events: Event[];
  onAddEvent?: () => void;
  onBackToUpcoming?: () => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

const SelectedDayEvents = ({ 
  date, 
  events, 
  onAddEvent, 
  onBackToUpcoming, 
  onEditEvent, 
  onDeleteEvent 
}: SelectedDayEventsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  
  // Get the actual count of events
  const eventCount = events.length;
  
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
  
  // Improved click handler with console logging
  const handleBackToUpcoming = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Back to upcoming clicked in SelectedDayEvents');
    if (onBackToUpcoming) {
      onBackToUpcoming();
    }
  };
  
  return (
    <div className="bg-famacle-blue-light/10 p-4 rounded-lg">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium flex items-center text-famacle-slate">
          <span className="bg-white p-1 rounded mr-2 shadow-sm">
            {format(date, 'd')}
          </span>
          {eventCount === 0 ? 'No events' : 
            eventCount === 1 ? '1 Event' : 
            `${eventCount} Events`} for {format(date, 'MMMM d, yyyy')}
        </h3>
      </div>
      
      <div className="space-y-2 mt-4">
        {events.length > 0 ? (
          events.map(event => (
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
      </div>
      
      {/* Repositioned Back to Upcoming button with improved clickable area */}
      <div className="mt-6 flex justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToUpcoming}
          className="text-famacle-blue hover:text-famacle-blue/80 flex-shrink-0 py-3 px-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Upcoming
        </Button>
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

export default SelectedDayEvents;
