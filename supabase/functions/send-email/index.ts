
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  replyTo?: string;
  isTest?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    
    // Default from address if not provided
    const fromAddress = payload.from || "Famacle <noreply@famacle.app>";
    
    console.log(`[EMAIL REQUEST] Sending email to: ${typeof payload.to === 'string' ? payload.to : payload.to.join(', ')}`);
    console.log(`[EMAIL REQUEST] Subject: ${payload.subject}`);
    console.log(`[EMAIL REQUEST] Is test: ${payload.isTest ? 'yes' : 'no'}`);
    
    // If this is a test email and we're not in production, add a prefix to the subject
    let emailSubject = payload.subject;
    if (payload.isTest) {
      emailSubject = `[TEST] ${emailSubject}`;
    }
    
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: payload.to,
      subject: emailSubject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    });

    console.log("[EMAIL SUCCESS] Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("[EMAIL ERROR] Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
