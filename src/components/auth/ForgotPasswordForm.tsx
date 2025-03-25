
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onBackToSignIn: () => void;
}

const ForgotPasswordForm = ({
  email,
  setEmail,
  isSubmitting,
  handleSubmit,
  onBackToSignIn,
}: ForgotPasswordFormProps) => {
  return (
    <>
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
              onClick={onBackToSignIn}
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
