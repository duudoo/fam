
import { supabase } from "@/integrations/supabase/client";

/**
 * Sync with external calendar (Google or Outlook)
 */
export const syncExternalCalendar = async (provider: 'google' | 'outlook', token: string, userId: string) => {
  try {
    console.log(`Invoking calendar-sync/sync with provider: ${provider}`);
    
    // Make sure to include authorization headers by using the supabase client's invoke method
    const response = await supabase.functions.invoke('calendar-sync/sync', {
      body: { 
        provider, 
        token, 
        userId 
      }
    });
    
    console.log('Sync response:', response);
    
    return response;
  } catch (error) {
    console.error('Error syncing calendar:', error);
    throw error;
  }
};
