
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
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
        We sent a verification code to <span className="font-medium">{email}</span>. Please enter it below.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <div className="flex flex-col items-center space-y-2">
              <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || verificationCode.length < 6}
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
