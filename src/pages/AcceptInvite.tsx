
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

type InviteStatus = "loading" | "invalid" | "valid" | "accepted" | "error";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("id");
  const [status, setStatus] = useState<InviteStatus>("loading");
  const [inviteData, setInviteData] = useState<any>(null);
  const [inviterName, setInviterName] = useState<string>("");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Fetch invite data
  useEffect(() => {
    const fetchInvite = async () => {
      if (!inviteId) {
        setStatus("invalid");
        return;
      }

      try {
        const { data: invite, error } = await supabase
          .from("co_parent_invites")
          .select("*, invited_by")
          .eq("id", inviteId)
          .single();

        if (error || !invite) {
          console.error("Error fetching invite:", error);
          setStatus("invalid");
          return;
        }

        // Check if invite is still pending
        if (invite.status !== "pending") {
          setStatus(invite.status === "accepted" ? "accepted" : "invalid");
          return;
        }

        setInviteData(invite);

        // Fetch inviter's name
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, first_name")
          .eq("id", invite.invited_by)
          .single();

        if (profile) {
          setInviterName(profile.full_name || profile.first_name || "A parent");
        }

        setStatus("valid");
      } catch (error) {
        console.error("Error in fetchInvite:", error);
        setStatus("error");
      }
    };

    fetchInvite();
  }, [inviteId]);

  const handleAccept = async () => {
    if (!user || !inviteData) return;
    
    try {
      // Update the invite status
      const { error: updateError } = await supabase
        .from("co_parent_invites")
        .update({ 
          status: "accepted",
          responded_at: new Date().toISOString()
        })
        .eq("id", inviteId);

      if (updateError) {
        console.error("Error updating invite:", updateError);
        toast.error("Failed to accept invitation");
        return;
      }

      toast.success("Invitation accepted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error accepting invite:", error);
      toast.error("An error occurred while accepting the invitation");
    }
  };

  const handleDecline = async () => {
    if (!inviteData) return;
    
    try {
      // Update the invite status
      const { error: updateError } = await supabase
        .from("co_parent_invites")
        .update({ 
          status: "declined",
          responded_at: new Date().toISOString()
        })
        .eq("id", inviteId);

      if (updateError) {
        console.error("Error declining invite:", updateError);
        toast.error("Failed to decline invitation");
        return;
      }

      toast.success("Invitation declined");
      navigate("/");
    } catch (error) {
      console.error("Error declining invite:", error);
      toast.error("An error occurred while declining the invitation");
    }
  };

  const renderContent = () => {
    if (loading || status === "loading") {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (status === "invalid") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>This invitation link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardFooter>
        </Card>
      );
    }

    if (status === "accepted") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Invitation Already Accepted</CardTitle>
            <CardDescription>This invitation has already been accepted.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      );
    }

    if (status === "error") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>An error occurred while processing this invitation.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </CardFooter>
        </Card>
      );
    }

    // Valid invite
    return (
      <Card>
        <CardHeader>
          <CardTitle>Co-Parent Invitation</CardTitle>
          <CardDescription>
            {inviterName} has invited you to be a co-parent on Famacle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inviteData?.message && (
            <div className="bg-muted p-4 rounded-md mb-4 italic">
              "{inviteData.message}"
            </div>
          )}
          <p>
            By accepting this invitation, you'll be able to manage shared expenses, 
            calendar events, and other co-parenting responsibilities.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept} disabled={!user}>
            {!user ? "Sign In to Accept" : "Accept Invitation"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6 pt-24 max-w-md">
        {!user && status === "valid" ? (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">
              Please sign in or create an account to accept this invitation.
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </div>
          </div>
        ) : null}
        {renderContent()}
      </main>
    </div>
  );
};

export default AcceptInvite;
