
import { supabase } from "@/integrations/supabase/client";

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  replyTo?: string;
  isTest?: boolean;
}

export const emailAPI = {
  /**
   * Send an email using the Supabase Edge Function
   */
  sendEmail: async (payload: EmailPayload) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: payload,
      });

      if (error) {
        console.error("Error invoking edge function:", error);
        return { error };
      }

      if (data?.error) {
        console.error("Failed to send email:", data.error);
        return { error: data.error };
      }

      return data;
    } catch (error) {
      console.error("Failed to send email:", error);
      return { error };
    }
  },

  /**
   * Send a test email to verify email configuration
   */
  sendTestEmail: async (to: string) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>Famacle Email Test</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello,</p>
          <p>This is a test email from Famacle to verify that the email service is working correctly.</p>
          <p>If you're receiving this email, it means your email configuration is working properly!</p>
          <p>Time sent: ${new Date().toLocaleString()}</p>
          <p style="margin-top: 30px;">Best regards,<br>The Famacle Team</p>
        </div>
      </div>
    `;

    return emailAPI.sendEmail({
      to,
      subject: "Famacle Email Configuration Test",
      html,
      text: "This is a test email from Famacle to verify that the email service is working correctly.",
      isTest: true,
    });
  },

  /**
   * Send a verification email with a code
   */
  sendVerificationEmail: async (to: string, name: string, verificationCode: string) => {
    const html = `
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
    `;

    try {
      const result = await emailAPI.sendEmail({
        to,
        subject: "Verify Your Famacle Account",
        html,
        text: `Hello ${name}, Thank you for signing up for Famacle! Please use this verification code to confirm your email: ${verificationCode}`,
      });
      return result;
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't fail the signup if the verification email fails
      return { error };
    }
  },

  /**
   * Send a welcome email to a new user
   */
  sendWelcomeEmail: async (to: string, name: string) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to Famacle!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello ${name},</p>
          <p>Thank you for joining Famacle! We're excited to help you manage your family's finances and schedules.</p>
          <p>Here's what you can do with Famacle:</p>
          <ul>
            <li>Track and share expenses</li>
            <li>Manage your family calendar</li>
            <li>Coordinate with co-parents</li>
            <li>Keep all important information in one place</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${window.location.origin}/dashboard" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
          </div>
          <p style="margin-top: 30px;">Best regards,<br>The Famacle Team</p>
        </div>
      </div>
    `;

    try {
      const result = await emailAPI.sendEmail({
        to,
        subject: "Welcome to Famacle!",
        html,
        text: `Hello ${name}, Thank you for joining Famacle! We're excited to help you manage your family's finances and schedules.`,
      });
      return result;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't fail the signup if the welcome email fails
      return { error };
    }
  },

  /**
   * Send a password reset email
   */
  sendPasswordResetEmail: async (to: string, resetLink: string) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4F46E5; color: white; padding: 20px; text-align: center;">
          <h1>Reset Your Password</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Famacle account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Famacle Team</p>
        </div>
      </div>
    `;

    return emailAPI.sendEmail({
      to,
      subject: "Reset Your Famacle Password",
      html,
      text: `Hello, We received a request to reset your password for your Famacle account. Please visit this link to reset your password: ${resetLink}`,
    });
  },

  /**
   * Send a co-parent invitation email
   */
  sendCoParentInviteEmail: async (to: string, inviterName: string, inviteMessage: string = "", inviteLink: string) => {
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

    return emailAPI.sendEmail({
      to,
      subject: `${inviterName} invited you to Famacle`,
      html,
      text: `Hello, ${inviterName} has invited you to join Famacle as a co-parent. ${inviteMessage ? `Message: ${inviteMessage}` : ''} Please visit this link to accept the invitation: ${inviteLink}`,
    });
  }
};
