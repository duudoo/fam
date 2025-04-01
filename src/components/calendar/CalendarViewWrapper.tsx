
import { motion } from 'framer-motion';
import MonthView from './MonthView';
import WeekView from './WeekView';
import { Event } from '@/utils/types';
import { useState } from 'react';
import AddEventDialog from './AddEventDialog';

interface CalendarViewWrapperProps {
  view: 'month' | 'week';
  date: Date;
  events: Event[];
  isLoading: boolean;
  showDayEvents: boolean;
  onDayClick: (date: Date) => void;
  onAddEvent: () => void;
  onResetDaySelection: () => void;
}

const CalendarViewWrapper = ({
  view,
  date,
  events,
  isLoading,
  showDayEvents,
  onDayClick,
  onAddEvent,
  onResetDaySelection
}: CalendarViewWrapperProps) => {
  const [editEventDialogOpen, setEditEventDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
  
  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setEditEventDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-famacle-slate animate-spin h-8 w-8 border-4 border-famacle-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        key={`calendar-${view}-${date.toISOString()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="mt-4"
      >
        {view === 'month' ? (
          <MonthView 
            date={date}
            setDate={onDayClick}
            events={events}
            showDayEvents={showDayEvents}
            onAddEvent={onAddEvent}
            onResetDaySelection={onResetDaySelection}
            onEditEvent={handleEditEvent}
          />
        ) : (
          <WeekView 
            date={date}
            events={events}
            onDayClick={onDayClick}
            onAddEvent={onAddEvent}
            onResetDaySelection={onResetDaySelection}
            onEditEvent={handleEditEvent}
          />
        )}
      </motion.div>
      
      {/* Edit Event Dialog */}
      <AddEventDialog 
        open={editEventDialogOpen} 
        onOpenChange={setEditEventDialogOpen} 
        eventToEdit={eventToEdit} 
      />
    </>
  );
};

export default CalendarViewWrapper;
