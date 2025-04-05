
/**
 * Parent-related types for the Famacle application
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
 * Status of a co-parent invitation
 */
export type InviteStatus = 
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired';

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
  /** Optional personal message included with the invitation */
  message?: string;
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
