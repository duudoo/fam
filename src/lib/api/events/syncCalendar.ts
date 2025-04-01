
import { supabase } from "@/integrations/supabase/client";

/**
 * Sync with external calendar (Google or Outlook)
 */
export const syncExternalCalendar = async (provider: 'google' | 'outlook', token: string, userId: string) => {
  return await supabase.functions.invoke('calendar-sync/sync', {
    body: { provider, token, userId }
  });
};
