
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/utils/types";

export const eventsAPI = {
  /**
   * Fetch all events
   */
  getEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true });
    
    if (error) {
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
      reminders: [], // We'll fetch reminders separately if needed
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }));
  },

  /**
   * Create a new event
   */
  createEvent: async (newEvent: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'reminders'>, userId: string) => {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: newEvent.title,
        description: newEvent.description,
        start_date: newEvent.startDate,
        end_date: newEvent.endDate,
        all_day: newEvent.allDay,
        location: newEvent.location,
        priority: newEvent.priority,
        created_by: userId
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },

  /**
   * Update an event
   */
  updateEvent: async (eventId: string, updates: Partial<Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'reminders'>>) => {
    const dbUpdates: Record<string, any> = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.allDay !== undefined) dbUpdates.all_day = updates.allDay;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('events')
      .update(dbUpdates)
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  },

  /**
   * Delete an event
   */
  deleteEvent: async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    
    if (error) {
      throw error;
    }
    
    return eventId;
  },

  /**
   * Subscribe to event changes
   */
  subscribeToEvents: (callback: Function) => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }
};
