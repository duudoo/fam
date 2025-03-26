
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import SignInForm from "@/components/auth/SignInForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { supabase } from "@/integrations/supabase/client";

const SignInPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "forgot-password">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        // Sign in with Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Signed in successfully!");
        navigate("/dashboard");
      } else if (mode === "forgot-password") {
        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        toast.success("Password reset link sent to your email!");
        setMode("signin");
      }
    } catch (error: any) {
      console.error(mode === "signin" ? "Login error:" : "Reset password error:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setMode("forgot-password");
  };

  const handleBackToSignIn = () => {
    setMode("signin");
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
          <div className="p-6">
            {mode === "forgot-password" ? (
              <ForgotPasswordForm
                email={email}
                setEmail={setEmail}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                onBackToSignIn={handleBackToSignIn}
              />
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-famacle-slate mb-2">Welcome back</h2>
                  <p className="text-gray-600">
                    Sign in to continue to your account
                  </p>
                </div>
                
                <SignInForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  onForgotPassword={handleForgotPassword}
                />
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-famacle-blue font-medium hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
