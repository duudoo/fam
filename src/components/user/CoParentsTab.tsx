
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import CoParentInvite from "@/components/user/CoParentInvite";
import CoParentsList from "@/components/user/CoParentsList";
import { CoParentInvite as CoParentInviteType, Parent } from "@/utils/types";

interface CoParentsTabProps {
  currentUser: Parent;
  invites: CoParentInviteType[];
  setInvites: React.Dispatch<React.SetStateAction<CoParentInviteType[]>>;
  onInviteSent?: () => void;
}

const CoParentsTab = ({ currentUser, invites, setInvites, onInviteSent }: CoParentsTabProps) => {
  const [inviting, setInviting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSendInvite = async (email: string, message?: string) => {
    try {
      setSubmitting(true);
      
      // Validate inputs
      if (!email) {
        toast.error("Email is required");
        return;
      }
      
      if (!currentUser || !currentUser.id) {
        console.error("No current user found");
        toast.error("You must be logged in to send invitations");
        return;
      }

      console.log("Sending invitation to:", email, "from user:", currentUser.id);
      
      // Check if invitation already exists
      const checkResult = await supabase
        .from('co_parent_invites')
        .select()
        .eq('email', email)
        .eq('invited_by', currentUser.id);
      
      if (checkResult.error) {
        console.error("Error checking existing invites:", checkResult.error);
        toast.error(`Error checking invites: ${checkResult.error.message}`);
        return;
      }
      
      if (checkResult.data && checkResult.data.length > 0) {
        toast.error("You have already invited this email address");
        return;
      }

      // Create the invitation
      const inviteResult = await supabase
        .from('co_parent_invites')
        .insert({
          email: email,
          invited_by: currentUser.id,
          status: 'pending',
          message: message || null
        })
        .select();

      if (inviteResult.error) {
        console.error("Error creating invitation:", inviteResult.error);
        toast.error(`Failed to create invitation: ${inviteResult.error.message}`);
        return;
      }

      if (!inviteResult.data || inviteResult.data.length === 0) {
        console.error("No data returned from invitation insert");
        toast.error("Failed to create invitation record");
        return;
      }

      const invite = inviteResult.data[0];
      console.log("Invitation created:", invite);
      
      // Close the form and show success message
      setInviting(false);
      toast.success(`Invitation sent to ${email}`);
      
      // Update UI
      if (onInviteSent) {
        onInviteSent();
      } else {
        // Update local state
        setInvites(prevInvites => [...prevInvites, {
          id: invite.id,
          email: invite.email,
          status: invite.status as any,
          invitedBy: invite.invited_by,
          invitedAt: invite.invited_at,
          message: invite.message || undefined,
          respondedAt: undefined
        }]);
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-famacle-slate">Co-Parents</h2>
        <Button onClick={() => setInviting(true)}>
          <Plus className="mr-2 h-4 w-4" /> Invite Co-Parent
        </Button>
      </div>
      
      {inviting ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite Co-Parent</CardTitle>
            <CardDescription>
              Invite another parent to co-manage this family account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CoParentInvite 
              onSubmit={handleSendInvite} 
              onCancel={() => setInviting(false)} 
              isSubmitting={submitting}
            />
          </CardContent>
        </Card>
      ) : null}
      
      <CoParentsList currentUser={currentUser} invites={invites} />
    </div>
  );
};

export default CoParentsTab;
