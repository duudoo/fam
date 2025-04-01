
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { eventsAPI } from '@/lib/api/events';
import { Event } from '@/utils/types';

/**
 * Hook for event mutations (create, update, delete, sync)
 */
export const useEventMutations = () => {
  const queryClient = useQueryClient();

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
    onError: (error) => {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
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
    onError: (error) => {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event. Please try again.');
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
    onError: (error) => {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event. Please try again.');
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
    onError: (error) => {
      console.error('Failed to sync calendar:', error);
      toast.error('Failed to sync calendar. Please try again.');
    }
  });

  // Expose mutation functions with simplified interfaces
  return {
    createEvent: (newEvent: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>, userId: string) => 
      createEventMutation.mutate({ newEvent, userId }),
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    syncCalendar: (provider: 'google' | 'outlook', token: string, userId: string) =>
      syncCalendarsMutation.mutate({ provider, token, userId }),
    isPending: createEventMutation.isPending || updateEventMutation.isPending || 
      deleteEventMutation.isPending || syncCalendarsMutation.isPending
  };
};
