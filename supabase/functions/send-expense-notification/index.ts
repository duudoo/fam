
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:3000";

const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequestBody {
  expenseId: string;
  recipientEmail: string;
  expenseAmount: number;
  recipientAmount: number;
  expenseDescription: string;
  category: string;
  date: string;
  payerName: string;
  receiptUrl?: string;
  approvalToken: string;
  approveUrl: string;
  clarifyUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailRequestBody = await req.json();
    
    const {
      expenseId,
      recipientEmail,
      expenseAmount,
      recipientAmount,
      expenseDescription,
      category,
      date,
      payerName,
      receiptUrl,
      approvalToken,
      approveUrl,
      clarifyUrl
    } = payload;

    if (!recipientEmail || !expenseDescription || !expenseAmount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    const receiptSection = receiptUrl 
      ? `<div style="margin-bottom: 20px;">
           <p style="margin-bottom: 10px; font-weight: bold;">Receipt:</p>
           <img src="${receiptUrl}" alt="Receipt" style="max-width: 300px; border: 1px solid #ddd; padding: 5px;" />
         </div>`
      : '';

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "Famacle <no-reply@famacle.com>",
      to: [recipientEmail],
      subject: `Expense Approval Required: ${expenseDescription}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4a5568; margin-bottom: 5px;">Expense Approval Request</h1>
            <p style="color: #718096; margin-top: 0;">${payerName} has added a new shared expense</p>
          </div>

          <div style="background-color: #f7fafc; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
            <h2 style="color: #4a5568; margin-top: 0;">${expenseDescription}</h2>
            <p style="color: #718096; margin: 5px 0;">Date: ${date}</p>
            <p style="color: #718096; margin: 5px 0;">Category: ${formattedCategory}</p>
            <p style="color: #718096; margin: 5px 0;">Total Amount: £${expenseAmount.toFixed(2)}</p>
            <p style="color: #4a5568; font-weight: bold; margin: 15px 0 5px;">Your share: £${recipientAmount.toFixed(2)}</p>
          </div>

          ${receiptSection}

          <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: center;">
            <a href="${approveUrl}" style="display: inline-block; background-color: #48bb78; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; text-align: center; min-width: 120px;">Approve</a>
            <a href="${clarifyUrl}" style="display: inline-block; background-color: #ed8936; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; text-align: center; min-width: 120px;">Request Clarification</a>
          </div>

          <div style="font-size: 12px; color: #a0aec0; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e4e4e4;">
            <p>This is an automated email from Famacle. Please do not reply to this email.</p>
            <p>If you would like to manage your expenses directly, please <a href="${frontendUrl}/sign-up" style="color: #4299e1;">create an account</a>.</p>
          </div>
        </div>
      `
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: emailError }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Email sent successfully",
        id: emailResult?.id 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Error in send-expense-notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
