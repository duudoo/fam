
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);

  const inviteId = searchParams.get("id");

  // Fetch invitation data
  useEffect(() => {
    const fetchInviteData = async () => {
      if (!inviteId) {
        setError("Invalid invitation link. No invitation ID provided.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("co_parent_invites")
          .select("*")
          .eq("id", inviteId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setError("Invitation not found.");
          setLoading(false);
          return;
        }

        // Check if invitation has expired (for example, after 7 days)
        const invitedDate = new Date(data.invited_at);
        const expiryDate = new Date(invitedDate);
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
        
        if (new Date() > expiryDate) {
          setError("This invitation has expired.");
          setLoading(false);
          return;
        }

        // Check if invitation was already accepted or declined
        if (data.status === "accepted") {
          setError("This invitation has already been accepted.");
          setLoading(false);
          return;
        }

        if (data.status === "declined") {
          setError("This invitation has already been declined.");
          setLoading(false);
          return;
        }

        setInviteData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError("Failed to fetch invitation data. Please try again later.");
        setLoading(false);
      }
    };

    fetchInviteData();
  }, [inviteId]);

  // Handle accepting invitation
  const handleAcceptInvite = async () => {
    if (!inviteData || !user) return;

    setLoading(true);
    try {
      // Update invitation status
      const { error } = await supabase
        .from("co_parent_invites")
        .update({
          status: "accepted",
          responded_at: new Date().toISOString()
        })
        .eq("id", inviteData.id);

      if (error) {
        throw error;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Failed to accept invitation. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Co-Parent Invitation</CardTitle>
              <CardDescription>
                Accept invitation to join as a co-parent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : success ? (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    You've successfully accepted the invitation.
                    Redirecting you to the dashboard...
                  </AlertDescription>
                </Alert>
              ) : inviteData ? (
                <div className="space-y-4">
                  <p>
                    You've been invited to join as a co-parent by{" "}
                    <strong>{inviteData.invited_by}</strong>.
                  </p>
                  
                  {inviteData.message && (
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p className="text-sm italic">{inviteData.message}</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    {!user ? (
                      <div className="space-y-4">
                        <Alert className="bg-blue-50 border-blue-200">
                          <AlertDescription>
                            You need to sign in or create an account to accept this invitation.
                          </AlertDescription>
                        </Alert>
                        <div className="flex gap-2">
                          <Button onClick={() => navigate(`/signin?redirect=${encodeURIComponent(`/accept-invite?id=${inviteId}`)}`)}>
                            Sign In
                          </Button>
                          <Button variant="outline" onClick={() => navigate(`/signup?redirect=${encodeURIComponent(`/accept-invite?id=${inviteId}`)}`)}>
                            Create Account
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p>
                          You are logged in as <strong>{user.email}</strong>.
                          Click the button below to accept the invitation.
                        </p>
                        <div className="flex gap-2">
                          <Button onClick={handleAcceptInvite} disabled={loading}>
                            {loading ? <Spinner size="sm" className="mr-2" /> : null}
                            Accept Invitation
                          </Button>
                          <Button variant="outline" onClick={() => navigate("/dashboard")}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
