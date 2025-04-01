
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe to event changes
 */
export const subscribeToEvents = (callback: Function) => {
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
};
