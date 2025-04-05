
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CoParentInvite from "@/components/user/CoParentInvite";
import CoParentsList from "@/components/user/CoParentsList";
import { CoParentInvite as CoParentInviteType, Parent } from "@/utils/types";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { emailAPI } from "@/lib/api/email";

interface CoParentsTabProps {
  currentUser: Parent;
  invites: CoParentInviteType[];
  receivedInvites?: CoParentInviteType[];
  setInvites: React.Dispatch<React.SetStateAction<CoParentInviteType[]>>;
  setReceivedInvites?: React.Dispatch<React.SetStateAction<CoParentInviteType[]>>;
  onInviteSent?: () => void;
}

const CoParentsTab = ({
  currentUser,
  invites,
  receivedInvites = [],
  setInvites,
  setReceivedInvites,
  onInviteSent
}: CoParentsTabProps) => {
  const [inviting, setInviting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { createInvite } = useFamilyCircle();

  const handleSendInvite = async (email: string, message?: string) => {
    try {
      setSubmitting(true);
      
      // Use the createInvite function from useFamilyCircle
      const result = await createInvite(email, message);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      const invite = result.data;
      
      // Send email invitation
      const inviteLink = `${window.location.origin}/accept-invite?id=${invite.id}`;
      
      try {
        await emailAPI.sendCoParentInviteEmail(
          email, 
          currentUser.name || 'A co-parent', 
          message || '',
          inviteLink
        );
        console.log("Invitation email sent successfully");
      } catch (emailError) {
        console.error("Error sending invitation email:", emailError);
        // Don't block the invite creation if the email fails
        toast.warning("Invitation created but email notification might not have been sent.");
      }
      
      // Close the form and show success message
      setInviting(false);
      toast.success(`Invitation sent to ${email}`);
      
      // Update UI
      if (onInviteSent) {
        onInviteSent();
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
      
      <CoParentsList 
        currentUser={currentUser} 
        sentInvites={invites} 
        receivedInvites={receivedInvites}
      />
    </div>
  );
};

export default CoParentsTab;
