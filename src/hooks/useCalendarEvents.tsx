
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseISO, isWithinInterval, isSameDay } from 'date-fns';
import { Event, Reminder } from '@/utils/types';
import { eventsAPI } from '@/lib/api/events';

export const useCalendarEvents = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        return await eventsAPI.getEvents();
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        throw error;
      }
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async ({ 
      newEvent, 
      userId 
    }: { 
      newEvent: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>, 
      userId: string 
    }) => {
      return await eventsAPI.createEvent(newEvent, userId);
    },
    onSuccess: () => {
      toast.success('Event created successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast.error('Failed to create event');
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...updatedEvent }: Partial<Event> & { id: string }) => {
      return await eventsAPI.updateEvent(id, updatedEvent);
    },
    onSuccess: () => {
      toast.success('Event updated successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast.error('Failed to update event');
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return await eventsAPI.deleteEvent(id);
    },
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast.error('Failed to delete event');
    }
  });

  // Sync calendars mutation
  const syncCalendarsMutation = useMutation({
    mutationFn: async ({ 
      provider, 
      token, 
      userId 
    }: { 
      provider: 'google' | 'outlook', 
      token: string, 
      userId: string 
    }) => {
      const { data, error } = await eventsAPI.syncExternalCalendar(provider, token, userId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Calendar synced successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast.error('Failed to sync calendar');
    }
  });

  // Helper functions for event filtering
  const getEventsByDate = (date: Date) => {
    if (!events) return [];
    
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

  // Set up realtime subscription to events
  useEffect(() => {
    const channel = eventsAPI.subscribeToEvents(() => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    });

    return () => {
      if (channel && 'unsubscribe' in channel) {
        (channel as any).unsubscribe();
      }
    };
  }, [queryClient]);

  return {
    events,
    isLoading,
    selectedDate,
    setSelectedDate,
    view,
    setView,
    getEventsByDate,
    eventForDate,
    createEvent: (newEvent: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>, userId: string) => 
      createEventMutation.mutate({ newEvent, userId }),
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    syncCalendar: (provider: 'google' | 'outlook', token: string, userId: string) =>
      syncCalendarsMutation.mutate({ provider, token, userId }),
    isPending: createEventMutation.isPending || updateEventMutation.isPending || deleteEventMutation.isPending || syncCalendarsMutation.isPending
  };
};
