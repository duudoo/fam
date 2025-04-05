
/**
 * Messaging-related types for the Famacle application
 */

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
 * Types of attachments
 */
export type AttachmentType = 
  | 'image'
  | 'document'
  | 'audio'
  | 'video'
  | 'link'
  | 'expense_reference'
  | 'other';

/**
 * Attachment in a message
 */
export type Attachment = {
  /** Unique identifier */
  id: string;
  /** Type of attachment */
  type: AttachmentType;
  /** URL to the attachment if applicable */
  url?: string;
  /** Filename of the attachment if applicable */
  name?: string;
  /** Optional size in bytes */
  size?: number;
  /** Optional URL to a thumbnail image */
  thumbnailUrl?: string;
  /** For expense references, the expense ID */
  expenseId?: string;
  /** For expense references, basic expense info */
  expenseInfo?: {
    description: string;
    amount: number;
    date: string;
    category: string;
  };
};

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
