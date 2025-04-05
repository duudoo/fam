import { useState, useEffect } from 'react';
import { useEventQueries } from './calendar/useEventQueries';
import { useEventMutations } from './calendar/useEventMutations';
import { useCalendarState } from './calendar/useCalendarState';
import { useAuth } from './useAuth';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

// Define CalendarSource type directly since it's not exported from utils/types
type CalendarSource = 'google' | 'outlook';

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

  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Check for auth callback parameters on mount or when the URL changes
  useEffect(() => {
    // Process calendar authentication callback if present
    const provider = searchParams.get('provider') as CalendarSource | null;
    const accessToken = searchParams.get('access_token');
    const error = searchParams.get('error');
    
    if (provider && accessToken && user?.id) {
      // Clear URL parameters without page reload
      setSearchParams({});
      
      // Trigger the calendar sync with the received token
      syncCalendar(provider, accessToken, user.id);
      toast.success(`Connected to ${provider} calendar. Syncing events...`);
    } 
    else if (error) {
      toast.error(`Failed to connect: ${error}`);
      // Clear URL parameters without page reload
      setSearchParams({});
    }
  }, [searchParams, user]);
  
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
