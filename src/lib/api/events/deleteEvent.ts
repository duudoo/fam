
import { supabase } from "@/integrations/supabase/client";

/**
 * Delete an event
 */
export const deleteEvent = async (eventId: string) => {
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
};
