
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Parent, CoParentInvite } from "@/utils/types";
import CoParentInviteForm from "./CoParentInviteForm";
import CoParentsList from "./CoParentsList";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { toast } from "sonner";
import { emailAPI } from "@/lib/api/email";

interface CoParentsPanelProps {
  currentUser: Parent;
  sentInvites: CoParentInvite[];
  receivedInvites: CoParentInvite[];
  onInviteSent?: () => void;
}

const CoParentsPanel = ({
  currentUser,
  sentInvites,
  receivedInvites,
  onInviteSent
}: CoParentsPanelProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInvite } = useFamilyCircle();

  const handleSendInvite = async (email: string, message?: string) => {
    try {
      setIsSubmitting(true);
      
      // Validate email
      if (currentUser.email === email) {
        toast.error("You cannot invite yourself");
        setIsSubmitting(false);
        return;
      }
      
      // Send invitation
      const result = await createInvite(email, message);
      
      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }
      
      const invite = result.data;
      
      // Send email notification
      try {
        const inviteLink = `${window.location.origin}/accept-invite?id=${invite.id}`;
        await emailAPI.sendCoParentInviteEmail(
          email, 
          currentUser.name || 'A co-parent', 
          message || '',
          inviteLink
        );
      } catch (emailError) {
        console.error("Error sending invitation email:", emailError);
        toast.warning("Invitation created but email notification might not have been sent");
      }
      
      // Show success and close form
      toast.success(`Invitation sent to ${email}`);
      setShowInviteForm(false);
      
      // Update the list
      if (onInviteSent) {
        onInviteSent();
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Co-Parents</h3>
        <Button 
          onClick={() => setShowInviteForm(true)}
          disabled={showInviteForm}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Invite Co-Parent
        </Button>
      </div>

      {showInviteForm && (
        <CoParentInviteForm
          onSubmit={handleSendInvite}
          onCancel={() => setShowInviteForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <CoParentsList
        currentUser={currentUser}
        sentInvites={sentInvites}
        receivedInvites={receivedInvites}
      />
    </div>
  );
};

export default CoParentsPanel;
