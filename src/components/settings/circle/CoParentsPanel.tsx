
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InviteCoParentForm from "./InviteCoParentForm";
import InvitesList from "./InvitesList";
import { CoParentInvite, Parent } from "@/utils/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface CoParentsPanelProps {
  currentUser: Parent;
  sentInvites: CoParentInvite[];
  receivedInvites: CoParentInvite[];
  onInviteSent: () => void;
  error?: string | null;
  receiveError?: string | null;
}

const CoParentsPanel = ({ 
  currentUser, 
  sentInvites, 
  receivedInvites,
  onInviteSent,
  error,
  receiveError
}: CoParentsPanelProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Received Invites Section - Only show if there are invites or a specific error for received invites */}
      {((receivedInvites && receivedInvites.length > 0) || receiveError) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-3">Invitations for You</h3>
            {receiveError ? (
              <Alert variant="destructive">
                <AlertDescription>{receiveError}</AlertDescription>
              </Alert>
            ) : (
              <InvitesList 
                invites={receivedInvites} 
                type="received" 
                onStatusChange={onInviteSent}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Invite Form or Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Co-Parent Invitations</h3>
        {!showInviteForm && (
          <Button 
            onClick={() => setShowInviteForm(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Invite Co-Parent
          </Button>
        )}
      </div>
      
      {showInviteForm ? (
        <InviteCoParentForm 
          currentUser={currentUser} 
          onInviteSent={() => {
            onInviteSent();
            setShowInviteForm(false);
          }}
          onCancel={() => setShowInviteForm(false)}
        />
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        sentInvites && sentInvites.length > 0 ? (
          <InvitesList 
            invites={sentInvites} 
            type="sent" 
            onStatusChange={onInviteSent}
          />
        ) : (
          <Alert>
            <AlertDescription>
              You haven't invited any co-parents yet. Click the button above to send an invitation.
            </AlertDescription>
          </Alert>
        )
      )}
    </div>
  );
};

export default CoParentsPanel;
