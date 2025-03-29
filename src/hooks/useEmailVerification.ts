
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { emailAPI } from "@/lib/api/email";

interface UseEmailVerificationProps {
  email: string;
  password?: string;
}

export const useEmailVerification = ({ email, password }: UseEmailVerificationProps) => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email) {
      toast.error("Email is required for verification");
      return;
    }

    if (!verificationCode) {
      toast.error("Verification code is required");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Verifying email with code:", verificationCode, "for email:", email);
      
      // Verify the code with Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: {
          email,
          code: verificationCode
        }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to verify email");
      }
      
      if (!data.success) {
        console.error("Verification failed:", data.message);
        throw new Error(data.message || "Invalid verification code");
      }
      
      // Send welcome email
      try {
        const name = data.userName || '';
        const emailResult = await emailAPI.sendWelcomeEmail(email, name);
        console.log("Welcome email sent result:", emailResult);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail if welcome email fails
      }

      toast.success("Email verified successfully!");
      
      // Sign the user in
      if (password) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.log("Auto sign-in failed, user should sign in manually", signInError);
          navigate("/signin", { state: { email, verified: true } });
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/signin", { state: { email, verified: true } });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "Failed to verify email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email is required to resend code");
      return;
    }

    setIsResending(true);

    try {
      console.log("Resending verification code to:", email);
      
      // Use our edge function to generate and send a new code
      const { data, error } = await supabase.functions.invoke('resend-verification-code', {
        body: { email }
      });
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to resend verification code");
      }
      
      if (!data.success) {
        console.error("Resend failed:", data.message);
        throw new Error(data.message || "Failed to resend verification code");
      }

      toast.success("Verification code resent to your email");
    } catch (error: any) {
      console.error("Resend code error:", error);
      
      // Fallback to using Supabase's built-in resend functionality
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        
        if (error) throw error;
        
        toast.success("Verification email resent to your email");
      } catch (fallbackError: any) {
        console.error("Fallback resend code error:", fallbackError);
        toast.error(fallbackError.message || "Failed to resend code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return {
    verificationCode,
    setVerificationCode,
    isSubmitting,
    isResending,
    handleVerify,
    handleResendCode,
  };
};

export default useEmailVerification;
