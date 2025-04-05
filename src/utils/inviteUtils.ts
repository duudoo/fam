
import { supabase } from "@/integrations/supabase/client";

interface SendEmailInviteParams {
  email: string;
  inviterName: string;
  inviteMessage?: string;
  inviteId: string;
}

export const sendEmailInvite = async ({
  email,
  inviterName,
  inviteMessage,
  inviteId
}: SendEmailInviteParams): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Sending email invite to:", email);
    
    const appUrl = window.location.origin;
    const inviteLink = `${appUrl}/accept-invite?id=${inviteId}`;
    
    const { data, error } = await supabase.functions.invoke('send-coparent-invite', {
      body: { 
        email,
        inviterName,
        inviteMessage,
        inviteLink
      }
    });
    
    if (error) {
      console.error("Error invoking send-coparent-invite function:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error sending email invite:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error sending invitation" 
    };
  }
};
