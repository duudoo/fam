
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Parent, CoParentInvite } from "@/utils/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Check, Clock, X } from "lucide-react";

interface CoParentsListProps {
  currentUser: Parent;
  invites: CoParentInvite[];
}

const CoParentsList = ({ currentUser, invites }: CoParentsListProps) => {
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

  return (
    <div className="space-y-4">
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

      {invites.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Co-Parent Invitations</h3>
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
                {invites.map((invite) => (
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
