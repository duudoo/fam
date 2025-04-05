
import { supabase } from "@/integrations/supabase/client";
import { CoParentInvite } from "@/utils/types";

/**
 * Fetch co-parent invites sent by a specific user
 */
export async function fetchSentInvites(userId: string): Promise<CoParentInvite[]> {
  try {
    const { data, error } = await supabase
      .from('co_parent_invites')
      .select('*')
      .eq('invited_by', userId);

    if (error) {
      console.error('Error fetching sent co-parent invites:', error);
      throw new Error('Failed to load sent co-parent invites');
    }

    // Transform the data to match the CoParentInvite type
    return data.map((invite) => ({
      id: invite.id,
      email: invite.email,
      status: invite.status,
      invitedBy: invite.invited_by,
      invitedAt: invite.invited_at,
      message: invite.message || undefined,
      respondedAt: invite.responded_at || undefined
    }));
  } catch (err) {
    console.error('Error in fetchSentInvites:', err);
    throw err;
  }
}

/**
 * Fetch co-parent invites received by a specific email
 */
export async function fetchReceivedInvites(email: string): Promise<CoParentInvite[]> {
  try {
    const { data, error } = await supabase
      .from('co_parent_invites')
      .select('*')
      .eq('email', email);

    if (error) {
      console.error('Error fetching received co-parent invites:', error);
      throw new Error('Failed to load received co-parent invites');
    }

    // Transform the data to match the CoParentInvite type
    return data.map((invite) => ({
      id: invite.id,
      email: invite.email,
      status: invite.status,
      invitedBy: invite.invited_by,
      invitedAt: invite.invited_at,
      message: invite.message || undefined,
      respondedAt: invite.responded_at || undefined
    }));
  } catch (err) {
    console.error('Error in fetchReceivedInvites:', err);
    throw err;
  }
}
