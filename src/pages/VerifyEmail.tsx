
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the email from location state or use a placeholder
  const email = location.state?.email || "your email";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate verification process
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Email verified successfully!");
      navigate("/dashboard");
    }, 1500);
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
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
