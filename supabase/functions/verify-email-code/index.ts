
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
    const { email, code } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email and verification code are required" 
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

    console.log(`Looking up user with email: ${email}`);

    // Get the user with the provided email
    const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filters: {
        email: email
      }
    });

    if (getUserError) {
      console.error("Error fetching user:", getUserError);
      throw new Error("Failed to verify email");
    }

    if (!users || users.length === 0) {
      console.error("User not found with email:", email);
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const user = users[0];
    console.log(`Found user: ${user.id}, checking verification code...`);
    console.log(`User metadata:`, user.user_metadata);
    
    // Check if the verification code matches
    const userVerificationCode = user.user_metadata?.verification_code;
    
    if (!userVerificationCode) {
      console.error("No verification code found in user metadata");
      return new Response(
        JSON.stringify({ success: false, message: "No verification code found for this user" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Expected code: ${userVerificationCode}, received code: ${code}`);
    
    if (userVerificationCode !== code) {
      console.error("Invalid verification code");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid verification code" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Verify the user's email in Supabase
    const { error: verifyError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (verifyError) {
      console.error("Error verifying email:", verifyError);
      throw new Error("Failed to verify email");
    }

    console.log("Email verified successfully for user:", user.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email verified successfully",
        userName: user.user_metadata?.full_name || user.user_metadata?.first_name || ''
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Failed to verify email" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
