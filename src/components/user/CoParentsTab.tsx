
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

      // Validate the email is not the current user's email
      if (currentUser.email === email) {
        toast.error("You cannot invite yourself");
        return;
      }

      // Check if invitation already exists
      const { data: existingInvites, error: checkError } = await supabase
        .from('co_parent_invites')
        .select('id')
        .eq('email', email)
        .eq('invited_by', currentUser.id);
      
      if (checkError) {
        console.error("Error checking existing invites:", checkError);
        toast.error("Failed to check existing invitations");
        return;
      }
      
      if (existingInvites && existingInvites.length > 0) {
        toast.error("You have already invited this email address");
        return;
      }

      // Create the invitation
      const { data: newInvite, error: inviteError } = await supabase
        .from('co_parent_invites')
        .insert({
          email: email,
          invited_by: currentUser.id,
          status: 'pending',
          message: message || null
        })
        .select();

      if (inviteError) {
        console.error("Error creating invitation:", inviteError);
        toast.error("Failed to create invitation");
        return;
      }

      if (!newInvite || newInvite.length === 0) {
        console.error("No data returned from invitation insert");
        toast.error("Failed to create invitation record");
        return;
      }

      const invite = newInvite[0];
      
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
        <Button 
          onClick={() => setInviting(true)}
          disabled={inviting}
        >
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
