
import { Event, Reminder } from "@/utils/types";

// Types used internally by the events API
export type EventDbFields = {
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  location?: string;
  priority: string;
  created_by: string;
  recurring_type?: string;
  recurring_ends_on?: string;
  source?: string;
  source_event_id?: string;
};

export type EventCreateParams = Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>;
export type EventUpdateParams = Partial<Omit<Event, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>;
