
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/utils/types";

/**
 * Fetch all events
 */
export const getEvents = async (): Promise<Event[]> => {
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
};
