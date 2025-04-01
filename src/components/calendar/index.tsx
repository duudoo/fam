
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { Dialog } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';
import EventManager from './EventManager';
import CalendarHeader from './CalendarHeader';
import CalendarViewWrapper from './CalendarViewWrapper';
import EventDialogContent from './EventDialogContent';
import LoadingSpinner from './LoadingSpinner';
import useAuth from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const CalendarView = () => {
  const { 
    events, 
    selectedDate,
    setSelectedDate,
    view,
    setView,
    isLoading,
    createEvent,
    isPending
  } = useCalendarEvents();
  
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [dateSelected, setDateSelected] = useState(false);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  
  const eventManager = EventManager({ 
    createEvent, 
    isPending 
  });

  // Reset dateSelected flag when view changes
  useEffect(() => {
    setDateSelected(false);
  }, [view]);

  const toggleView = () => {
    setView(view === 'month' ? 'week' : 'month');
    setDateSelected(false); // Reset selection when toggling views
  };
  
  // Handler for day clicks in any view
  const handleDayClick = (date: Date) => {
    console.log('Day clicked:', date);
    setSelectedDate(date);
    setDateSelected(true);
  };
  
  // Handler to reset day selection
  const handleResetDaySelection = () => {
    setDateSelected(false);
  };
  
  // Update the date handler for navigation
  const handleDateChange = (date: Date) => {
    console.log('Setting new date:', date);
    setSelectedDate(date);
    // Keep the dateSelected state if only navigating months/weeks
  };
  
  const handleAddEvent = () => {
    setOpenAddEvent(true);
  };
  
  const handleSubmitEvent = (formData: any) => {
    if (eventManager.handleCreateEvent(formData)) {
      setOpenAddEvent(false);
    }
  };
  
  return (
    <motion.div 
      className="space-y-4 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <CalendarHeader
          date={selectedDate}
          view={view}
          handleDateChange={handleDateChange}
          toggleView={toggleView}
        />
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <CalendarViewWrapper 
            view={view}
            date={selectedDate}
            events={events}
            isLoading={isLoading}
            showDayEvents={dateSelected}
            onDayClick={handleDayClick}
            onAddEvent={handleAddEvent}
            onResetDaySelection={handleResetDaySelection}
          />
        )}
      </div>
      
      {/* Add Event Modal - Dialog for desktop, Drawer for mobile */}
      {isMobile ? (
        <Drawer open={openAddEvent} onOpenChange={setOpenAddEvent}>
          <EventDialogContent 
            isEditing={false}
            onSubmit={handleSubmitEvent}
            onCancel={() => setOpenAddEvent(false)}
            isPending={eventManager.isPending}
            inDrawer={true}
          />
        </Drawer>
      ) : (
        <Dialog open={openAddEvent} onOpenChange={setOpenAddEvent}>
          <EventDialogContent 
            isEditing={false}
            onSubmit={handleSubmitEvent}
            onCancel={() => setOpenAddEvent(false)}
            isPending={eventManager.isPending}
          />
        </Dialog>
      )}
    </motion.div>
  );
};

export default CalendarView;
