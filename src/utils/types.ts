
/**
 * Types for the Famacle application
 */

/**
 * Parent user profile
 */
export type Parent = {
  /** Unique identifier */
  id: string;
  /** Full name of the parent */
  name: string;
  /** Optional URL to avatar image */
  avatar?: string;
  /** Email address */
  email: string;
  /** Optional phone number */
  phone?: string;
};

/**
 * Child profile
 */
export type Child = {
  /** Unique identifier */
  id: string;
  /** Initials of the child's name */
  initials: string;
  /** Full name of the child */
  name?: string;
  /** Date of birth in ISO format (YYYY-MM-DD) */
  dateOfBirth?: string;
  /** IDs of parents related to this child */
  parentIds: string[];
};

/**
 * Status of a co-parent invitation
 */
export type InviteStatus = 
  | 'pending'
  | 'accepted'
  | 'declined';

/**
 * Co-parent invitation details
 */
export type CoParentInvite = {
  /** Unique identifier */
  id: string;
  /** Email address of the invited co-parent */
  email: string;
  /** Current status of the invitation */
  status: InviteStatus;
  /** ID of the parent who sent the invitation */
  invitedBy: string;
  /** ISO timestamp when the invitation was sent */
  invitedAt: string;
  /** ISO timestamp when the invitation was responded to (if applicable) */
  respondedAt?: string;
};

/**
 * Categories for expenses
 */
export type ExpenseCategory = 
  | 'medical'
  | 'education'
  | 'clothing'
  | 'activities'
  | 'food'
  | 'other';

/**
 * Status of an expense
 */
export type ExpenseStatus = 
  | 'pending'
  | 'approved'
  | 'disputed'
  | 'paid';

/**
 * Methods for splitting expenses between co-parents
 */
export type SplitMethod = 
  | 'none'
  | '50/50'
  | 'income-based'
  | 'custom';

/**
 * Expense record
 */
export type Expense = {
  /** Unique identifier */
  id: string;
  /** Short description of the expense */
  description: string;
  /** Monetary amount of the expense */
  amount: number;
  /** Date of the expense in ISO format (YYYY-MM-DD) */
  date: string;
  /** Category of the expense */
  category: ExpenseCategory;
  /** ID of the parent who paid for the expense */
  paidBy: string;
  /** Optional URL to a receipt image */
  receiptUrl?: string;
  /** Current status of the expense */
  status: ExpenseStatus;
  /** Method used to split the expense between co-parents */
  splitMethod: SplitMethod;
  /** For custom splits, percentage allocation by parent ID */
  splitPercentage?: Record<string, number>;
  /** For exact split amounts, monetary allocation by parent ID */
  splitAmounts?: Record<string, number>;
  /** Optional notes about the expense */
  notes?: string;
  /** IDs of children associated with this expense */
  childIds?: string[];
  /** ISO timestamp when the expense was created */
  createdAt: string;
  /** ISO timestamp when the expense was last updated */
  updatedAt: string;
};

/**
 * Priority levels for calendar events
 */
export type EventPriority = 
  | 'high'
  | 'medium'
  | 'low';

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
  /** ISO timestamp when the event was created */
  createdAt?: string;
  /** ISO timestamp when the event was last updated */
  updatedAt?: string;
};

/**
 * Types of reminders
 */
export type ReminderType = 
  | 'push'
  | 'email'
  | 'sms';

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

/**
 * Status of a message
 */
export type MessageStatus = 
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'seen'
  | 'failed';

/**
 * Message in a conversation
 */
export type Message = {
  /** Unique identifier */
  id: string;
  /** ID of the user who sent the message */
  senderId: string;
  /** Text content of the message */
  text: string;
  /** ISO timestamp when the message was sent */
  timestamp: string;
  /** Current status of the message */
  status: MessageStatus;
  /** Optional attachments */
  attachments?: Attachment[];
};

/**
 * Types of attachments
 */
export type AttachmentType = 
  | 'image'
  | 'document'
  | 'audio'
  | 'video'
  | 'other';

/**
 * Attachment in a message
 */
export type Attachment = {
  /** Unique identifier */
  id: string;
  /** Type of attachment */
  type: AttachmentType;
  /** URL to the attachment */
  url: string;
  /** Filename of the attachment */
  name: string;
  /** Optional size in bytes */
  size?: number;
  /** Optional URL to a thumbnail image */
  thumbnailUrl?: string;
};

/**
 * Conversation between users
 */
export type Conversation = {
  /** Unique identifier */
  id: string;
  /** IDs of users participating in the conversation */
  participants: string[];
  /** Optional most recent message */
  lastMessage?: Message;
  /** Number of unread messages */
  unreadCount: number;
  /** ISO timestamp when the conversation was created */
  createdAt: string;
  /** ISO timestamp when the conversation was last updated */
  updatedAt: string;
};

/**
 * User profile with authentication data
 */
export type UserProfile = {
  /** Unique identifier */
  id: string;
  /** Email address */
  email: string;
  /** Optional full name */
  full_name?: string;
  /** Optional first name */
  first_name?: string;
  /** Optional last name */
  last_name?: string;
  /** Optional URL to avatar image */
  avatar_url?: string;
  /** Optional phone number */
  phone?: string;
};
