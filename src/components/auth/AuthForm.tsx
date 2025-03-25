
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Key, User, ArrowRight } from "lucide-react";

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

  return (
    <div className="w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-soft bg-white">
      {authMode === "verify-email" ? (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-famacle-slate mb-6">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We sent a verification code to {email}. Please enter it below.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <div className="relative">
                  <Input
                    id="verification-code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-10"
                    placeholder="Enter verification code"
                    required
                  />
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
              
              <p className="text-sm text-center text-gray-500">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  className="text-famacle-blue hover:underline font-medium"
                >
                  Resend Code
                </button>
              </p>
              
              <p className="text-sm text-center text-gray-500">
                <button
                  type="button"
                  className="text-famacle-blue hover:underline font-medium"
                  onClick={() => setAuthMode("signin")}
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <button
                      type="button"
                      className="text-sm text-famacle-blue hover:underline"
                      onClick={() => setAuthMode("forgot-password")}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your password"
                      required
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Create a password"
                      required
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-famacle-blue hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-famacle-blue hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !agreedToTerms}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="forgot-password" className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-famacle-slate mb-2">Reset Your Password</h2>
              <p className="text-gray-600">
                Enter your email and we'll send you instructions to reset your password.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
                
                <p className="text-sm text-center text-gray-500">
                  <button
                    type="button"
                    className="text-famacle-blue hover:underline font-medium"
                    onClick={() => setAuthMode("signin")}
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AuthForm;
