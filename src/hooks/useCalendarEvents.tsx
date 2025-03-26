
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { parseISO, format, isWithinInterval, isSameDay } from 'date-fns';
import { Event } from '@/utils/types';

export const useCalendarEvents = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
        throw error;
      }
      
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || undefined,
        startDate: event.start_date,
        endDate: event.end_date || undefined,
        allDay: event.all_day,
        location: event.location || undefined,
        priority: event.priority as 'high' | 'medium' | 'low',
        createdBy: event.created_by,
        reminders: [] // We'll fetch reminders separately if needed
      }));
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (newEvent: Omit<Event, 'id' | 'createdBy' | 'reminders'>) => {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          start_date: newEvent.startDate,
          end_date: newEvent.endDate,
          all_day: newEvent.allDay,
          location: newEvent.location,
          priority: newEvent.priority
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }
      
      return data;
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
      const { data, error } = await supabase
        .from('events')
        .update({
          title: updatedEvent.title,
          description: updatedEvent.description,
          start_date: updatedEvent.startDate,
          end_date: updatedEvent.endDate,
          all_day: updatedEvent.allDay,
          location: updatedEvent.location,
          priority: updatedEvent.priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }
      
      return data;
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
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: () => {
      toast.error('Failed to delete event');
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
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['events'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    isPending: createEventMutation.isPending || updateEventMutation.isPending || deleteEventMutation.isPending
  };
};
