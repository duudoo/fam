
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Get URL parameters
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const action = url.searchParams.get("action");
  
  // Redirect URL (frontend page to show after action)
  const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:3000";
  
  if (!token || !action || (action !== "approve" && action !== "dispute")) {
    return Response.redirect(`${frontendUrl}/expense-error?reason=invalid-parameters`, 302);
  }

  try {
    // Find the expense with this token
    const { data: expense, error: expenseError } = await supabase
      .from("expenses")
      .select("id, description, amount, status")
      .eq("approval_token", token)
      .single();

    if (expenseError || !expense) {
      console.error("Error finding expense:", expenseError);
      return Response.redirect(`${frontendUrl}/expense-error?reason=not-found`, 302);
    }

    // Record the notification action
    const { error: notificationError } = await supabase
      .from("expense_notifications")
      .update({
        actioned_at: new Date().toISOString(),
        action: action
      })
      .eq("token", token);

    if (notificationError) {
      console.error("Error updating notification:", notificationError);
      return Response.redirect(`${frontendUrl}/expense-error?reason=notification-update-failed`, 302);
    }

    // Update the expense status based on the action
    const newStatus = action === "approve" ? "approved" : "disputed";
    const { error: updateError } = await supabase
      .from("expenses")
      .update({ status: newStatus })
      .eq("id", expense.id);

    if (updateError) {
      console.error("Error updating expense:", updateError);
      return Response.redirect(`${frontendUrl}/expense-error?reason=update-failed`, 302);
    }

    // Redirect to success page
    return Response.redirect(
      `${frontendUrl}/expense-success?action=${action}&id=${expense.id}`, 
      302
    );
  } catch (error) {
    console.error("Error handling expense action:", error);
    return Response.redirect(`${frontendUrl}/expense-error?reason=server-error`, 302);
  }
};

serve(handler);
