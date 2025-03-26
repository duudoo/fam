
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import SignInForm from "./SignInForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerifyEmailForm from "./VerifyEmailForm";

type AuthMode = "signin" | "forgot-password" | "verify-email";

interface AuthFormProps {
  mode?: "signin" | "signup";
}

const AuthForm = ({ mode = "signin" }: AuthFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      switch (authMode) {
        case "signin":
          // Sign in with Supabase
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;

          toast.success("Signed in successfully!");
          navigate("/dashboard");
          break;
          
        case "forgot-password":
          // Send password reset email
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (resetError) throw resetError;

          toast.success("Password reset link sent to your email!");
          setAuthMode("signin");
          break;
          
        case "verify-email":
          if (!verificationCode) {
            toast.error("Verification code is required");
            setIsSubmitting(false);
            return;
          }

          console.log("Verifying email with code:", verificationCode, "for email:", email);

          // Use Supabase to verify the OTP
          const { error: verifyError, data } = await supabase.auth.verifyOtp({
            email,
            token: verificationCode,
            type: 'signup'
          });

          console.log("Verification response:", data);

          if (verifyError) throw verifyError;

          toast.success("Email verified successfully!");
          navigate("/dashboard");
          break;
      }
    } catch (error: any) {
      console.error(`Error in ${authMode} mode:`, error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setAuthMode("forgot-password");
  };

  const handleBackToSignIn = () => {
    setAuthMode("signin");
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email is required to resend code");
      return;
    }

    setIsResending(true);

    try {
      console.log("Resending verification code to:", email);
      
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

  return (
    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-soft bg-white">
      {authMode === "verify-email" ? (
        <VerifyEmailForm
          email={email}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          isSubmitting={isSubmitting}
          isResending={isResending}
          handleSubmit={handleSubmit}
          onBackToSignIn={handleBackToSignIn}
          onResendCode={handleResendCode}
        />
      ) : authMode === "forgot-password" ? (
        <ForgotPasswordForm 
          email={email}
          setEmail={setEmail}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          onBackToSignIn={handleBackToSignIn}
        />
      ) : (
        <div className="p-6">
          <SignInForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      )}
    </div>
  );
};

export default AuthForm;
