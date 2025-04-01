
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventsAPI } from '@/lib/api/events';
import { Event } from '@/utils/types';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';

/**
 * Hook for fetching calendar events with filtering capabilities
 */
export const useEventQueries = () => {
  const queryClient = useQueryClient();

  // Fetch all events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        return await eventsAPI.getEvents();
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events. Please try again later.');
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  // Set up realtime subscription to events
  const subscribeToEventChanges = () => {
    const channel = eventsAPI.subscribeToEvents(() => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    });

    return channel;
  };

  // Helper functions for event filtering
  const getEventsByDate = (date: Date) => {
    if (!events || events.length === 0) return [];
    
    return events.filter(event => {
      const eventStartDate = parseISO(event.startDate);
      const eventEndDate = event.endDate ? parseISO(event.endDate) : eventStartDate;
      
      return event.allDay 
        ? isSameDay(eventStartDate, date)
        : isWithinInterval(date, { start: eventStartDate, end: eventEndDate });
    });
  };
  
  const eventForDate = (date: Date) => {
    const eventsToday = getEventsByDate(date);
    return eventsToday.length > 0;
  };

  return {
    events,
    isLoading,
    getEventsByDate,
    eventForDate,
    subscribeToEventChanges
  };
};
