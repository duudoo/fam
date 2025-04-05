
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  email: string;
  inviterName: string;
  inviteMessage?: string;
  inviteLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, inviterName, inviteMessage, inviteLink }: InviteEmailRequest = await req.json();

    if (!email || !inviterName || !inviteLink) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email, inviter name, and invite link are required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>You've Been Invited to Famacle</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello,</p>
          <p>${inviterName} has invited you to join Famacle as a co-parent.</p>
          
          ${inviteMessage ? `<p><strong>Message from ${inviterName}:</strong></p>
          <p style="padding: 10px; background-color: #f9fafb; border-left: 4px solid #4F46E5; font-style: italic;">${inviteMessage}</p>` : ''}
          
          <p>Famacle helps parents coordinate expenses, schedules, and communications in one place.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${inviteLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
          </div>
          <p style="margin-top: 30px;">Best regards,<br>The Famacle Team</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Famacle <onboarding@resend.dev>",
      to: [email],
      subject: `${inviterName} invited you to Famacle`,
      html,
      text: `Hello, ${inviterName} has invited you to join Famacle as a co-parent. ${inviteMessage ? `Message: ${inviteMessage}` : ''} Please visit this link to accept the invitation: ${inviteLink}`,
    });

    if (emailResponse.error) {
      console.error("Email sending error:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: emailResponse.error 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: emailResponse 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Error in send-coparent-invite function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);
