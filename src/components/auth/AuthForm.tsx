
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
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
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsSubmitting(false);

      switch (authMode) {
        case "signin":
          toast.success("Signed in successfully!");
          navigate("/dashboard");
          break;
        case "forgot-password":
          toast.success("Password reset link sent to your email!");
          setAuthMode("signin");
          break;
        case "verify-email":
          toast.success("Email verified successfully!");
          navigate("/dashboard");
          break;
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    setAuthMode("forgot-password");
  };

  const handleBackToSignIn = () => {
    setAuthMode("signin");
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-soft bg-white">
      {authMode === "verify-email" ? (
        <VerifyEmailForm
          email={email}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          onBackToSignIn={handleBackToSignIn}
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
