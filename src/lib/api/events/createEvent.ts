
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/utils/types";
import { EventCreateParams, EventDbFields } from "./types";

/**
 * Create a new event
 */
export const createEvent = async (newEvent: EventCreateParams, userId: string) => {
  const { reminders, recurring, ...eventFields } = newEvent;
  
  // Prepare event data for database
  const eventData: EventDbFields = {
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
  };
  
  // Create the event
  const { data: createdEvent, error: eventError } = await supabase
    .from('events')
    .insert(eventData)
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
};
