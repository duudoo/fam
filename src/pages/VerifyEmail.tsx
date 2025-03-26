
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { supabase } from "@/integrations/supabase/client";

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
      
      // Use Supabase to verify the OTP
      const { error, data } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'signup'
      });

      console.log("Verification response:", data);

      if (error) {
        throw error;
      }

      toast.success("Email verified successfully!");
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
      
      // Explicitly request a new signup OTP
      const { error, data } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      console.log("Resend code response:", data);

      if (error) {
        throw error;
      }

      toast.success("Verification code resent to your email");
    } catch (error: any) {
      console.error("Resend code error:", error);
      toast.error(error.message || "Failed to resend code. Please try again.");
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
