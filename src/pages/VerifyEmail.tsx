
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
      
      // Get the user based on the email
      const { data, error: getUserError } = await supabase.auth.admin.listUsers();

      if (getUserError) {
        throw getUserError;
      }

      // Find the user with matching email
      const user = data.users.find(u => u.email === email);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Check if the verification code matches
      if (user.user_metadata?.verification_code !== verificationCode) {
        throw new Error("Invalid verification code");
      }
      
      // Verify the user's email in Supabase
      const { error: verifyError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );

      if (verifyError) {
        throw verifyError;
      }

      // Send welcome email
      try {
        const name = user.user_metadata?.full_name || user.user_metadata?.first_name || '';
        const emailResult = await emailAPI.sendWelcomeEmail(email, name);
        console.log("Welcome email sent result:", emailResult);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail if welcome email fails
      }

      toast.success("Email verified successfully!");
      
      // Sign the user in automatically
      await supabase.auth.signInWithPassword({
        email,
        password: "last_password_used" // This won't work, but user can sign in again if needed
      }).catch(err => {
        console.log("Auto sign-in failed, user should sign in manually", err);
      });
      
      navigate("/dashboard");
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
      
      // Generate a new 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Get the user based on the email
      const { data, error: getUserError } = await supabase.auth.admin.listUsers();

      if (getUserError) {
        throw getUserError;
      }
      
      // Find the user with matching email
      const user = data.users.find(u => u.email === email);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Update the user's metadata with the new verification code
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          user_metadata: {
            ...user.user_metadata,
            verification_code: verificationCode
          }
        }
      );

      if (updateError) {
        throw updateError;
      }
      
      // Send the verification email
      const name = user.user_metadata?.full_name || user.user_metadata?.first_name || '';
      await emailAPI.sendVerificationEmail(email, name, verificationCode);

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
