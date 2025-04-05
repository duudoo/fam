
import { supabase } from "@/integrations/supabase/client";
import { CoParentInvite } from "@/utils/types";

/**
 * Fetch invitations sent by the current user
 */
export const fetchSentInvites = async (userId: string): Promise<CoParentInvite[]> => {
  try {
    console.log("Fetching sent invites for user:", userId);
    
    const { data, error } = await supabase
      .from('co_parent_invites')
      .select('*')
      .eq('invited_by', userId);
      
    if (error) {
      console.error('Error fetching sent invites:', error);
      throw error;
    }

    console.log("Received sent invites:", data);

    // Transform DB results to match our CoParentInvite type
    return data.map(invite => ({
      id: invite.id,
      email: invite.email,
      status: invite.status as any,
      invitedBy: invite.invited_by,
      invitedAt: invite.invited_at,
      respondedAt: invite.responded_at,
      message: invite.message || undefined
    }));
  } catch (err) {
    console.error('Failed to fetch sent invites:', err);
    throw err;
  }
};

/**
 * Fetch invitations received by the user with the given email
 */
export const fetchReceivedInvites = async (email: string): Promise<CoParentInvite[]> => {
  try {
    console.log("Fetching received invites for email:", email);
    
    const { data, error } = await supabase
      .from('co_parent_invites')
      .select('*')
      .eq('email', email);
      
    if (error) {
      console.error('Error fetching received invites:', error);
      throw error;
    }

    console.log("Received invites:", data);

    // Transform DB results to match our CoParentInvite type
    return data.map(invite => ({
      id: invite.id,
      email: invite.email,
      status: invite.status as any,
      invitedBy: invite.invited_by,
      invitedAt: invite.invited_at,
      respondedAt: invite.responded_at,
      message: invite.message || undefined
    }));
  } catch (err) {
    console.error('Failed to fetch received invites:', err);
    throw err;
  }
};

/**
 * Accept an invitation
 */
export const acceptInvite = async (inviteId: string) => {
  try {
    console.log("Accepting invite:", inviteId);
    
    const { error } = await supabase
      .from('co_parent_invites')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', inviteId);
    
    if (error) {
      console.error("Error accepting invitation:", error);
      throw error;
    }
    
    console.log("Invitation accepted successfully");
    return { success: true };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

/**
 * Decline an invitation
 */
export const declineInvite = async (inviteId: string) => {
  try {
    console.log("Declining invite:", inviteId);
    
    const { error } = await supabase
      .from('co_parent_invites')
      .update({
        status: 'declined',
        responded_at: new Date().toISOString()
      })
      .eq('id', inviteId);
    
    if (error) {
      console.error("Error declining invitation:", error);
      throw error;
    }
    
    console.log("Invitation declined successfully");
    return { success: true };
  } catch (error) {
    console.error("Error declining invitation:", error);
    throw error;
  }
};
