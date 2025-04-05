
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Parent, CoParentInvite } from "@/utils/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Clock, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { acceptInvite, declineInvite } from "@/lib/api/invites";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CoParentsListProps {
  currentUser: Parent;
  sentInvites: CoParentInvite[];
  receivedInvites: CoParentInvite[];
}

const CoParentsList = ({ currentUser, sentInvites, receivedInvites }: CoParentsListProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'declined':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    setProcessingId(inviteId);
    try {
      await acceptInvite(inviteId);
      toast.success("Invitation accepted");
      // Note: In a real app, you would refresh the invites list here
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    setProcessingId(inviteId);
    try {
      await declineInvite(inviteId);
      toast.success("Invitation declined");
      // Note: In a real app, you would refresh the invites list here
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {receivedInvites.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Invitations Received</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivedInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.invitedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invite.status)}
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invite.status)}`}>
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invite.invitedAt)}</TableCell>
                    <TableCell>
                      {invite.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcceptInvite(invite.id)}
                            disabled={processingId === invite.id}
                          >
                            {processingId === invite.id ? <Clock className="h-3 w-3 animate-spin" /> : "Accept"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineInvite(invite.id)}
                            disabled={processingId === invite.id}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Invitations Sent</CardTitle>
        </CardHeader>
        <CardContent>
          {sentInvites.length === 0 ? (
            <Alert>
              <AlertDescription>
                You haven't sent any invitations yet. Use the "Invite Co-Parent" button to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invite.status)}
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(invite.status)}`}>
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invite.invitedAt)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {invite.message || "No message"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoParentsList;
