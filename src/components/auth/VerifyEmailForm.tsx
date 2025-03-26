
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";

interface VerifyEmailFormProps {
  email: string;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isSubmitting: boolean;
  isResending?: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  onBackToSignIn: () => void;
  onResendCode: () => void;
}

const VerifyEmailForm = ({
  email,
  verificationCode,
  setVerificationCode,
  isSubmitting,
  isResending = false,
  handleSubmit,
  onBackToSignIn,
  onResendCode,
}: VerifyEmailFormProps) => {
  return (
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
              onClick={onResendCode}
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </p>
          
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
    </div>
  );
};

export default VerifyEmailForm;
