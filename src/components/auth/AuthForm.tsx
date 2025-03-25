
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VerifyEmailForm from "./VerifyEmailForm";

type AuthMode = "signin" | "signup" | "forgot-password" | "verify-email";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Check for tab query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'signup') {
      setAuthMode('signup');
    }
  }, [location.search]);

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
        case "signup":
          toast.success("Account created! Please verify your email.");
          setAuthMode("verify-email");
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
      ) : (
        <Tabs 
          defaultValue="signin" 
          className="w-full"
          value={authMode}
          onValueChange={(value) => setAuthMode(value as AuthMode)}
        >
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="signin" className="py-4">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="py-4">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="p-6">
            <SignInForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              onForgotPassword={handleForgotPassword}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="p-6">
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              name={name}
              setName={setName}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
            />
          </TabsContent>
          
          <TabsContent value="forgot-password" className="p-6">
            <ForgotPasswordForm 
              email={email}
              setEmail={setEmail}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit}
              onBackToSignIn={handleBackToSignIn}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AuthForm;
