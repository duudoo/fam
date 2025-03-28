
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailAPI } from "@/lib/api/email";

const EmailTestPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleTestEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSending(true);
    try {
      await emailAPI.sendTestEmail(email);
      toast.success(`Test email sent to ${email}. Please check your inbox.`);
    } catch (error: any) {
      console.error("Failed to send test email:", error);
      toast.error(error.message || "Failed to send test email");
    } finally {
      setIsSending(false);
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
              <h2 className="text-2xl font-bold text-famacle-slate mb-2">Email Configuration Test</h2>
              <p className="text-gray-600">
                Send a test email to verify your email configuration
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter recipient email"
                  className="w-full"
                  required
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  className="w-full" 
                  onClick={handleTestEmail}
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
              
              <div className="pt-4 text-center">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTestPage;
