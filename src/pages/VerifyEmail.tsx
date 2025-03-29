
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import AuthLogo from "@/components/auth/AuthLogo";
import useEmailVerification from "@/hooks/useEmailVerification";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const {
    verificationCode,
    setVerificationCode,
    isSubmitting,
    isResending,
    handleVerify,
    handleResendCode
  } = useEmailVerification({
    email,
    password: location.state?.password
  });

  const handleBackToSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-famacle-blue-light/30 px-4 py-12">
      <div className="w-full max-w-md">
        <AuthLogo />
        
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <VerifyEmailForm
            email={email}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            isSubmitting={isSubmitting}
            handleSubmit={handleVerify}
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
