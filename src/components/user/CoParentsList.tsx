import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Parent, CoParentInvite } from "@/utils/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { acceptInvite, declineInvite } from "@/lib/api/invites";

interface CoParentsListProps {
  currentUser: Parent;
  sentInvites: CoParentInvite[];
  receivedInvites?: CoParentInvite[];
}

const CoParentsList = ({ currentUser, sentInvites, receivedInvites = [] }: CoParentsListProps) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
      toast.success("Invitation accepted");
      // You would normally refresh the invites here
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation");
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await declineInvite(inviteId);
      toast.success("Invitation declined");
      // You would normally refresh the invites here
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Failed to decline invitation");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Primary Account (You)</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <div className="p-6 pt-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-famacle-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-medium">{currentUser.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              {currentUser.phone && (
                <p className="text-sm text-muted-foreground">{currentUser.phone}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {receivedInvites && receivedInvites.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Invitations Received</h3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received On</TableHead>
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
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          invite.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                          invite.status === "accepted" ? "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
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
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeclineInvite(invite.id)}
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
          </Card>
        </div>
      )}

      {sentInvites.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Invitations Sent</h3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentInvites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell>{invite.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invite.status)}
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          invite.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                          invite.status === "accepted" ? "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invite.invitedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CoParentsList;
