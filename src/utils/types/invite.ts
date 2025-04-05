
/**
 * Status of a co-parent invitation
 */
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';

/**
 * Model for a co-parent invitation
 */
export type CoParentInvite = {
  id: string;
  email: string;
  status: InviteStatus;
  invitedBy: string;
  invitedAt: string;
  respondedAt?: string;
  message?: string;
};

/**
 * Type for an invitation record
 */
export type Invite = {
  id: string;
  email: string;
  status: InviteStatus;
  created_at: string;
  updated_at: string;
  sender_id: string;
  message?: string;
};

/**
 * Type for an invitation with user details
 */
export type InviteWithUserDetails = Invite & {
  sender: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

/**
 * Type for invitation response
 */
export type InviteResponse = {
  success: boolean;
  message?: string;
  error?: string;
  invite?: Invite;
};
