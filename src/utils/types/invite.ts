
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
