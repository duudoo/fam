
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
      throw new Error(`Failed to fetch sent invites: ${error.message}`);
    }

    if (!data) {
      return [];
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
      .eq('email', email)
      .eq('status', 'pending');
      
    if (error) {
      console.error('Error fetching received invites:', error);
      throw error;
    }

    if (!data) {
      return [];
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
 * Create an invitation to a co-parent
 */
export const createInvite = async (email: string, userId: string, message?: string): Promise<{data?: any, error?: string}> => {
  try {
    console.log("Creating invitation:", { email, userId, message });
    
    // Check if email already has an invite from this user by querying co_parent_invites directly
    const { data: existingInvites, error: checkError } = await supabase
      .from('co_parent_invites')
      .select('id')
      .eq('email', email)
      .eq('invited_by', userId)
      .eq('status', 'pending');
    
    if (checkError) {
      console.error("Error checking existing invites:", checkError);
      return { error: `Failed to check existing invitations: ${checkError.message}` };
    }
    
    if (existingInvites && existingInvites.length > 0) {
      return { error: "You have already invited this email address" };
    }

    // Create a new invitation
    const { data, error } = await supabase
      .from('co_parent_invites')
      .insert({
        email: email,
        invited_by: userId,
        status: 'pending',
        message: message || null
      })
      .select();
    
    if (error) {
      console.error("Error creating invitation:", error);
      return { error: `Failed to create invitation: ${error.message}` };
    }
    
    if (!data || data.length === 0) {
      return { error: "Failed to create invitation record" };
    }
    
    return { 
      data: {
        id: data[0].id,
        email: data[0].email,
        status: data[0].status,
        invitedBy: data[0].invited_by,
        invitedAt: data[0].invited_at,
        message: data[0].message || undefined,
      }
    };
  } catch (error) {
    console.error("Error in createInvite:", error);
    return { error: `Failed to create invitation: ${error instanceof Error ? error.message : 'Unknown error'}` };
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
