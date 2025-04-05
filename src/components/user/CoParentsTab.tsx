
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoParentInvite as CoParentInviteType, Parent } from "@/utils/types";
import { useFamilyCircle } from "@/hooks/useFamilyCircle";
import { emailAPI } from "@/lib/api/email";
import CoParentsList from "@/components/user/CoParentsList";
import CoParentInviteForm from "@/components/invite/CoParentInviteForm";
import InvitesList from "@/components/invite/InvitesList";

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
  const { resendInvite } = useFamilyCircle();

  const handleSendInvite = async (email: string, message?: string) => {
    // Invitation handling now happens directly in the CoParentInviteForm component
    setInviting(false);
    
    // Update UI
    if (onInviteSent) {
      onInviteSent();
    }
  };

  const handleResendInvite = async (inviteId: string, email: string) => {
    try {
      const result = await resendInvite(inviteId, email);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      if (onInviteSent) {
        onInviteSent();
      }
      
      toast.success(`New invitation sent to ${email}`);
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error("Failed to resend invitation");
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
            <CoParentInviteForm 
              onSuccess={() => {
                setInviting(false);
                if (onInviteSent) onInviteSent();
              }}
              onCancel={() => setInviting(false)}
            />
          </CardContent>
        </Card>
      ) : null}
      
      {/* Received invites section */}
      {receivedInvites && receivedInvites.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Invitations For You</h3>
          <InvitesList 
            invites={receivedInvites}
            type="received"
            onStatusChange={() => {
              if (onInviteSent) onInviteSent();
            }}
          />
        </div>
      )}
      
      {/* Sent invites section */}
      <div>
        <h3 className="text-lg font-medium mb-3">Invitations Sent</h3>
        <InvitesList 
          invites={invites}
          type="sent"
          onStatusChange={() => {
            if (onInviteSent) onInviteSent();
          }}
          onResend={handleResendInvite}
        />
      </div>
      
      {/* Active co-parents section */}
      <CoParentsList 
        currentUser={currentUser} 
        sentInvites={invites.filter(invite => invite.status === 'accepted')} 
        receivedInvites={receivedInvites.filter(invite => invite.status === 'accepted')}
      />
    </div>
  );
};

export default CoParentsTab;
