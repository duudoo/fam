
/**
 * Notification-related types for the Famacle application
 */

/**
 * Types of reminders
 */
export type ReminderType = 
  | 'push'
  | 'email'
  | 'sms';

/**
 * Types of notifications
 */
export type NotificationType = 
  | 'expense_added'
  | 'expense_approved'
  | 'expense_disputed'
  | 'expense_paid'
  | 'event_added'
  | 'event_reminder'
  | 'payment_reminder'
  | 'coparent_invite';

/**
 * Notification record
 */
export type Notification = {
  /** Unique identifier */
  id: string;
  /** Type of notification */
  type: NotificationType;
  /** Human-readable message */
  message: string;
  /** Optional ID of related expense or event */
  relatedId?: string;
  /** ISO timestamp when the notification was created */
  createdAt: string;
  /** Whether the notification has been read */
  read: boolean;
};
