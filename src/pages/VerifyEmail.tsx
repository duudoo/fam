
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { supabase } from "@/integrations/supabase/client";
import { emailAPI } from "@/lib/api/email";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    // Get the email from location state
    if (location.state?.email) {
      setEmail(location.state.email);
      console.log("Email from state:", location.state.email);
    } else {
      // If no email is provided, redirect to sign in
      toast.error("No email provided for verification");
      navigate("/signin");
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Verify the code directly with Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('verify-email-code', {
        body: {
          email,
          code: verificationCode
        }
      });
      
      if (error) {
        throw new Error(error.message || "Failed to verify email");
      }
      
      if (!data.success) {
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: location.state?.password || ""
      });

      if (signInError) {
        console.log("Auto sign-in failed, user should sign in manually", signInError);
        navigate("/signin", { state: { email, verified: true } });
      } else {
        navigate("/dashboard");
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
        throw new Error(error.message || "Failed to resend verification code");
      }
      
      if (!data.success) {
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

  const handleBackToSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-famacle-blue-light/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="bg-famacle-blue rounded-xl w-10 h-10 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h2 className="text-2xl font-bold text-famacle-slate">Famacle</h2>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <VerifyEmailForm
            email={email}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            onBackToSignIn={handleBackToSignIn}
            onResendCode={handleResendCode}
            isResending={isResending}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
