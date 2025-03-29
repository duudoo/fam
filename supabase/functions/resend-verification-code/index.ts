
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email is required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user with the provided email
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      email: email
    });

    if (getUserError) {
      console.error("Error fetching user:", getUserError);
      throw new Error("Failed to resend verification code");
    }

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const user = users[0];
    
    // Generate a new 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update the user's metadata with the new verification code
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: {
          ...user.user_metadata,
          verification_code: verificationCode
        }
      }
    );

    if (updateError) {
      console.error("Error updating user:", updateError);
      throw new Error("Failed to generate new verification code");
    }
    
    // Set up the email API client
    const emailUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`;
    const name = user.user_metadata?.full_name || user.user_metadata?.first_name || '';
    
    // Send the verification email
    const emailResponse = await fetch(emailUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
      },
      body: JSON.stringify({
        to: email,
        subject: "Verify Your Famacle Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
              <h1>Verify Your Email</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <p>Hello ${name},</p>
              <p>Thank you for signing up for Famacle! Please use the verification code below to confirm your email address:</p>
              <div style="margin: 30px 0; text-align: center;">
                <div style="font-size: 32px; letter-spacing: 5px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block;">${verificationCode}</div>
              </div>
              <p>If you didn't sign up for Famacle, you can safely ignore this email.</p>
              <p style="margin-top: 30px;">Best regards,<br>The Famacle Team</p>
            </div>
          </div>
        `,
        text: `Hello ${name}, Thank you for signing up for Famacle! Please use this verification code to confirm your email: ${verificationCode}`
      })
    });

    if (!emailResponse.ok) {
      console.error("Failed to send email:", await emailResponse.text());
      throw new Error("Failed to send verification email");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification code generated and sent successfully"
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Failed to resend verification code" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
