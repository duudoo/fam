
import { useEffect } from 'react';
import { useEventQueries } from './useEventQueries';
import { useEventMutations } from './useEventMutations';
import { useCalendarState } from './useCalendarState';

/**
 * Combined hook for calendar functionality
 */
export const useCalendarEvents = () => {
  const { 
    events, 
    isLoading, 
    getEventsByDate, 
    eventForDate, 
    subscribeToEventChanges 
  } = useEventQueries();
  
  const {
    createEvent,
    updateEvent,
    deleteEvent,
    syncCalendar,
    isPending
  } = useEventMutations();
  
  const {
    selectedDate,
    setSelectedDate,
    view,
    setView
  } = useCalendarState();

  // Set up realtime subscription to events
  useEffect(() => {
    const channel = subscribeToEventChanges();

    return () => {
      if (channel && 'unsubscribe' in channel) {
        (channel as any).unsubscribe();
      }
    };
  }, []);

  return {
    // Event data
    events,
    isLoading,
    
    // Calendar state
    selectedDate,
    setSelectedDate,
    view,
    setView,
    
    // Event filtering
    getEventsByDate,
    eventForDate,
    
    // Event mutations
    createEvent,
    updateEvent,
    deleteEvent,
    syncCalendar,
    isPending
  };
};
