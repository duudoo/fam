
import { supabase } from "@/integrations/supabase/client";
import { Reminder } from "@/utils/types";
import { EventUpdateParams } from "./types";

/**
 * Update an event
 */
export const updateEvent = async (eventId: string, updates: EventUpdateParams) => {
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
};
