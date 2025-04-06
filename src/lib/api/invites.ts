import { supabase } from "@/integrations/supabase/client";
import { CoParentInvite } from "@/utils/types";

interface InviteResponse {
  data?: any;
  error?: string;
}

export const fetchSentInvites = async (userId: string): Promise<CoParentInvite[]> => {
  try {
    const { data, error } = await supabase
      .from("co_parent_invites")
      .select(`
        id,
        email,
        status,
        invited_by,
        created_at,
        responded_at,
        updated_at,
        message
      `)
      .eq("invited_by", userId);

    if (error) {
      console.error("Error fetching sent invites:", error);
      return []; // Return empty array instead of throwing
    }

    return (data || []).map((invite) => ({
      id: invite.id,
      email: invite.email,
      status: invite.status,
      invitedBy: invite.invited_by,
      invitedAt: invite.created_at,
      createdAt: invite.created_at,
      respondedAt: invite.responded_at,
      updatedAt: invite.updated_at,
      message: invite.message,
    }));
  } catch (error) {
    console.error("Unexpected error fetching sent invites:", error);
    return []; // Return empty array for any error
  }
};

export const fetchReceivedInvites = async (email: string): Promise<CoParentInvite[]> => {
  try {
    console.log("Fetching received invites for email:", email);
    const { data, error } = await supabase
      .from("co_parent_invites")
      .select(`
        id,
        email,
        status,
        invited_by,
        profiles(
          id,
          full_name,
          email,
          avatar_url
        ),
        created_at,
        responded_at,
        updated_at,
        message
      `)
      .eq("email", email);

    if (error) {
      console.error("Error fetching received invites:", error);
      return []; // Return empty array instead of throwing
    }

    return (data || []).map((invite) => {
      const inviter = invite.profiles || {};
      return {
        id: invite.id,
        email: invite.email,
        status: invite.status,
        invitedBy: invite.invited_by,
        invitedAt: invite.created_at,
        createdAt: invite.created_at,
        respondedAt: invite.responded_at,
        updatedAt: invite.updated_at,
        message: invite.message,
        inviter: {
          id: typeof inviter === 'object' && 'id' in inviter ? inviter.id : invite.invited_by,
          name: typeof inviter === 'object' && 'full_name' in inviter ? inviter.full_name : "Unknown user",
          email: typeof inviter === 'object' && 'email' in inviter ? inviter.email : "",
          avatar: typeof inviter === 'object' && 'avatar_url' in inviter ? inviter.avatar_url : null,
        },
      };
    });
  } catch (error) {
    console.error("Unexpected error fetching received invites:", error);
    return []; // Return empty array for any error
  }
};

export const createInvite = async (
  email: string,
  invitedBy: string, 
  message?: string
): Promise<InviteResponse> => {
  try {
    const { data: existingInvites } = await supabase
      .from("co_parent_invites")
      .select("id, status")
      .eq("email", email)
      .eq("invited_by", invitedBy);
    
    if (existingInvites && existingInvites.length > 0) {
      const existingInvite = existingInvites[0];
      
      if (existingInvite.status === "pending") {
        return {
          error: "You have already invited this user",
        };
      }
      
      const { data, error } = await supabase
        .from("co_parent_invites")
        .update({
          status: "pending",
          responded_at: null,
          message: message || null,
          created_at: new Date().toISOString(),
        })
        .eq("id", existingInvite.id)
        .select();
      
      if (error) {
        console.error("Error updating existing invitation:", error);
        return {
          error: "Failed to resend invitation",
        };
      }
      
      return {
        data: data?.[0] || null,
      };
    }
    
    const { data, error } = await supabase
      .from("co_parent_invites")
      .insert({
        email,
        invited_by: invitedBy,
        status: "pending",
        message: message || null,
      })
      .select();
    
    if (error) {
      console.error("Error creating invitation:", error);
      
      if (error.code === '23505') {
        return { error: "This user has already been invited" };
      }
      
      return {
        error: "Failed to create invitation",
      };
    }
    
    return {
      data: data?.[0] || null,
    };
  } catch (error: any) {
    console.error("Unexpected error creating invitation:", error);
    return {
      error: error.message || "Failed to create invitation",
    };
  }
};

export const acceptInvite = async (inviteId: string): Promise<InviteResponse> => {
  return respondToInvite(inviteId, "accepted");
};

export const declineInvite = async (inviteId: string): Promise<InviteResponse> => {
  return respondToInvite(inviteId, "declined");
};

export const respondToInvite = async (
  inviteId: string, 
  response: "accepted" | "declined"
): Promise<InviteResponse> => {
  try {
    const { data, error } = await supabase
      .from("co_parent_invites")
      .update({
        status: response,
        responded_at: new Date().toISOString(),
      })
      .eq("id", inviteId)
      .select();
    
    if (error) {
      console.error("Error responding to invitation:", error);
      return {
        error: "Failed to respond to invitation",
      };
    }
    
    return {
      data: data?.[0] || null,
    };
  } catch (error: any) {
    console.error("Unexpected error responding to invitation:", error);
    return {
      error: error.message || "Failed to respond to invitation",
    };
  }
};
