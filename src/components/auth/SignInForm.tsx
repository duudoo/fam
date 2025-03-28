
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Key, Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

const SignInForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isSubmitting,
  handleSubmit,
  onForgotPassword,
}: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5" /> : 
                <Eye className="h-5 w-5" />
              }
            </button>
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
  );
};

export default SignInForm;
