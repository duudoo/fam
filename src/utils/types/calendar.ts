/**
 * Calendar-related types for the Famacle application
 */

import { ReminderType } from './notification';

/**
 * Priority levels for calendar events
 */
export type EventPriority = 
  | 'high'
  | 'medium'
  | 'low';

/**
 * External calendar sources
 */
export type CalendarSource = 'google' | 'outlook';

/**
 * Recurring event types
 */
export type RecurringType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

/**
 * Recurring event settings
 */
export type RecurringSettings = {
  /** Type of recurrence */
  type: RecurringType;
  /** Optional end date for the recurring event */
  endsOn?: string;
};

/**
 * Calendar event
 */
export type Event = {
  /** Unique identifier */
  id: string;
  /** Title of the event */
  title: string;
  /** Optional detailed description */
  description?: string;
  /** Start date/time in ISO format */
  startDate: string;
  /** Optional end date/time in ISO format */
  endDate?: string; 
  /** Whether this is an all-day event */
  allDay: boolean;
  /** Optional physical location of the event */
  location?: string;
  /** Priority level of the event */
  priority: EventPriority;
  /** ID of the parent who created the event */
  createdBy: string;
  /** Reminders associated with this event */
  reminders: Reminder[];
  /** Optional recurrence settings */
  recurring?: RecurringSettings;
  /** Optional source of the event (for synced calendars) */
  source?: CalendarSource;
  /** Optional source event ID (for synced calendars) */
  sourceEventId?: string;
  /** ISO timestamp when the event was created */
  createdAt?: string;
  /** ISO timestamp when the event was last updated */
  updatedAt?: string;
};

/**
 * Reminder for an event
 */
export type Reminder = {
  /** Unique identifier */
  id: string;
  /** ISO timestamp when the reminder should trigger */
  time: string;
  /** Type of notification to send */
  type: ReminderType;
  /** Whether the reminder has been sent */
  sent: boolean;
};
