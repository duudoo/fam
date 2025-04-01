
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

  // Get request data
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new Response(JSON.stringify({ 
      error: "invalid-request",
      message: "Invalid request format" 
    }), { 
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
  
  const { token, action } = body;
  
  // Validate input
  if (!token || !action || (action !== "approve" && action !== "clarify")) {
    return new Response(JSON.stringify({ 
      error: "invalid-parameters",
      message: "Invalid or missing parameters" 
    }), { 
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }

  try {
    console.log(`Processing expense action: ${action} with token: ${token}`);
    
    // Find the expense notification with this token
    const { data: notification, error: notifError } = await supabase
      .from("expense_notifications")
      .select("expense_id, sent_to")
      .eq("token", token)
      .single();

    if (notifError || !notification) {
      console.error("Error finding notification:", notifError);
      return new Response(JSON.stringify({ 
        error: "not-found",
        message: "Notification not found or already processed" 
      }), { 
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Find the expense
    const { data: expense, error: expenseError } = await supabase
      .from("expenses")
      .select("id, description, amount, status, split_method, paid_by, split_percentage, split_amounts")
      .eq("id", notification.expense_id)
      .single();

    if (expenseError || !expense) {
      console.error("Error finding expense:", expenseError);
      return new Response(JSON.stringify({ 
        error: "not-found",
        message: "Expense not found" 
      }), { 
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Check if expense is already processed
    if (expense.status !== "pending") {
      console.log(`Expense already processed. Current status: ${expense.status}`);
      return new Response(JSON.stringify({ 
        error: "already-processed",
        message: `This expense has already been ${expense.status}` 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Record the notification action
    const { error: updateNotifError } = await supabase
      .from("expense_notifications")
      .update({
        actioned_at: new Date().toISOString(),
        action: action
      })
      .eq("token", token);

    if (updateNotifError) {
      console.error("Error updating notification:", updateNotifError);
      return new Response(JSON.stringify({ 
        error: "notification-update-failed",
        message: "Failed to update notification" 
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Update the expense status based on the action
    const newStatus = action === "approve" ? "approved" : "disputed";
    const { error: updateExpenseError } = await supabase
      .from("expenses")
      .update({ status: newStatus })
      .eq("id", expense.id);

    if (updateExpenseError) {
      console.error("Error updating expense:", updateExpenseError);
      return new Response(JSON.stringify({ 
        error: "update-failed",
        message: "Failed to update expense status" 
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // If approved, we need to update the parent's dashboard to show awaiting payment
    if (action === "approve") {
      // Find the co-parent (recipient of the notification)
      const coParentEmail = notification.sent_to;
      
      const { data: coParent, error: coParentError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", coParentEmail)
        .single();
        
      if (coParentError || !coParent) {
        console.error("Error finding co-parent:", coParentError);
      } else {
        // Create a payment record for the co-parent
        let amountToPay = 0;
        
        // Calculate the amount to pay based on the split method
        if (expense.split_method === "50/50") {
          // For 50/50 split, co-parent pays half
          amountToPay = expense.amount / 2;
        } 
        else if (expense.split_method === "custom" && expense.split_percentage) {
          // For custom percentage split, calculate based on the remaining percentage
          // (100% minus the payer's percentage)
          const payerPercentage = expense.split_percentage[expense.paid_by] || 0;
          const coParentPercentage = 100 - payerPercentage;
          amountToPay = (expense.amount * coParentPercentage) / 100;
        }
        else if (expense.split_method === "custom" && expense.split_amounts) {
          // For custom amount split, use the explicitly set amount
          amountToPay = expense.split_amounts[coParent.id] || 0;
        }
        else if (expense.split_method === "none") {
          // For no split, co-parent pays nothing
          amountToPay = 0;
        }
        
        if (amountToPay > 0) {
          const { error: paymentError } = await supabase
            .from("expense_payments")
            .insert({
              expense_id: expense.id,
              payer_id: coParent.id,
              amount: amountToPay,
              status: "pending",
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Due in 7 days
            });
            
          if (paymentError) {
            console.error("Error creating payment record:", paymentError);
            // Continue despite error, this shouldn't block the overall approval
          } else {
            console.log(`Created payment record for co-parent ${coParent.id}, amount: ${amountToPay}`);
          }
        }
        
        // Create a notification for the expense creator
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: expense.paid_by,
            type: "expense_approved", 
            message: `Your expense "${expense.description}" was approved`,
            related_id: expense.id
          });
          
        if (notificationError) {
          console.error("Error creating notification:", notificationError);
        }
      }
    } else if (action === "clarify") {
      // Create a notification for the expense creator
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: expense.paid_by,
          type: "expense_clarification", 
          message: `Clarification requested for "${expense.description}"`,
          related_id: expense.id
        });
        
      if (notificationError) {
        console.error("Error creating notification:", notificationError);
      }
    }

    console.log(`Successfully processed expense action: ${action} for expense ${expense.id}`);
    
    return new Response(JSON.stringify({ 
      expenseId: expense.id,
      action: action,
      status: newStatus
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    console.error("Error handling expense action:", error);
    return new Response(JSON.stringify({ 
      error: "server-error",
      message: "An unexpected error occurred" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);
