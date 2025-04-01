
import { supabase } from "@/integrations/supabase/client";

/**
 * Sync with external calendar (Google or Outlook)
 */
export const syncExternalCalendar = async (provider: 'google' | 'outlook', token: string, userId: string) => {
  try {
    return await supabase.functions.invoke('calendar-sync/sync', {
      body: { provider, token, userId }
    });
  } catch (error) {
    console.error('Error syncing calendar:', error);
    throw error;
  }
};
