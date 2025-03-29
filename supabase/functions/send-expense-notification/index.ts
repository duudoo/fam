
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export interface ExpenseNotificationPayload {
  expenseId: string;
  recipientEmail: string;
  expenseAmount: number;
  expenseDescription: string;
  category: string;
  date: string;
  payerName: string;
  receiptUrl?: string;
  approvalToken: string;
  approveUrl: string;
  disputeUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ExpenseNotificationPayload = await req.json();
    
    // Create HTML for the email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>Expense Approval Request</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello,</p>
          <p>${payload.payerName} has added a new expense that requires your review.</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <h2 style="margin-top: 0; color: #374151;">${payload.expenseDescription}</h2>
            <p style="margin: 8px 0;"><strong>Amount:</strong> $${payload.expenseAmount.toFixed(2)}</p>
            <p style="margin: 8px 0;"><strong>Category:</strong> ${payload.category}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${payload.date}</p>
            ${payload.receiptUrl ? `<p style="margin: 8px 0;"><a href="${payload.receiptUrl}" target="_blank" style="color: #4F46E5;">View Receipt</a></p>` : ''}
          </div>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${payload.approveUrl}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 10px; display: inline-block;">Approve Expense</a>
            <a href="${payload.disputeUrl}" style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Dispute Expense</a>
          </div>
          
          <p style="margin-top: 30px;">You don't need to sign in to approve or dispute this expense. Simply click on the appropriate button above.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Famacle Team</p>
        </div>
      </div>
    `;

    console.log(`[EMAIL REQUEST] Sending expense notification to: ${payload.recipientEmail}`);
    
    const emailResponse = await resend.emails.send({
      from: "Famacle <onboarding@resend.dev>",
      to: payload.recipientEmail,
      subject: `Expense Approval Request: $${payload.expenseAmount.toFixed(2)} for ${payload.expenseDescription}`,
      html: html,
    });

    if (emailResponse.error) {
      console.error("[EMAIL ERROR] Failed to send expense notification:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: emailResponse.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("[EMAIL SUCCESS] Expense notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("[EMAIL ERROR] Error in send-expense-notification function:", error);
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
