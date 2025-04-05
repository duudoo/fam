
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoParentInvite, InviteStatus } from "@/utils/types";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, RefreshCw, Send, XCircle } from "lucide-react";
import { acceptInvite, declineInvite } from "@/lib/api/invites";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CoParentInviteForm from "./CoParentInviteForm";

interface InvitesListProps {
  invites: CoParentInvite[];
  type: "sent" | "received";
  onStatusChange: () => void;
  onResend?: (inviteId: string, email: string) => Promise<void>;
}

const InvitesList = ({ invites, type, onStatusChange, onResend }: InvitesListProps) => {
  const [processingInvites, setProcessingInvites] = useState<Record<string, boolean>>({});
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<CoParentInvite | null>(null);
  
  const handleAcceptInvite = async (inviteId: string) => {
    setProcessingInvites(prev => ({ ...prev, [inviteId]: true }));
    try {
      await acceptInvite(inviteId);
      toast.success("Invitation accepted");
      onStatusChange();
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    } finally {
      setProcessingInvites(prev => ({ ...prev, [inviteId]: false }));
    }
  };
  
  const handleDeclineInvite = async (inviteId: string) => {
    setProcessingInvites(prev => ({ ...prev, [inviteId]: true }));
    try {
      await declineInvite(inviteId);
      toast.success("Invitation declined");
      onStatusChange();
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    } finally {
      setProcessingInvites(prev => ({ ...prev, [inviteId]: false }));
    }
  };

  const handleOpenResendDialog = (invite: CoParentInvite) => {
    setSelectedInvite(invite);
    setResendDialogOpen(true);
  };
  
  const handleResendSuccess = () => {
    setResendDialogOpen(false);
    setSelectedInvite(null);
    onStatusChange();
  };
  
  const getStatusBadge = (status: InviteStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Accepted
        </Badge>;
      case 'declined':
        return <Badge variant="outline" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Declined
        </Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canResendInvite = (status: InviteStatus) => {
    return status === 'declined' || status === 'expired';
  };

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div 
          key={invite.id} 
          className="p-4 border rounded-md bg-white flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div>
            <div className="font-medium">{invite.email}</div>
            <div className="text-sm text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
              <span>Sent {formatDistanceToNow(new Date(invite.invitedAt), { addSuffix: true })}</span>
              {invite.respondedAt && (
                <span>Responded {formatDistanceToNow(new Date(invite.respondedAt), { addSuffix: true })}</span>
              )}
            </div>
            {invite.message && (
              <div className="text-sm mt-2 border-l-2 pl-2 border-gray-300 italic text-gray-600">
                "{invite.message}"
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:ml-2 mt-2 md:mt-0">
            {getStatusBadge(invite.status)}
            
            {type === "received" && invite.status === "pending" && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAcceptInvite(invite.id)}
                  disabled={processingInvites[invite.id]}
                >
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeclineInvite(invite.id)}
                  disabled={processingInvites[invite.id]}
                >
                  Decline
                </Button>
              </div>
            )}

            {type === "sent" && canResendInvite(invite.status) && (
              <Dialog open={resendDialogOpen && selectedInvite?.id === invite.id} onOpenChange={(open) => {
                if (!open) setSelectedInvite(null);
                setResendDialogOpen(open);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleOpenResendDialog(invite)}
                    disabled={processingInvites[invite.id]}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" /> Resend
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Resend Invitation</DialogTitle>
                    <DialogDescription>
                      Send a new invitation to {selectedInvite?.email}
                    </DialogDescription>
                  </DialogHeader>
                  {selectedInvite && (
                    <CoParentInviteForm 
                      onSuccess={handleResendSuccess}
                      onCancel={() => setResendDialogOpen(false)}
                      defaultMessage={selectedInvite.message || undefined}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      ))}

      {invites.length === 0 && (
        <div className="p-4 text-center text-gray-500 border rounded-md bg-gray-50">
          No invitations found.
        </div>
      )}
    </div>
  );
};

export default InvitesList;
