
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface for invitation email data
 */
export interface InviteEmailData {
  email: string;
  inviterName: string;
  inviteMessage?: string;
  inviteId: string;
}

/**
 * Send an email invitation to a co-parent
 * @param inviteData - The invitation data
 * @returns Promise with success status
 */
export const sendEmailInvite = async (inviteData: InviteEmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Sending co-parent invite email to:", inviteData.email);
    
    const inviteLink = `${window.location.origin}/accept-invite?id=${inviteData.inviteId}`;
    
    const { error } = await supabase.functions.invoke('send-coparent-invite', {
      body: {
        email: inviteData.email,
        inviterName: inviteData.inviterName,
        inviteMessage: inviteData.inviteMessage,
        inviteLink
      }
    });
    
    if (error) {
      console.error("Error calling send-coparent-invite function:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error sending email invite:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error sending invitation email"
    };
  }
};

/**
 * Process an invitation acceptance
 * @param inviteId - The ID of the invitation
 * @param userId - The ID of the accepting user
 * @returns Promise with success status
 */
export const processInviteAcceptance = async (
  inviteId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Processing invitation acceptance:", inviteId, userId);
    
    // Get invitation details
    const { data: inviteData, error: inviteError } = await supabase
      .from('co_parent_invites')
      .select('*')
      .eq('id', inviteId)
      .single();
    
    if (inviteError || !inviteData) {
      console.error("Failed to fetch invitation:", inviteError);
      return { success: false, error: "Invitation not found" };
    }
    
    // Check if invitation is pending
    if (inviteData.status !== 'pending') {
      return { success: false, error: `Invitation is already ${inviteData.status}` };
    }
    
    // Update invitation status
    const { error: updateError } = await supabase
      .from('co_parent_invites')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', inviteId);
    
    if (updateError) {
      console.error("Failed to update invitation:", updateError);
      return { success: false, error: "Failed to accept invitation" };
    }
    
    // Create notification for the inviter
    await supabase.from('notifications').insert({
      user_id: inviteData.invited_by,
      type: 'invite_accepted',
      message: `Your co-parent invitation to ${inviteData.email} has been accepted.`,
      related_id: inviteId
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error processing invite acceptance:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error processing acceptance"
    };
  }
};
