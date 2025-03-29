
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe to expense changes
 */
export const subscribeToExpenses = (callback: Function) => {
  const channel = supabase
    .channel('expenses-subscription')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'expenses',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return channel;
};
