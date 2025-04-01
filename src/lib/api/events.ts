
import { supabase } from "@/integrations/supabase/client";
import { Event, Reminder } from "@/utils/types";

export const eventsAPI = {
  /**
   * Fetch all events
   */
  getEvents: async () => {
    // Modify the query to avoid the join with reminders
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
      source: event.source || undefined,
      sourceEventId: event.source_event_id || undefined,
      recurring: event.recurring_type ? {
        type: event.recurring_type,
        endsOn: event.recurring_ends_on || undefined
      } : undefined,
      reminders: [], // Since we can't join with reminders yet, initialize as empty array
      createdAt: event.created_at,
      updatedAt: event.updated_at
    }));
  },

  /**
   * Create a new event
   */
  createEvent: async (newEvent: Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>, userId: string) => {
    const { reminders, recurring, ...eventFields } = newEvent;
    
    // Create the event
    const { data: createdEvent, error: eventError } = await supabase
      .from('events')
      .insert({
        title: eventFields.title,
        description: eventFields.description,
        start_date: eventFields.startDate,
        end_date: eventFields.endDate,
        all_day: eventFields.allDay,
        location: eventFields.location,
        priority: eventFields.priority,
        created_by: userId,
        recurring_type: recurring?.type,
        recurring_ends_on: recurring?.endsOn,
        source: eventFields.source,
        source_event_id: eventFields.sourceEventId
      })
      .select()
      .single();
    
    if (eventError) {
      throw eventError;
    }
    
    // Since reminders table doesn't exist yet, skip creating reminders
    // We'll comment out this code until the reminders table is created
    /*
    if (reminders && reminders.length > 0) {
      const reminderPromises = reminders.map(reminder => {
        return supabase
          .from('reminders')
          .insert({
            event_id: createdEvent.id,
            time: reminder.time,
            type: reminder.type,
            sent: false
          });
      });
      
      await Promise.all(reminderPromises);
    }
    */
    
    return createdEvent;
  },

  /**
   * Update an event
   */
  updateEvent: async (eventId: string, updates: Partial<Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>) => {
    const { reminders, recurring, ...eventUpdates } = updates;
    const dbUpdates: Record<string, any> = {};
    
    if (eventUpdates.title !== undefined) dbUpdates.title = eventUpdates.title;
    if (eventUpdates.description !== undefined) dbUpdates.description = eventUpdates.description;
    if (eventUpdates.startDate !== undefined) dbUpdates.start_date = eventUpdates.startDate;
    if (eventUpdates.endDate !== undefined) dbUpdates.end_date = eventUpdates.endDate;
    if (eventUpdates.allDay !== undefined) dbUpdates.all_day = eventUpdates.allDay;
    if (eventUpdates.location !== undefined) dbUpdates.location = eventUpdates.location;
    if (eventUpdates.priority !== undefined) dbUpdates.priority = eventUpdates.priority;
    if (eventUpdates.source !== undefined) dbUpdates.source = eventUpdates.source;
    if (eventUpdates.sourceEventId !== undefined) dbUpdates.source_event_id = eventUpdates.sourceEventId;
    
    if (recurring !== undefined) {
      dbUpdates.recurring_type = recurring?.type || null;
      dbUpdates.recurring_ends_on = recurring?.endsOn || null;
    }
    
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
    
    // Skip handling reminders until the reminders table exists
    /*
    if (reminders !== undefined) {
      // Delete existing reminders
      await supabase
        .from('reminders')
        .delete()
        .eq('event_id', eventId);
      
      // Add new reminders if any
      if (reminders && reminders.length > 0) {
        const reminderPromises = reminders.map((reminder: Reminder) => {
          return supabase
            .from('reminders')
            .insert({
              event_id: eventId,
              time: reminder.time,
              type: reminder.type,
              sent: reminder.sent || false
            });
        });
        
        await Promise.all(reminderPromises);
      }
    }
    */
    
    return data;
  },

  /**
   * Delete an event
   */
  deleteEvent: async (eventId: string) => {
    // Skip deleting reminders since the table doesn't exist yet
    /*
    await supabase
      .from('reminders')
      .delete()
      .eq('event_id', eventId);
    */
    
    // Delete the event
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
   * Sync with external calendar (Google or Outlook)
   */
  syncExternalCalendar: async (provider: 'google' | 'outlook', token: string, userId: string) => {
    return await supabase.functions.invoke('calendar-sync/sync', {
      body: { provider, token, userId }
    });
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
      /* Comment out reminders subscription until the table exists
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders'
        },
        (payload) => {
          callback(payload);
        }
      )
      */
      .subscribe();

    return channel;
  }
};
