
export type Parent = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
};

export type Child = {
  id: string;
  initials: string;
  name?: string;
  dateOfBirth?: string;
  parentIds: string[];
};

export type InviteStatus = 
  | 'pending'
  | 'accepted'
  | 'declined';

export type CoParentInvite = {
  id: string;
  email: string;
  status: InviteStatus;
  invitedBy: string; // parent ID
  invitedAt: string;
  respondedAt?: string;
};

export type ExpenseCategory = 
  | 'medical'
  | 'education'
  | 'clothing'
  | 'activities'
  | 'food'
  | 'other';

export type ExpenseStatus = 
  | 'pending'
  | 'approved'
  | 'disputed'
  | 'paid';

export type SplitMethod = 
  | '50/50'
  | 'income-based'
  | 'custom';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  paidBy: string; // parent ID
  receiptUrl?: string;
  status: ExpenseStatus;
  splitMethod: SplitMethod;
  splitPercentage?: { [parentId: string]: number }; // for custom splits
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type EventPriority = 
  | 'high'
  | 'medium'
  | 'low';

export type Event = {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string; 
  allDay: boolean;
  location?: string;
  priority: EventPriority;
  createdBy: string; // parent ID
  reminders: Reminder[];
};

export type ReminderType = 
  | 'push'
  | 'email'
  | 'sms';

export type Reminder = {
  id: string;
  time: string; // ISO string
  type: ReminderType;
  sent: boolean;
};

export type NotificationType = 
  | 'expense_added'
  | 'expense_approved'
  | 'expense_disputed'
  | 'expense_paid'
  | 'event_added'
  | 'event_reminder'
  | 'payment_reminder'
  | 'coparent_invite';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  relatedId?: string; // ID of related expense or event
  createdAt: string;
  read: boolean;
};

export type MessageStatus = 
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'seen'
  | 'failed';

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: string;
  attachments?: Attachment[];
};

export type AttachmentType = 
  | 'image'
  | 'document'
  | 'audio'
  | 'video'
  | 'other';

export type Attachment = {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
};

export type Conversation = {
  id: string;
  participants: string[]; // parent IDs
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone?: string;
};
