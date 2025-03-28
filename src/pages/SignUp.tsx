
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import SignUpForm from "@/components/auth/SignUpForm";
import { supabase } from "@/integrations/supabase/client";
import { emailAPI } from "@/lib/api/email";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsSubmitting(true);

    try {
      // Split name into first and last name for metadata
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      console.log("Attempting to sign up user:", email);
      
      // Sign up with Supabase - explicitly requesting a signup OTP email
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      console.log("Signup response:", data);

      // Send welcome email
      try {
        const emailResult = await emailAPI.sendWelcomeEmail(email, name || firstName);
        if (emailResult?.error) {
          console.warn("Welcome email failed but continuing signup:", emailResult.error);
        } else {
          console.log("Welcome email sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
        // Don't fail the signup if the welcome email fails
      }

      // Check if confirmation was sent
      if (data.user && !data.user.confirmed_at) {
        console.log("Email verification required, redirecting to verify page");
        toast.success("Verification code sent to your email. Please check your inbox.");
        navigate("/verify-email", { state: { email } });
      } else {
        console.log("User already confirmed or auto-confirmed, redirecting to dashboard");
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-famacle-slate mb-2">Create your account</h2>
              <p className="text-gray-600">
                Join thousands of parents making co-parenting easier
              </p>
            </div>
            
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
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-famacle-blue font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
